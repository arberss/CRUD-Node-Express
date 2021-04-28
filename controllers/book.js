const Book = require('../models/books');

exports.getBooks = (req, res, next) => {
  Book.find().then((books) => {
    res.render('index', {
      books,
    });
  });
};

exports.getAddBook = (req, res, next) => {
  res.render('add-book', {
    editing: false,
    error: '',
  });
};

exports.postAddBook = (req, res, next) => {
  const { title, author, yop } = req.body;

  let error = '';

  if (!title || !author || !yop) {
    error = 'Please enter all fields';
  }

  if (error !== '') {
    res.render('add-book', {
      error,
      editing: false,
    });
  } else {
    const book = new Book({ title, author, yop });
    book.save().then(() => {
      req.flash('success_msg', 'Book Added');
      res.redirect('/');
    });
  }
};

exports.getEditBook = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const bookId = req.params.bookId;

  Book.findById(bookId).then((book) => {
    if (!book) {
      return res.redirect('/');
    }

    res.render('add-book', {
      book,
      editing: editMode,
      error: '',
    });
  });
};

exports.postEditBook = (req, res, next) => {
  const { title, author, yop, bookId } = req.body;

  let error = '';

  if (!title || !author || !yop) {
    error = 'Please enter all fields';
  }

  Book.findById(bookId, (err, book) => {
    if (error !== '') {
      res.render('add-book', {
        book,
        editing: true,
        error,
      });
    } else {
      book.title = title;
      book.author = author;
      book.yop = yop;

      return book.save().then((result) => {
        req.flash('success_msg', 'Book Updated');
        res.redirect('/');
      });
    }
  });
};

exports.deleteBook = (req, res, next) => {
  const bookId = req.body.removeBtn;
  Book.findById(bookId)
    .then((book) => {
      return book.remove();
    })
    .then(() => {
      req.flash('success_msg', 'Book Removed');
      res.redirect('/');
    });
};
