import { createHash, randomBytes } from 'node:crypto';
import db from './../config/database.js';

// export
export function createTokenOnSuccessLogin(req, res, next) {
  const token = createHash('sha256').update(randomBytes(32)).digest('base64');
  req.session.token = token;
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

  return loginDetail;
}

// export
export async function accessibleOnLogin(req, res, next) {
  const loginDetail = await validateLogin(req);
  if (!loginDetail) {
    req.session.userEmail = undefined;
    console.log(`Middleware - loginAuth | Invalid Token redirect to login`);
    return res.redirect('/login');
  }
  req.session.userEmail = loginDetail.email;
  next();
}

// export
export async function accessibleOnLogout(req, res, next) {
  const isLoginValid = await validateLogin(req);
  if (isLoginValid) {
    console.log(`Middelware - loginAuth | Already Logged In redirect back`);
    return res.redirect('back');
  }
  next();
}
