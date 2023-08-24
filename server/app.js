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
app.use(express.static('../client/public'));
app.use(express.static('../uploads'));
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

/* routing */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} -- `, new Date().toLocaleString());
  next();
});

app.use('/', userRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/chat', chatRouter);

app.use((req, res, next) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

app.listen(PORT, () => console.log(`server running at http://localhost:${PORT} ...`));
