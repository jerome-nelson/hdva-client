import archiver from "archiver";
import { Context } from 'aws-lambda';
import S3 from "aws-sdk/clients/s3";
import querystring from "querystring";
import { Stream } from "stream";
import { BucketInstance } from "../../config/config";
import { ERROR_MSGS } from "../../config/messages";
import { getMedia, MongoMediaDocument } from "../../models/media.model";
import { getProperties, MongoPropertiesDocument } from "../../models/properties.model";
import { startMongoConn } from "../../utils/db";
import { GeneralError } from "../../utils/error";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const convertToSlug = (text: string): string => {
    return String(text)
        .toLowerCase()
        .replace(/[\\, /, :, *, ?, ", <, >, |]+/g, "-")
        .replace(/ +/g, '-');
}

export const retrieveArchive = async (bucketName: string, fileKey: string): Promise<string> => {
    try {
        await BucketInstance.getObject({
            Bucket: bucketName,
            Key: fileKey
        }).promise();

        return await BucketInstance.getSignedUrlPromise("getObject", {
            Bucket: bucketName,
            Key: fileKey
        });

    } catch (e) {
        return "";
    }
}

export const getProperty = async (id: number[]): Promise<{ zipname: string; files: MongoMediaDocument[]; property: MongoPropertiesDocument[] } | void> => {
    try {
        await startMongoConn();
        const files = await getMedia(id);
        const property = await getProperties({
            pids: [Number(id[0])]
        });
    
        if (!property.length || !files.length) {
            throw new Error("No media found");
        }
    
        return {
            zipname: `${convertToSlug(property[0].name)}.zip`,
            files,
            property
        }
    } catch (e) {
        return;
    }

}

export const getZip = async (event: any, context: Context) => {

    context.callbackWaitsForEmptyEventLoop = false;

    
    try {
        if (!process.env.highres_bucket_name || !process.env.zip_bucket_name) {
            throw new GeneralError(ERROR_MSGS.BUCKET_NOT_SET);
        }
    
        const { body } = event;
        const { pid } = querystring.parse(body);
        const id = [Number(pid)];
    
        const results = await getProperty(id);

        if (!results) {
            throw new Error("No results");
        }

        const existingArchive = await retrieveArchive(process.env.zip_bucket_name, results.zipname);

        if (existingArchive) {
            return createResponse(existingArchive);
        }

        const archive = archiver('zip');
        const passThrough = new Stream.PassThrough();
        archive.pipe(passThrough);

        archive.on('warning', function (error: any) {
            throw new Error(
                `${error.name} ${error.code} ${error.message} ${error.path}  ${error.stack}`
            );
        });
        
        archive.on("error", (error: any) => {
            throw new Error(
                `${error.name} ${error.code} ${error.message} ${error.path}  ${error.stack}`
            );
        });

        const filteredFiles = results.files.filter(({ type }) => type !== "vt");
        for (const media of filteredFiles) {
            const fileKey = `properties/${results.property[0].name}/${media.resource}`;
            const objectData = BucketInstance.getObject({
                Bucket: process.env.highres_bucket_name as string,
                Key: fileKey
            }).createReadStream();
            archive.append(objectData, {
                name:  `${fileKey.replace(`properties/${results.property[0].name}/`, "")}`,
            });
        }
        archive.finalize();

        const params = {
            Bucket: process.env.zip_bucket_name as string,
            ContentType: "application/zip",
            Key: results.zipname,
            Body: passThrough
        };
        const upload = new S3.ManagedUpload({ params: params });
        await new Promise((resolve, reject) => {
            upload.send(function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });

        const zipurl = await BucketInstance.getSignedUrlPromise("getObject", {
            Bucket: process.env.zip_bucket_name,
            Key: results.zipname,
        });
        return createResponse(zipurl);
    } catch (e) {
        return createErrorResponse(e);
    }
}
