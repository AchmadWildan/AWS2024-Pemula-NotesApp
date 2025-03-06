/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading, } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    insertedAt,
    updatedAt,
  };
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }
  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};


const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = [...books];

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading === '0') {
    filteredBooks = filteredBooks.filter((book) => !book.reading);
  } else if (reading === '1') {
    filteredBooks = filteredBooks.filter((book) => book.reading);
  }

  if (finished === '0') {
    filteredBooks = filteredBooks.filter((book) => !book.finished);
  } else if (finished === '1') {
    filteredBooks = filteredBooks.filter((book) => book.finished);
  }

  const responseBooks = filteredBooks.slice(0, 3).map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: responseBooks,
    },
  }).code(200);
};



const getBookById = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const a = h.response({
      status: 'success',
      data: {
        book: {
          id: book.id,
          name: book.name,
          year: book.year,
          author: book.author,
          summary: book.summary,
          publisher: book.publisher,
          pageCount: book.pageCount,
          readPage: book.readPage,
          finished: book.finished,
          reading: book.reading,
          insertedAt: book.insertedAt,
          updatedAt: book.updatedAt,
        },
      },
    });
    return a.code(200);
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  return response.code(404);
};

const editBookById = (request, h) => {
  const { bookId } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books, name, year, author, summary, publisher, pageCount, readPage, reading
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }


  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);

};
const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const { finished } = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  const finish = books.findIndex((f) => f.finished === finished);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  if (finish !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};
module.exports = { addBook, getAllBooks, getBookById, editBookById, deleteBookById };
