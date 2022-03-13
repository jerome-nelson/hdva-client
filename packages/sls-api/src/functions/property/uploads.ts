import { Context } from "aws-lambda";
import S3 from "aws-sdk/clients/s3";
import { basename } from "path";
import querystring from "querystring";
import { ALLOWED_IMAGES, BucketInstance } from "../../config/config";
import { ERROR_MSGS } from "../../config/messages";
import { BadRequest, GeneralError } from "../../utils/error";
import { createErrorResponse, createResponse } from "../../utils/responses";

export const signedUrlGetObject = async (event: any, _: Context) => {
  try {
    if (!process.env.highres_bucket_name) {
      throw new GeneralError(ERROR_MSGS.BUCKET_NOT_SET);
    }

    const { path } = querystring.parse(event.body);
    const req = {
      Bucket: process.env.highres_bucket_name,
      Key: `properties/${path}`,
      Expires: 60 * 5
    };

    // TODO: Not priority - how to protect against malformed images
    const s3GetObjectUrl = await BucketInstance.getSignedUrlPromise('getObject', req);
    return createResponse(s3GetObjectUrl);
  } catch (e) {
    return createErrorResponse(e);
  }

};

/*
* Returns a signed url from s3 bucket instead, which we send to client
* This will be used to upload all files (thus bypassing 10mb limit)
* (Only used on images that are considered (full|high) OR larger than 10mb [improbable])
*/
export const signedUrlPutObject = async (event: any, _: Context) => {

  if (!process.env.bucket_region) {
    throw new Error(ERROR_MSGS.BUCKET_REGION_NOT_SET);
  }

  try {
    if (!process.env.highres_bucket_name) {
      throw new GeneralError(ERROR_MSGS.BUCKET_NOT_SET);
    }

    const { type, path } = querystring.parse(event.body);

    if (!ALLOWED_IMAGES.includes(type as string)) {
      throw new BadRequest(ERROR_MSGS.CONTENT_TYPE_NOT_SET);
    }

    const file = basename(`${path}`);
    const req: S3.Types.PutObjectRequest = {
      Bucket: process.env.highres_bucket_name,
      Key: `properties/${String(path).replace(file, file.toLowerCase())}`
    };

    // TODO: Not priority - how to protect against malformed images
    const s3PutObjectUrl = await BucketInstance.getSignedUrlPromise('putObject', req);
    return createResponse(s3PutObjectUrl);
  } catch (e) {
    return createErrorResponse(e);
  }
}



export async function deleteFromBucket(path: string) {
  try {

    if (!process.env.highres_bucket_name) {
      throw new GeneralError(ERROR_MSGS.BUCKET_NOT_SET);
    }

    const params = {
      Bucket: process.env.highres_bucket_name as string,
      Key: path
    };

    await BucketInstance.headObject(params).promise();
    await BucketInstance.deleteObject(params).promise();

  } catch (error) {
    throw error;
  }
}