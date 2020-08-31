const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator')
const fs = require('fs');
const cors = require('cors')




const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log('DB connected'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message} `);
});
// console.log(process.env.JWT_SECRET)
const app = express();

const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

app.get('/', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        const docs = JSON.parse(data);
        res.json(docs)
    })
})

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: "Unauthorized!" })
    }
})


const port = 3000;
app.listen(port, () => {
    console.log(`node api listening on ${port}`)
});