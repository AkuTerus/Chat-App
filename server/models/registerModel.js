import db from '../config/database.js';

const table = 'users';

export async function isNewEmail(email) {
  const query = `SELECT * FROM ${table} WHERE email = ?`;
  const [[rows]] = await db.execute(query, [email]);
  return !rows ? true : false;
}

export async function createUser(values) {
  const query = `
    INSERT INTO ${table}
    (name, email, password, avatar)
    VALUES
    (?,?,?,?)
  `;
  const insert = await db.execute(query, values);
  return insert;
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
