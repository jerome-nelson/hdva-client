import S3 from 'aws-sdk/clients/s3';
import { Request, Response } from 'express';
import fs from "fs";
import { config } from "./config";



export function sendToS3(req: Request, res: Response) {

    const s3 = new S3({ 
        apiVersion: '2006-03-01',
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
        region: config.aws.region
    });

    const params = { 
        ACL: 'public-read',
        Bucket: config.aws.imageBucket || "",
        Body: fs.createReadStream(req.file.path),
        Key: `userAvatar/${req.file.originalname}`
    };

    s3.putObject(params, function (err, data) {
        if (err) {
            console.log(err);
            res.json({ message: err.message })
        }
        else {
            console.log(data);
            console.log("Successfully uploaded data to " + config.aws.imageBucket + "/" +  `userAvatar/${req.file.originalname}`);
            res.json({ data: data })
        }
    });

}