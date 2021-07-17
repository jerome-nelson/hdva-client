import { BucketInstance, IMAGE_SIZES } from "../config/config";
import { ERROR_MSGS } from "../config/messages";
import { GeneralError } from "../utils/error";

/*
* This function should be triggered by S3 event on highresbucket instead
*/
export const deleteFromPublicBucket = async (event: any) => {

    if (!process.env.web_bucket) {
      throw new GeneralError(ERROR_MSGS.BUCKET_NOT_SET);
    }
  
    const sourcePath = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    try {
      const sizes = [IMAGE_SIZES.thumbnail, IMAGE_SIZES.slide];
      for (const size of sizes) {
        const type = sourcePath.match(/\.([^.]*)$/);
        const params = {
          Bucket: process.env.web_bucket,
          Key: sourcePath.replace(type![0], `-${size[0]}x${size[1]}${type![0]}`),
        };
  
        await BucketInstance.deleteObject(params).promise();      
      }
  
      return;
    } catch (error) {
      throw error;
    }
  };