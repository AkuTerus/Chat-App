import { randomBytes } from 'node:crypto';
import db from '../config/database.js';

const table = 'rooms';

export async function getUserByToken(token) {
  const query = `SELECT u.id, u.name, u.avatar
    FROM users u
    INNER JOIN login_details ld ON ld.email=u.email
    WHERE token = ?
  `;
  const [[user]] = await db.execute(query, [token]);
  return user;
}

async function getPartnerById(id) {
  const query = `SELECT * FROM users WHERE id = ?`;
  const [[partner]] = await db.execute(query, [id]);
  return partner;
}

// export
export async function createRoom(token, partnerid) {
  if (!token || !partnerid) {
    return {
      code: 403,
      message: 'Invalid Format',
    };
  }

  const user = await getUserByToken(token);
  if (!user) {
    return {
      code: 403,
      message: 'Unauthorized user to perform action',
    };
  }
  console.log(`user.id: ${user.id}`);

  const partner = await getPartnerById(partnerid);
  if (!partner) {
    return {
      code: 403,
      message: 'Unkown partner user',
    };
  }
  console.log(`partnerid: ${partnerid}`);

  const roomName = randomBytes(16).toString('hex');

  const query = `INSERT INTO rooms (name, type) VALUES (?, ?)`;
  const [room] = await db.execute(query, [roomName, 1]);
  const roomid = room.insertId;
  console.log(`roomid: ${roomid}`);

  const queryParticipant = `INSERT INTO participants (room_id,user_id) VALUES (?,?)`;
  const insertUser1 = await db.execute(queryParticipant, [roomid, user.id]);
  const insertUser2 = await db.execute(queryParticipant, [roomid, partnerid]);

  return {
    code: 200,
    message: 'Room created succesfully',
    roomName: roomName,
  };
}

export async function getRoomByName(name) {
  const query = `SELECT * FROM rooms WHERE name = ?`;
  const [[room]] = await db.execute(query, [name]);
  return room;
}

// export
export async function getPartnerByRoomId(roomid, userid) {
  const query = `
    SELECT u.id, u.name, u.avatar
    FROM users u
    INNER JOIN participants p ON p.user_id = u.id
    INNER JOIN rooms r ON r.id = p.room_id
    WHERE r.id = ? AND u.id != ?
  `;

  const [[partner]] = await db.execute(query, [roomid, userid]);
  return partner;
}

export async function getMessagesByRoomId(roomid) {
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
}
