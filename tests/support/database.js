const { Pool } = require('pg');

// provide db connection credentials
const DbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'zombieplus',
  password: 'pwd123',
  port: 5432,
};

// inilialize and handle errors within db connection
export async function executeSQL(sqlScript) {
  const pool = new Pool(DbConfig);

  try {
    const client = await pool.connect();

    const result = await client.query(sqlScript);
    console.log(result.rows);
  } catch (error) {
    console.log('Erro ao executar o SQL ' + error);
  }
}
