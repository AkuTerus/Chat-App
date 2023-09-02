import { randomBytes } from 'node:crypto';
import db from '../config/database.js';

const table = 'rooms';

async function getUserIdByToken(token) {
  const query = `SELECT u.id
    FROM users u
    INNER JOIN login_details ld ON ld.email=u.email
    WHERE token=?
  `;
  const [[userid]] = await db.execute(query, [token]);
  return userid ? true : false;
}

async function isExistPartner(id) {
  const query = `SELECT * FROM users WHERE id = ?`;
  const [[userid]] = await db.execute(query, [id]);
  return userid ? true : false;
}

export async function createRoom(token, partnerid) {
  if (!token || !partnerid) {
    return {
      code: 403,
      message: 'Invalid Format',
    };
  }

  const userid = await getUserIdByToken(token);
  if (!userid) {
    return {
      code: 403,
      message: 'Unauthorized user to perform action',
    };
  }
  console.log(`userid: ${userid}`);

  const partner = await isExistPartner(partnerid);
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
  const insertUser1 = await db.execute(queryParticipant, [roomid, userid]);
  const insertUser2 = await db.execute(queryParticipant, [roomid, partnerid]);

  return {
    code: 200,
    message: 'Room created succesfully',
    roomName: roomName,
  };
}
