import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { FileUploadValidator } from "@/lib/validators/fileUpload";
import { parse } from "papaparse";


export async function POST(req) {
    try {
        logger.warn("POST /api/chat/documents");
        const data = await req.formData();
        let body = Object.fromEntries(data);
        
        const { file, secret } = FileUploadValidator.parse(body);
        if(secret !== process.env.FILE_UPLOAD_SECRET) {
            return new Response("Unauthorized", { status: 401 });
        }
        //Convert file to csvString
        let csvString = await file.text();
        let rows = await parseCSV(csvString);  
        
        if(rows?.success !== 1) {
            return new Response("Error in parsing csv file", { status: 500 });
        }
        else{
            handleInsertion(rows?.data);
            return new Response("Will be inserted soon", { status: 200 });
        }

    } catch (error) {
        logger.error(error);
        return new Response("Error in file upload", { status: 500 });
    }
} 

const parseCSV =  (file) => {
        return new Promise((resolve, reject) => {
            try {
                logger.info("Parsing CSV file");
                
                parse(file,{
                    header: true,
                    worker: true,
                    complete: function(results) {
                        resolve({success:1, data:results.data});
                    },
                    error: function(error) {
                        reject(error);
                    }
                
                })
            } catch (error) {
                logger.error("Error in file parsing",error);
                reject(error);
            }
        });
}

const handleInsertion = async (rows) => {
    try {
        logger.info("Inserting rows", typeof rows, rows.length);
        // Insert rows into database
        
        // Use for each
         rows.forEach(async (row,index) => {
            let { text, n_tokens, embeddings } = row;
            const tokens = parseInt(n_tokens);
            //let response = await db.$executeRaw`INSERT INTO "public"."Documents" ("id","text", "n_tokens", "embeddings") VALUES (${i+1},${text}, ${tokens}, ${embeddings}::text as vector ) `
            const res = await db.$executeRaw`INSERT INTO "public"."Documents" ("id","text", "n_tokens", "embeddings") VALUES (${index+1},${text}, ${tokens}, ${embeddings}::vector ) `;
            logger.info("Inserted row", res);
         });

        logger.info("Inserted rows"); 

    } catch (error) {
        logger.error("Error in inserting rows", error);
    }
}