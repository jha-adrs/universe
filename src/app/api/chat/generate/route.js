import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { ChatSchema } from "@/lib/validators/chat";
import { Client } from "pg";

export async function POST(req) {
    try {
        logger.info("Starting chat generation", req.body);
        const session = await getAuthSession();
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }
        const body = await req.json();
        const { query, stream_required } = ChatSchema.parse(body);
        logger.info("Chat generation request", query, stream_required);
        let prompt = '';
        // OpenAI
        const response = await fetch('https://api.openai.com/v1/embeddings', {
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
                model: 'text-embedding-ada-002',
                input: query,
            }),
        });
        const responseJson = await response.json();
        const q_embeddings = responseJson['data'][0]['embedding'];
        const q_embeddings_str = q_embeddings.toString().replace(/\.\.\./g, '');

        // Query DB
        const client = new Client({ connectionString: process.env.NEON_PG_DB_CONNECTION_STRING, ssl: { rejectUnauthorized: false } });
        await client.connect();
        const insertQuery = `
      SELECT text
      FROM (
        SELECT text, n_tokens, embeddings,
        (embeddings <=> '[${q_embeddings_str}]') AS distances,
        SUM(n_tokens) OVER (ORDER BY (embeddings <=> '[${q_embeddings_str}]')) AS cum_n_tokens
        FROM "public"."Documents"
        ) subquery
        WHERE cum_n_tokens <= 1700
      ORDER BY distances ASC;
      `;
        //logger.info("Insert response", insertQuery);
        //const queryParams = [1700];
        logger.info('Querying database...');
        const { rows } = await client.query(insertQuery);
        await client.end();
        const context = rows.reduce((acc, cur) => {
            return acc + cur.text;
        }, '');
        prompt = `You are an enthusiastic chatbot for an university and named Max, 
        helping students about different aspects of the university. 
        Answer the question asked by students based on the context below, 
        you should be polite always and paraphrase your ansers according to question asked , 
        also be descriptive and helpful, but also avoid giving subjective answers and 
        do not speak ill of any person or organisation and all questions are related to university directly or indirectly.
        If the question can't be answered based on the context, say 
        "Sorry :( I don't have much information about this."\n\nContext: ${context}\n\n---\n\nQuestion: ${query}\nAnswer:`;

        // OpenAI completions
        const output = await getOpenAIChoices(prompt);
        logger.info(output);
        // Also insert into DB
        insertChatHistory(query, output,session);
        return new Response( output , { status: 200 });

    } catch (error) {
        logger.error(error)
        return new Response(JSON.stringify({ success: 0, error: "Something went wrong!" }), { status: 500 })
    }
}
const insertChatHistory = async (query, output,session) => {
    const res = await db.chathistory.create({
        data:{
            question: query,
            answer: output,
            user:{
                connect:{
                    id: session?.user.id
                }
            }
        }
    })
}
const getOpenAIChoices = (prompt) => {
    return new Promise((resolve, reject) => {
        fetch('https://api.openai.com/v1/completions', {
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-instruct',
                prompt,
                temperature: 0.9,
                n: 1,
                max_tokens: 2000,
                stream: false
            }),
        }).then(response => response.json())
          .then(data => {
            let output = '';
            const { choices } = data;
            const { text } = choices[0];
            output += text?.toString();
            resolve(output);
        }).catch((error) => {
            reject(error)
        })
    });
}