/* modules */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/views'));
app.use(express.static('../client/public'));

/* routing */
app.use((req, res, next) => {
  const password = 'a12345';
  next();
});

app.use('/', loginRouter);
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

app.listen(PORT, () => console.log(`server listening at http://localhost:${PORT} ...`));
