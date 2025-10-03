// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const required = ['DB_HOST','DB_PORT','DB_NAME','DB_USER','DB_PASSWORD'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[ENV ERROR] Falta variable: ${key}`);
  }
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,   // <--- aquí el cambio
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432, // asegúrate que sea número
    dialect: "postgres",
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    dialectOptions: {
      ...(process.env.NODE_ENV === 'production' && {
        ssl: { require: true, rejectUnauthorized: false },
      }),
    },
  }
);

export default sequelize;
