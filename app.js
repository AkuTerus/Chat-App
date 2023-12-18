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

import routes from './app/routes.js';
import Websocket from './app/utils/Websocket.js';

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

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', './app/views');
app.set('layout', 'layouts/layout');
app.set('layout extractScripts', true);

/* routing */
app.use(routes);

const httpServer = http.createServer(app);

global.io = new Server(httpServer);
global.io.on('connect', (socket) => Websocket.connect(socket));

httpServer.listen(port);
httpServer.on('listening', () => {
  console.log(`Server listening on http://localhost:${port}/`);
});
