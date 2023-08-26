import db from '../config/database.js';

const table = 'users';

export async function getUserByEmail(email) {
  const query = `SELECT * FROM ${table} WHERE email = ?`;
  const [[rows]] = await db.execute(query, [email]);
  return rows;
}
