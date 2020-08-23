export default {
    url: process.env.DB_HOST,
    serverPort: process.env.API_PORT,
    mongoUrl: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=${process.env.DB_NAME}`
}
