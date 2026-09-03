// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Criamos um Pool de conexões para garantir eficiência e performance
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
//comunicacao com db
pool.on('connect', () => {
  console.log('Conectado!');
});
// protege contra SQL Injection
module.exports = {
  query: (text, params) => pool.query(text, params),
};