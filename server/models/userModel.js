import db from '../config/database.js';

const table = 'users';

export async function getUserByEmail(email) {
  const query = `SELECT * FROM ${table} WHERE email = ?`;
  const [[rows]] = await db.execute(query, [email]);
  return rows;
}

export async function getHasChat(userId) {
  const query = `
    SELECT DISTINCT
      r.id AS room_id, r.name AS room_name,
      u.id AS user_id, u.name AS user_name, u.avatar AS user_avatar,
      m.message AS latest_message, m.sender_id AS latest_sender_id, m.sent_at AS latest_sent_at
    FROM rooms r
    INNER JOIN participants p ON r.id = p.room_id
    INNER JOIN users u ON u.id = p.user_id
    INNER JOIN (
      SELECT room_id, MAX(id) latest_id
      FROM messages
      GROUP BY room_id
    ) latest_msg ON latest_msg.room_id = r.id
    INNER JOIN
      messages m ON m.room_id = r.id AND m.id = latest_msg.latest_id
    WHERE
      p.room_id IN (
        SELECT room_id FROM participants WHERE user_id = :userId
      )
      AND p.user_id != :userId
    ;
  `;
  const [get, field] = await db.execute(query, { userId });
  console.log(get, field);
  return get;
}

export async function getHasNoChat(userId) {
  const query = `
    SELECT id, name, avatar
    FROM users
    WHERE id NOT IN (
      SELECT user_id FROM participants WHERE room_id IN (
        SELECT room_id FROM participants WHERE user_id = :userId
      )
    );
  `;
  const [get] = await db.execute(query, { userId });
  return get;
}