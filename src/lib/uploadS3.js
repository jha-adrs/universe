import { S3Client,PutObjectCommand } from "@aws-sdk/client-s3";
import {createRequestPresigner} from '@aws-sdk/s3-request-presigner'
//import fs from 'fs';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }

})

export const uploadS3 = async (file) => {
    // Get auth session
    console.log('uploadS3', typeof file, file)
    console.log('uploadS3', Object.keys(file), file.buffer, file.blob )
    console.log('uploadS3', file.name)
    const blob = new Blob([file], {type: 'image/png'})
    console.log('uploadS3 blob', blob)
    blob.arrayBuffer().then((buffer) => {
        console.log('uploadS3 buffer', buffer)
    })

    
}