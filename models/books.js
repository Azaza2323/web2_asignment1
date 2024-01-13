const fs=require('fs')
const xlsx=require('xlsx')
const filePath = 'books.xlsx';
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
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet 3');
    xlsx.writeFile(wb, filePath, {header: ['title','author','publishYear','pageCount','price'],});
};


const getBooks = (page, pageSize, nameFilter, priceFilter) => {
    let data = readDataFromExcel();

    if (nameFilter) {
        data = data.filter(book => book.title.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (priceFilter) {
        const minPrice = parseFloat(priceFilter.min) || 0;
        const maxPrice = parseFloat(priceFilter.max) || Number.MAX_VALUE;

        data = data.filter(book => book.price >= minPrice && book.price <= maxPrice);
    }

    // Pagination logic (if needed)
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    return paginatedData;
};

const getBooksByName = (titleName) => {
    const data = readDataFromExcel();
    return data.filter(book => book.title === titleName);

};
const validateBookFields = (book) => {
    const { title, author, publishYear, pageCount, price } = book;
    const errors = [];

    // Add more validation rules as needed
    if (typeof title !== 'string' || title.length < 2 || title.length > 30) {
        errors.push("Title should be a string with a length between 2 and 30 characters.");
    }

    if (typeof author !== 'string' || author.length < 2 || author.length > 30) {
        errors.push("Author should be a string with a length between 2 and 30 characters.");
    }

    if (!Number.isInteger(publishYear) || publishYear < 1900 || publishYear > 2024) {
        errors.push("Publish Year should be an integer between 1900 and 2024.");
    }

    if (!Number.isInteger(pageCount) || pageCount < 3 || pageCount > 1300) {
        errors.push("Page Count should be an integer between 3 and 1300.");
    }

    if (typeof price !== 'number' || price < 0 || price > 150000) {
        errors.push("Price should be a decimal number between 0 and 150000.");
    }

        if (errors.length > 0) {
            throw new Error(errors.join(" "));
        }

    return true;
};

const addBook = (newBook) => {
    try {
        validateBookFields(newBook);
        const data = readDataFromExcel();
        data.push(newBook);
        writeDataToExcel(data);
        return { message: 'Book added successfully', book: newBook };
    } catch (error) {
        return { error: error.message };
    }
};


const updateBook = (bookName, updatedBook) => {
    try {
        validateBookFields(updatedBook);
        const data = readDataFromExcel();
        const indexToUpdate = data.findIndex(book => book.title === bookName);

        if (indexToUpdate !== -1) {
            updatedBook.id = data[indexToUpdate].id;
            data[indexToUpdate] = updatedBook;
            writeDataToExcel(data);
            return { message: 'Book updated successfully', book: updatedBook };
        }
    } catch (error) {
        return { error: error.message };
    }
};


const deleteBookByName = (bookName) => {
    const data = readDataFromExcel();
    const indexToDelete = data.findIndex(book=> book.title=== bookName);

    if (indexToDelete !== -1) {
        const deletedBook = data.splice(indexToDelete, 1)[0];
        writeDataToExcel(data);
        return deletedBook;
    } else {
        return null;
    }
};
module.exports = {
    getBooks,
    getBooksByName,
    addBook,
    deleteBookByName,
    updateBook
};


