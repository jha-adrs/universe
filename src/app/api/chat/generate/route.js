import { getAuthSession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(req){
    try {
        logger.info("Starting chat generation", req.body);
        const session = await getAuthSession();
        if(!session?.user){
            return new Response("Unauthorized", {status: 401})
        }
        const body = await req.json();

        const special_key = process.env.SPECIAL_PRIVILEGES_KEY;
         // TODO: DO this internally instead of external API Call
        const response = await fetch("http://localhost:5000/chat/generate", {
            method: "POST",
            headers: {
                "private-key": special_key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: body.query,

            })
        });

        // This data is a ReadableStream
        const data = response?.body;
        if (!data) {
            logger.error("No data in response");
            return;
        }
        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let result = '';

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
                result += decoder.decode(value);
            }
        }
        logger.info('result', result);

        return new Response(result, {status: 200})

    } catch (error) {
        logger.error(error)
        return new Response(JSON.stringify({ success: 0, error: error.message }), { status: 500 })
    }
}