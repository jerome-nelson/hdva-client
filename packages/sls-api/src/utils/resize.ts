import S3 from "aws-sdk/clients/s3";
import sharp from "sharp";

export const resizeImages = async (original: S3.Types.GetObjectOutput, size: number[]) => {
      try { 
          return await sharp(original.Body).resize(size[0], size[1], { fit: 'cover', position: 'center' }).toBuffer();    
      } catch (error) {
          throw new Error(error);
      } 

}