/* modules */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import bcryptjs from 'bcryptjs';

/* routers module */
import loginRouter from './routes/loginRouter.js';
import registerRouter from './routes/registerRouter.js';
import userRouter from './routes/userRouter.js';
import chatRouter from './routes/chatRouter.js';

/* declaration */
const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* define global middlewares ? */
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: randomBytes(32).toString(),
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(expressEjsLayouts);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/views'));
app.set('layout', 'layouts/layout');
app.set('layout extractScripts', true);

/* routing */
app.use((req, res, next) => {
  next();
});

app.use('/', userRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/chat', chatRouter);

app.listen(PORT, () => console.log(`server listening at http://localhost:${PORT} ...`));
