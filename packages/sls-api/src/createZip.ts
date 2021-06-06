import archiver from 'archiver';
import { Context } from 'aws-lambda';
import querystring from "querystring";
import { Stream } from 'stream';
import { BucketInstance } from "./config/config";
import { ERROR_MSGS } from './config/messages';
import { getMedia, MongoMediaDocument } from './models/media.model';
import { getProperties } from "./models/properties.model";
import { startMongoConn } from './utils/db';
import { GeneralError } from './utils/error';
import { createErrorResponse, createResponse } from './utils/responses';

const _convertToSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        ;
}

const _retrieveArchive = async (bucketName: string, fileKey: string) => {
    try {
        await BucketInstance.getObject({
            Bucket: bucketName,
            Key: fileKey,

        }).promise();

        return await BucketInstance.getSignedUrlPromise("getObject", {
            Bucket: bucketName,
            Key: fileKey,

        });

    } catch (e) {
        // TODO: How to log
        console.log(`createZip error: `, e);
        return;
    }
}

const _getDataObjects = (files: MongoMediaDocument[], folder: string) => files.map((media) => {
    const file = `properties/${folder}/${media.resource}`;
    const stream = BucketInstance.getObject({
        Bucket: process.env.highres_bucket_name as string,
        Key: file
    }).createReadStream()
    return {
        stream,
        filename: `${file.split('/').pop()}`
    }
});


export const _getProperty = async (id: number[]) => {
    await startMongoConn();
    const files = await getMedia(id);
    const property = await getProperties({
        pids: [String(id[0])]
    });

    if (!property.length || !files.length) {
        throw new Error("No media found");
    }

    return {
        zipname: `${_convertToSlug(property[0].name)}.zip`,
        files,
        property
    }
}

export const getZip = async (event: any, context: Context) => {

    context.callbackWaitsForEmptyEventLoop = false;

    if (!process.env.highres_bucket_name || !process.env.zip_bucket_name) {
        throw new GeneralError(ERROR_MSGS.BUCKET_NOT_SET);
    }


    const { body } = event;
    const { pid } = querystring.parse(body);

    const id = [Number(pid)];

    try {
        const results = await _getProperty(id);
        const existingArchive = await _retrieveArchive(process.env.zip_bucket_name, results.zipname);

        if (existingArchive) {
            return createResponse(existingArchive)
        }

        const getArchiveContent = _getDataObjects(results.files, results.property[0].folder);
        const passThrough = new Stream.PassThrough();

        const url = await new Promise((resolve, reject) => {
            const s3Upload = BucketInstance.upload({
                Bucket: process.env.zip_bucket_name as string,
                ContentType: "application/zip",
                Key: results.zipname,
                Body: passThrough
            }, async function (err) {
                if (err) {
                    console.error("upload error", err);
                    reject(err);
                }
                else {
                    const zipurl = await BucketInstance.getSignedUrlPromise("getObject", {
                        Bucket: process.env.zip_bucket_name,
                        Key: results.zipname,

                    });
                    resolve(zipurl);
                }
            })
            const archive = archiver('zip');
            archive.pipe(passThrough);
            archive.on("error", (error: any) => {
                throw new Error(
                    `${error.name} ${error.code} ${error.message} ${error.path}  ${error.stack}`
                )
            });

            for (let i = 0; i < getArchiveContent.length; i += 1) {
                archive.append(getArchiveContent[i].stream, {
                    name: getArchiveContent[i].filename,
                })
            }

            passThrough
                .on('error', (err) => {
                    console.error(err)
                    reject(err);
                });

            archive.finalize();
        });

        return createResponse(url);
    } catch (e) {
        return createErrorResponse(e);
    }
}
