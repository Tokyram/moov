const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
});

async function initDb() {
  const client = await pool.connect();
  try {
    const sqlScript = fs.readFileSync(path.join(__dirname, 'script.sql'), 'utf8');
    console.log('Chemin du script SQL:', path.join(__dirname, 'script.sql'));
    console.log('Initialisation de la base de données avec le script SQL.');
    await client.query(sqlScript);
  } catch (err) {
    console.error('Erreur lors de l\'exécution du script SQL:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb: initDb
};
