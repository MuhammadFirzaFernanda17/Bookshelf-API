/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

const Books = require('./books');

const books = new Books();

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    return h.response({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
  }

  const bookId = books.addBook({
    name, year, author, summary, publisher, pageCount, readPage, reading,
  });
  return h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId } }).code(201);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books.getBooks();

  if (name) {
    const searchTerm = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(searchTerm));
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const simplifiedBooks = filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));

  const limitedBooks = simplifiedBooks.slice(0, 2);

  if (limitedBooks.length > 0) {
    return { status: 'success', data: { books: limitedBooks } };
  }
  return h.response({ status: 'success', data: { books: [] } });
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.getBookById(bookId);
  if (book) {
    return { status: 'success', data: { book } };
  }
  return h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404);
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
  }

  const isUpdated = books.updateBookById(bookId, {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  });
  if (isUpdated) {
    return { status: 'success', message: 'Buku berhasil diperbarui' };
  }
  return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const isDeleted = books.deleteBookById(bookId);
  if (isDeleted) {
    return { status: 'success', message: 'Buku berhasil dihapus' };
  }
  return h.response({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' }).code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
