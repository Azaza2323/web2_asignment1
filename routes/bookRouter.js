const express = require('express');
const bookModule = require('../models/books');
const bookRouter = express.Router();

bookRouter.get('/books', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const nameFilter = req.query.name || null;
    const priceFilter = req.query.price ? JSON.parse(req.query.price) : null;

    const books = bookModule.getBooks(page, pageSize, nameFilter, priceFilter);
    res.json({ books });
});

bookRouter.get('/:name', (req, res) => {
    const bookName = req.params.name;
    const books = bookModule.getBooksByName(bookName);
    res.json({ books });
});

bookRouter.post('/add', (req, res) => {
    const newBook = req.body;
    const result = bookModule.addBook(newBook);

    if (result.error) {
        res.status(400).json({ message: result.error });
    } else {
        res.json({ message: 'Book added successfully', book: result.book });
    }
});

bookRouter.put('/:name/update', (req, res) => {
    const bookName = req.params.name;
    const updatedBook = req.body;
    const result = bookModule.updateBook(bookName, updatedBook);

    if (!result) {
        res.status(404).json({ message: 'Book not found' });
    } else if (result.error) {
        res.status(400).json({ message: result.error });
    } else {
        res.json({ message: 'Book updated successfully', book: result.book });
    }
});


bookRouter.delete('/:name/delete', (req, res) => {
    const bookName = req.params.name;
    const deletedBooks = bookModule.deleteBookByName(bookName);

    if (deletedBooks) {
        res.json({ message: 'Books deleted successfully', book: deletedBooks });
    } else {
        res.status(404).json({ message: 'Books not found' });
    }
});

module.exports = bookRouter;
