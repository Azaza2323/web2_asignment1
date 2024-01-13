const fs = require('fs');
const xlsx = require('xlsx');

const filePath = 'genres.xlsx';
const readDataFromExcel = () => {
    if (fs.existsSync(filePath)) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
        return [];
    }
};
const writeDataToExcel = (data) => {
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet 2');
    xlsx.writeFile(wb, filePath, {header: ['name']});
};

const getGenres = () => {
    return readDataFromExcel();
};

const getGenresByName = (genreName) => {
    const data = readDataFromExcel();
    return data.filter(genre => genre.name === genreName);
};

const addGenre = (newGenre) => {
    const data = readDataFromExcel();
    data.push(newGenre);
    writeDataToExcel(data);
    return newGenre;
};

const deleteGenreByName = (genreName) => {
    const data = readDataFromExcel();
    const indexToDelete = data.findIndex(genre=> genre.name === genreName);

    if (indexToDelete !== -1) {
        const deletedGenre = data.splice(indexToDelete, 1)[0];
        writeDataToExcel(data);
        return deletedGenre;
    } else {
        return null; // Author not found
    }
};

module.exports = {
    getGenres,
    getGenresByName,
    addGenre,
    deleteGenreByName,
};

