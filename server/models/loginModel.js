import db from '../lib/database.js';

const table = 'users';

export async function getUsers() {
  const query = `SELECT * FROM ${table}`;
  const [rows] = await db.execute(query);
  return rows;
}

export async function getUserByEmail(email) {
  const query = `SELECT * FROM ${table} WHERE email = ?`;
  const [rows] = await db.execute(query, [email]);
  return rows[0];
}
