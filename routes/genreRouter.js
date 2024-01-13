const express = require('express');
const genresModule = require('../models/genres');

const genreRouter=express.Router();


genreRouter.get('/', (req, res) => {
    const genres = genresModule.getGenres();
    res.json({ genres });
});


genreRouter.get('/:name', (req, res) => {
    const genreName = req.params.name;
    const genre = genresModule.getGenresByName(genreName);
    res.json({ genre });
});


genreRouter.post('/add', (req, res) => {
    const newGenre = req.body;
    const addedGenre = genresModule.addGenre(newGenre);

    if (addedGenre) {
        res.json({ message: 'Author added successfully', genre: addedGenre });
    } else {
        res.status(400).json({ message: 'Invalid author data or validation failed' });
    }
});

genreRouter.delete('/:name/delete', (req, res) => {
    const genresName = req.params.name;
    const deletedGenre = genresModule.deleteGenreByName(genresName);

    if (deletedGenre) {
        res.json({ message: 'Author deleted successfully', genre: deletedGenre });
    } else {
        res.status(404).json({ message: 'Author not found' });
    }
});

module.exports = genreRouter;
