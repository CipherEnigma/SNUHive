import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
    console.error('Missing required environment variables');
    process.exit(1);
}

// Create connection pool with only supported options
const pool = mysql.createPool({
    // Basic connection settings
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    // Pool configuration
    connectionLimit: 50,
    waitForConnections: true,
    queueLimit: 25,

    // Timeout in milliseconds
    connectTimeout: 60000
});

// Test database connection
try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('SELECT 1');
    console.log('Successfully connected to MySQL database');
    connection.release();
} catch (error) {
    console.error('Failed to connect to database:', {
        message: error.message,
        code: error.code,
        state: error.sqlState
    });
    process.exit(1);
}

export default pool;