import S3 from "aws-sdk/clients/s3";
import sharp from "sharp";
import { ALLOWED_IMAGES, BucketInstance, IMAGE_SIZES } from "../config/config";
import { ERROR_MSGS } from "../config/messages";
import { BadRequest, GeneralError } from "../utils/error";

const _resizeImages = async (original: S3.Types.GetObjectOutput, size: number[]) => {
    try { 
      console.log(original.Body);
        return await sharp(original.Body).resize(size[0], size[1], { fit: 'cover', position: 'center' }).toBuffer();    
    } catch (error) {

        if (error instanceof Error) {
          throw new Error(error.message);
        }

        throw new Error("resize: Unknown Error");

    } 
}


/*
* This function should be triggered by S3 event on highresbucket instead
*/
export const cleanAndGenerateFiles = async (event: any) => {

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
        const body = await _resizeImages(original, size);
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
      throw error;
    }
  };