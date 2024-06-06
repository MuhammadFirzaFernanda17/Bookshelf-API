/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */

const { nanoid } = require('nanoid');

class Books {
  constructor() {
    this._books = [];
  }

  addBook(book) {
    const id = nanoid();
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = book.pageCount === book.readPage;
    const newBook = {
      id, ...book, finished, insertedAt, updatedAt,
    };
    this._books.push(newBook);
    return id;
  }

  getBooks() {
    return this._books;
  }

  getBookById(id) {
    return this._books.find((book) => book.id === id);
  }

  updateBookById(id, updatedBook) {
    const index = this._books.findIndex((book) => book.id === id);
    if (index !== -1) {
      const updatedAt = new Date().toISOString();
      const finished = updatedBook.pageCount === updatedBook.readPage;
      this._books[index] = {
        ...this._books[index], ...updatedBook, finished, updatedAt,
      };
      return true;
    }
    return false;
  }

  deleteBookById(id) {
    const index = this._books.findIndex((book) => book.id === id);
    if (index !== -1) {
      this._books.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = Books;
