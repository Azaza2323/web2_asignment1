const fs = require('fs');
const xlsx = require('xlsx');

const filePath = 'authors.xlsx';

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
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');
    xlsx.writeFile(wb, filePath, { header: ['name', 'surname', 'birthday'] });
};

const getAuthors = (page, pageSize) => {
    const data = readDataFromExcel();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    return paginatedData;
};

const getAuthorsByName = (authorName) => {
    const data = readDataFromExcel();
    const authorsWithName = data.filter(author => author.name === authorName);
    return authorsWithName;
};

const addAuthor = (newAuthor) => {
    const data = readDataFromExcel();
    data.push(newAuthor);
    writeDataToExcel(data);
    return newAuthor;
};

const updateAuthorByName = (authorName, updatedAuthor) => {
    const data = readDataFromExcel();
    const indexToUpdate = data.findIndex(author => author.name === authorName);

    if (indexToUpdate !== -1) {
        updatedAuthor.id = data[indexToUpdate].id;
        data[indexToUpdate] = updatedAuthor;
        writeDataToExcel(data);
        return updatedAuthor;
    } else {
        return null; // Author not found
    }
};

const deleteAuthorByName = (authorName) => {
    const data = readDataFromExcel();
    const indexToDelete = data.findIndex(author => author.name === authorName);

    if (indexToDelete !== -1) {
        const deletedAuthor = data.splice(indexToDelete, 1)[0];
        writeDataToExcel(data);
        return deletedAuthor;
    } else {
        return null; // Author not found
    }
};

module.exports = {
    getAuthors,
    getAuthorsByName,
    addAuthor,
    updateAuthorByName,
    deleteAuthorByName,
};
