import {createEdgeRouter} from 'next-connect';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const router = createEdgeRouter();
const upload = multer();

const uploadS3 = router
    .use(upload.single('file'))
    .post(async (req, res) => {
        const file = req.file;
        const key = Date.now().toString() + '-' + file.originalname;


        try {
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            });

            const response = await s3Client.send(command);
            const url = await getSignedUrl(s3, command, { expiresIn: 86400*7 }); // 1 hour
            return res.status(200).json({ url });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error uploading file to S3' });
        }
    });

export default uploadS3;
