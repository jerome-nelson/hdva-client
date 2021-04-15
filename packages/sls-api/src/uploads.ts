import { Context } from "aws-lambda";
import S3 from "aws-sdk/clients/s3";
import querystring from "querystring";
import { ALLOWED_IMAGES, BucketInstance, IMAGE_SIZES } from "./config/config";
import { ERROR_MSGS } from "./config/messages";
import { BadRequest, GeneralError } from "./utils/error";
import { resizeImages } from "./utils/resize";
import { createErrorResponse, createResponse } from "./utils/responses";



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

    const req: S3.Types.PutObjectRequest = {
      Bucket: process.env.highres_bucket_name,
      Key: `properties/${path}`
    };

    // TODO: Not priority - how to protect against malformed images
    const s3PutObjectUrl = await BucketInstance.getSignedUrlPromise('putObject', req);
    console.log(s3PutObjectUrl);
    return createResponse(s3PutObjectUrl);
  } catch (e) {
    return createErrorResponse(e);
  }
}

/*
* This function should be triggered by S3 event on highresbucket instead
*/
export const sendToPublicBucket = async (event: any) => {

  if (!process.env.bucket_region) {
    throw new Error(ERROR_MSGS.BUCKET_REGION_NOT_SET);
  }

  const srcBucket = event.Records[0].s3.bucket.name;

  if (!process.env.web_bucket || !srcBucket) {
    throw new GeneralError(ERROR_MSGS.BUCKET_NOT_SET);
  }

  const sourcePath = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  try {
    const params = {
      Bucket: srcBucket,
      Key: sourcePath
    };

    const original = await BucketInstance.getObject(params).promise();
    if (!original.ContentType || !ALLOWED_IMAGES.includes(original.ContentType)) {
      throw new BadRequest(ERROR_MSGS.CONTENT_TYPE_NOT_SET);
    }

    for (let size of [IMAGE_SIZES.thumbnail, IMAGE_SIZES.slide]) {
      const body = await resizeImages(original, size);
      const type = sourcePath.match(/\.([^.]*)$/);
      const params = {
        Bucket: process.env.web_bucket as string,
        Key: sourcePath.replace(type![0], `-${size[0]}x${size[1]}${type![0]}`),
        Body: body,
        ContentType: "image"
      };
      await BucketInstance.putObject(params).promise();
    }
  } catch (error) {
    throw new Error(error);
  }
};