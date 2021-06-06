import S3 from "aws-sdk/clients/s3";

export const ALLOWED_IMAGES = ["image/jpeg", "image/png"];
export const IMAGE_SIZES = {
    thumbnail: [35, 35],
    slide: [500, 250]
};
export const BucketInstance = new S3({
    endpoint: "s3.amazonaws.com",
    signatureVersion: 'v4',
    region: process.env.bucket_region || ""
});