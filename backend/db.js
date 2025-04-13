import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Devanit@1976',
  database: 'snuhive'
});

console.log("Connected to MySQL database");

export default db;
