require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'prabhu@3321',
    database: process.env.DB_NAME || 'resume_forge',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

module.exports = dbConfig;
