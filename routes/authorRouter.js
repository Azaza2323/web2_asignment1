const express = require('express');
const authorsModule = require('../models/authors');

const authorRouter = express.Router();

authorRouter.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const authors = authorsModule.getAuthors(page, pageSize);
    res.json({ authors });
});

authorRouter.get('/:name', (req, res) => {
    const authorName = req.params.name;
    const authors = authorsModule.getAuthorsByName(authorName);
    res.json({ authors });
});

authorRouter.post('/add', (req, res) => {
    const newAuthor = req.body;
    const addedAuthor = authorsModule.addAuthor(newAuthor);

    if (addedAuthor) {
        res.json({ message: 'Author added successfully', author: addedAuthor });
    } else {
        res.status(400).json({ message: 'Invalid author data or validation failed' });
    }
});

authorRouter.put('/:name/update', (req, res) => {
    const authorName = req.params.name;
    const updatedAuthor = req.body;
    const updatedAuthorResult = authorsModule.updateAuthorByName(authorName, updatedAuthor);

    if (updatedAuthorResult) {
        res.json({ message: 'Author updated successfully', author: updatedAuthorResult });
    } else {
        res.status(400).json({ message: 'Author not found or validation failed' });
    }
});

authorRouter.delete('/:name/delete', (req, res) => {
    const authorName = req.params.name;
    const deletedAuthor = authorsModule.deleteAuthorByName(authorName);

    if (deletedAuthor) {
        res.json({ message: 'Author deleted successfully', author: deletedAuthor });
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

module.exports = authorRouter;
