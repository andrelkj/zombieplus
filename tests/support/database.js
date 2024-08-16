require('dotenv').config();
const { Pool } = require('pg');

// provide db connection credentials
const DbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// inilialize and handle errors within db connection
export async function executeSQL(sqlScript) {
  const pool = new Pool(DbConfig);

  try {
    const client = await pool.connect();

    const result = await client.query(sqlScript);
    // console.log(result.rows);
  } catch (error) {
    console.log('Erro ao executar o SQL ' + error);
  }
}
