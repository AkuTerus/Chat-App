import express from 'express';
import { checkSchema } from 'express-validator';

import upload from './../config/upload.js';
import { loginSchema, registerSchema } from './../config/validations.js';
import { validate } from './middleware/validator.js';
import auth from './middleware/auth.js';

import userController from './controllers/userController.js';
import roomController from './controllers/roomController.js';
import registerController from './controllers/registerController.js';
import loginController from './controllers/loginController.js';
import logoutController from './controllers/logoutController.js';

const route = express.Router();

/* logger */
route.use((req, res, next) => {
  console.log(`${req.method} ${req.path} -- `, new Date().toLocaleString());
  // console.log(`req.session.token = ${req.session.token}`);
  next();
});

/* default redirect root path */
route.get('/', (req, res) => {
  return res.redirect('/user');
});

/* middleware for menu accesibility */
route.use(['/login', '/register'], auth.accessibleOnLogout);
route.use(['/user', '/room'], auth.accessibleOnLogin);

/* 
|-----------------------------------------------------------------------------
| Routing
|-----------------------------------------------------------------------------
*/

/* register */
route.get('/register', registerController.index);
route.post(
  '/register',
  [upload.single('avatar'), checkSchema(registerSchema), validate, auth.createTokenOnSuccessLogin],
  registerController.store
);

/* login */
route.get('/login', loginController.index);
route.post('/login', [checkSchema(loginSchema), validate, auth.createTokenOnSuccessLogin], loginController.store);

/* logout */
route.get('/logout', logoutController.index);

/* user */
route.get('/user', userController.index);

/* chat */
route.get('/room/:roomid', roomController.getRoomById);
route.get('/room/:roomid/latestMessage/:lastMessageId', roomController.getLatestMessageByLastMessageId);
route.post('/room', roomController.initiate);
route.post('/room/message', roomController.postMessage);

/* 404 routing handler */
route.use((req, res) => {
  res.status(404).send('<h1 style="color:red;">404 Not Found</h1>');
});

export default route;
