const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'clone-social',
  password: process.env.DB_PASS || 'lucas2006',
  port: 5432
});

async function setupDatabase() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'create_tables.sql'), 'utf8');
    await client.query(sql);
    console.log('Tabelas criadas com sucesso!');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase(); 