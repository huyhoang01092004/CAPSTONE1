import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Tạo connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Export mặc định để dùng trong models
export default db;
