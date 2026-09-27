import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'mahadbt_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(' Connected to MySQL database successfully (`mahadbt_db`)');
    connection.release();
  } catch (error) {
    console.error(' MySQL Connection Error:', error.message);
    console.error('Tip: Make sure MySQL is running on port 3306 and check credentials in backend/.env');
  }
})();

export default pool;
