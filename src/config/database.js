const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Debugging Variable
console.log("-------------------------------------");
console.log("🔍 CONFIG DATABASE (MySQL):");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("-------------------------------------");

const sequelize = new Sequelize(
    process.env.DB_NAME,      // Harus sesuai dengan .env
    process.env.DB_USER, 
    process.env.DB_PASS || "", 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',     // <--- WAJIB 'mysql'
        port: 3306,           // <--- Port Default MySQL
        logging: false,
    }
);

module.exports = sequelize;