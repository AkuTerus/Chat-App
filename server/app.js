/* core modules */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

/* node_modules */
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';

/* router modules */
import userRouter from './routes/userRouter.js';
import chatRouter from './routes/chatRouter.js';
import registerRouter from './routes/registerRouter.js';
import loginRouter from './routes/loginRouter.js';
import logoutRouter from './routes/logoutRouter.js';
import { accessibleOnLogin, accessibleOnLogout } from './middlewares/loginAuth.js';

/* declaration */
const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* define global middlewares ? */
app.use('/uploads', express.static('../uploads'));
app.use(express.static('../client/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.set('views', '../client/views');
app.set('layout', 'layouts/layout');
app.set('layout extractScripts', true);

/*
|-----------------------------------------------------------------------------
| Routing
|-----------------------------------------------------------------------------
*/

/* first middleware for logging, etc */
/*
|-----------------------------------------------------------------------------
| Routing
|-----------------------------------------------------------------------------
*/

/* first middleware for logging, etc */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} -- `, new Date().toLocaleString());
  console.log(`session keys: [${Object.keys(req.session)}]`);
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
/* 404 routing handler */
app.use((req, res, next) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

/* express app listener */
/* express app listener */
app.listen(PORT, () => console.log(`server running at http://localhost:${PORT} ...`));
