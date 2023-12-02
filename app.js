/* dotenv */
import 'dotenv/config.js';

/* core modules */
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

/* node_modules */
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

/* router modules */
import userRouter from './app/routes/userRouter.js';
import chatRouter from './app/routes/chatRouter.js';
import registerRouter from './app/routes/registerRouter.js';
import loginRouter from './app/routes/loginRouter.js';
import logoutRouter from './app/routes/logoutRouter.js';
import { accessibleOnLogin, accessibleOnLogout } from './app/middleware/loginAuth.js';
import Ws from './app/utils/Ws.js';

/* declaration */
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* define global middlewares ? */
app.use('/uploads', express.static('./uploads'));
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: randomBytes(32).toString('hex'),
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(expressEjsLayouts);

app.set('view engine', 'ejs');
app.set('views', './app/views');
app.set('layout', 'layouts/layout');
app.set('layout extractScripts', true);

/*
|-----------------------------------------------------------------------------
| Routing
|-----------------------------------------------------------------------------
*/

/* first middleware for logging, etc */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} -- `, new Date().toLocaleString());
  // console.log(`req.session.token = ${req.session.token}`);
  next();
});

/* redirect root path */
app.get('/', (req, res) => {
  return res.redirect('/user');
});

/* application path routing */
app.use('/register', accessibleOnLogout, registerRouter);
app.use('/login', accessibleOnLogout, loginRouter);
app.use('/logout', logoutRouter);
app.use('/user', accessibleOnLogin, userRouter);
app.use('/chat', accessibleOnLogin, chatRouter);

/* 404 routing handler */
app.use('*', (req, res, next) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

const httpServer = http.createServer(app);

global.io = new Server(httpServer);
global.io.on('connect', (socket) => Ws.connect(socket));

httpServer.listen(port);
httpServer.on('listening', () => {
  console.log(`Server listening on http://localhost:${port}/`);
});
