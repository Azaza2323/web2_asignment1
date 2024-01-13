const express = require('express');
const bodyParser = require('body-parser');
const authorRouter = require('./routes/authorRouter');
const genreRouter=require('./routes/genreRouter')
const bookRouter=require('./routes/bookRouter')
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/authors', authorRouter);
app.use('/genres',genreRouter)
app.use('/books',bookRouter)



app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
