import { randomBytes } from 'node:crypto';
import db from '../config/database.js';

const table = 'rooms';

export default {
  async getUserByToken(token) {
    const query = `SELECT u.id, u.name, u.avatar
      FROM users u
      INNER JOIN login_details ld ON ld.email=u.email
      WHERE token = ?
    `;
    const [[user]] = await db.execute(query, [token]);
    return user;
  },

  async getPartnerById(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const [[partner]] = await db.execute(query, [id]);
    return partner;
  },

  // export
  async createRoom(userid, partnerid) {
    const roomName = randomBytes(16).toString('hex');

    const query = `INSERT INTO rooms (name, type) VALUES (?, ?)`;
    const [room] = await db.execute(query, [roomName, 1]);
    const roomid = room.insertId;

    const queryParticipant = `INSERT INTO participants (room_id,user_id) VALUES (?,?)`;
    const insertUser1 = await db.execute(queryParticipant, [roomid, userid]);
    const insertUser2 = await db.execute(queryParticipant, [roomid, partnerid]);

    return {
      code: 200,
      message: 'Room created succesfully',
      roomid: roomid,
    };
  },

  async getRoomById(roomid) {
    const query = `SELECT * FROM rooms WHERE id = ?`;
    const [[room]] = await db.execute(query, [roomid]);
    return room;
  },

  async getUserByRoomId(roomid, userid) {
    const query = `
      SELECT u.id, u.name, u.avatar
      FROM users u
      INNER JOIN participants p ON p.user_id = u.id
      INNER JOIN rooms r ON r.id = p.room_id
      WHERE r.id = ? AND u.id = ?
    `;

    const [[user]] = await db.execute(query, [roomid, userid]);
    return user;
  },

  // export
  async getPartnerByRoomId(roomid, partnerid) {
    const query = `
      SELECT u.id, u.name, u.avatar
      FROM users u
      INNER JOIN participants p ON p.user_id = u.id
      INNER JOIN rooms r ON r.id = p.room_id
      WHERE r.id = ? AND u.id != ?
    `;

    const [[partner]] = await db.execute(query, [roomid, partnerid]);
    return partner;
  },

  async getMessagesByRoomId(roomid) {
    const query = `
      SELECT 
        m.id, m.sender_id, m.message, m.sent_at
      FROM messages m
      INNER JOIN rooms r ON r.id=m.room_id
      WHERE r.id = ?
      ORDER BY m.id
    `;

    const [messages] = await db.execute(query, [roomid]);
    return messages;
  },

  async getLatestMessageByLastMessageId(roomid, lastMessageId) {
    const query = `
      SELECT 
      m.id, m.sender_id, m.message, m.sent_at
      FROM messages m
      INNER JOIN rooms r ON r.id=m.room_id
      WHERE r.id = ? AND m.id > ?
      ORDER BY m.id
    `;

    const [messages] = await db.execute(query, [roomid, lastMessageId]);
    return messages;
  },

  async createMessage(roomid, userid, message) {
    const query = `
      INSERT INTO messages (room_id, sender_id, message)
      VALUES (?,?,?)
    `;

    const [_insertMessage] = await db.execute(query, [roomid, userid, message]);
    const { insertId } = _insertMessage;

    const queryGet = `SELECT * FROM messages WHERE id = ?`;
    const [[_message]] = await db.execute(queryGet, [insertId]);
    return _message;
  },
};
