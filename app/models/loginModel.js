import db from './../config/database.js';

const table = 'users';

export default {
  async getUserByEmail(email) {
    const query = `SELECT * FROM ${table} WHERE email = ?`;
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  },

  async insertLoginDetails(data) {
    const query = `
      INSERT INTO 
      login_details (email, token, ip)
      VALUES (?,?,?)
    `;
    const insert = await db.execute(query, data);
    return insert;
  },
};
