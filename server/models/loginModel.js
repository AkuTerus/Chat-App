import db from '../config/database.js';

const table = 'users';

export async function getUserByEmail(email) {
  const query = `SELECT * FROM ${table} WHERE email = ?`;
  const [rows] = await db.execute(query, [email]);
  return rows[0];
}

export async function insertLoginDetails(data) {
  const query = `
    INSERT INTO 
    login_details (email, token, ip)
    VALUES (?,?,?)
  `;
  const insert = await db.execute(query, data);
  return insert;
}
