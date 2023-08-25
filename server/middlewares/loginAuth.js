import { createHash, randomBytes } from 'node:crypto';
import db from '../config/database.js';

// export
export function createTokenOnSuccessLogin(req, res, next) {
  const token = createHash('sha256').update(randomBytes(32)).digest('base64');
  req.session.token = token;
  next();
}

// export
export async function accessibleOnLogin(req, res, next) {
  const validUserData = await validateLogin(req);
  if (!validUserData) {
    req.session.user = undefined;
    console.log(`Middleware - loginAuth | Invalid Token redirect to login`);
    return res.redirect('/login');
  }
  req.session.user = validUserData;
  next();
}

// export
export async function accessibleOnLogout(req, res, next) {
  const isLoginValid = await validateLogin(req);
  if (isLoginValid) {
    console.log(`Middelware - loginAuth | Already Logged In redirect back`);
    return res.redirect(req.originalUrl);
  }
  next();
}

async function validateLogin(req) {
  // check token exists
  if (!req.session.token) return false;

  // get loginDetail from token and email
  const queryLoginDetail = `SELECT * FROM login_details WHERE token=?`;
  const [[loginDetail]] = await db.execute(queryLoginDetail, [req.session.token]);

  // validate loginDetail
  if (!loginDetail) return false;
  if (loginDetail.ip != req.ip) return false;

  const queryUser = `SELECT * from users WHERE email=?`;
  const [[user]] = await db.execute(queryUser, [loginDetail.email]);

  return {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}
