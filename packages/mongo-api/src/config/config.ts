export const config = {
    aws: {
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
        region: process.env.REGION,
        imageBucket: process.env.AWSBUCKET,
    },
    jwtToken: process.env.JWT,
    url: `db`,
    serverPort: process.env.API_PORT,
    mongoUrl: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@db:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.DB_NAME}`
}
