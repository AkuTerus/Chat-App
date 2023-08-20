/* modules */
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/user', (req, res) => {
  res.render('user');
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

app.listen(PORT, () => console.log(`server listening at port ${PORT}...`));
