import db from './../../config/database.js';

const table = 'users';

export default {
  isNewEmail: async (email) => {
    const query = `SELECT * FROM ${table} WHERE email = ?`;
    const [[rows]] = await db.execute(query, [email]);
    return !rows ? true : false;
  },

  createUser: async (values) => {
    const query = `
      INSERT INTO ${table}
      (name, email, password, avatar)
      VALUES
      (?,?,?,?)
    `;
    const insert = await db.execute(query, values);
    return insert;
  },

  insertLoginDetails: async (data) => {
    const query = `
      INSERT INTO 
      login_details (email, token, ip)
      VALUES (?,?,?)
    `;
    const insert = await db.execute(query, data);
    return insert;
  },
};
