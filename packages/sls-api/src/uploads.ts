import { Context } from "aws-lambda";
import S3 from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from 'uuid';
import { ALLOWED_IMAGES } from "./config/config";
import { ERROR_MSGS } from "./config/messages";
import { BadRequest, GeneralError } from "./utils/error";
import { createErrorResponse, createResponse } from "./utils/responses";

const s3 = new S3();
/*
* Returns a signed url from s3 bucket instead, which we send to client
* This will be used to upload all files (thus bypassing 10mb limit)
*/
export const signedURL = async (event: any, _: Context) => {

  try {
    if (!process.env.bucketname) {
      throw new GeneralError(ERROR_MSGS.BUCKET_NOT_SET);
    }

    const eventId = event.pathParameters.eventId;
    const body = JSON.parse(event.body);
    
    if (!ALLOWED_IMAGES.includes(body.type)) {
      throw new BadRequest(ERROR_MSGS.CONTENT_TYPE_NOT_SET);
    }

    const photoId = uuidv4();
    const req: S3.Types.PutObjectRequest = {
      Bucket: process.env.bucketname,
      Key: `uploads/event_${eventId}/${photoId}.jpg`,
      ContentType: body.type,
      CacheControl: 'max-age=31557600',
      Metadata: {
        type: body.type,
        title: body.title,
        description: body.description,
        photoId,
        eventId,
      },
    };

    const s3PutObjectUrl = await s3.getSignedUrlPromise('putObject', req);
    const signed: any = {
      photoId,
      s3PutObjectUrl,
    };
    return createResponse(signed);
  } catch (e) {
    return createErrorResponse(e);
  }
}