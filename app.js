const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

app.use(cookieParser('secret'));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const book = require('./controllers/book');

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  next();
});

app.get('/', book.getBooks);
app.get('/add-book', book.getAddBook);
app.post('/add-book', book.postAddBook);
app.get('/edit-book/:bookId', book.getEditBook);
app.post('/edit-book', book.postEditBook);
app.post('/remove', book.deleteBook);

mongoose
  .connect(`${process.env.MONGO_DB}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => {
    console.log('Server started');
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log('Server is not running');
  });
