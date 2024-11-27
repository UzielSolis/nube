import { Request } from 'express';
import multer from 'multer';
import multers3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
    region: process.env._REGION,
    credentials: {
        accessKeyId: process.env._AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env._AWS_SECRET,
        sessionToken: process.env._AWS_SESSION_TOKEN
    },
    endpoint: `https://s3.${process.env.S3_REGION}.amazonaws.com`, // Set the correct endpoint based on your bucket's region
	forcePathStyle: false, // Optional: Use the virtual-hosted–style URLs
});

const s3Storage = multers3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
        cb(null, { ...file });
    },
    key: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: s3Storage
})

export default upload;