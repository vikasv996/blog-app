const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoUtil = require("./utils/mongoUtil");
const config = require('./config.js').get(process.env.NODE_ENV);
const AuthRoute = require('./routes/authMaster');
const BlogRoute = require('./routes/blogMaster');
const jwtUtils = require('./utils/jwtUtils');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, './client/build')));

app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        // res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
}
// app.get('/', jwtUtils.verifyAccessToken, async (req, res, next) => {
//     console.log("req.payload:", req.payload);
//     res.send('Hewllo World');
// })

app.use('/auth', AuthRoute);
app.use('/blog', BlogRoute);

app.use(async (req, res, next) => {
    next(new createError.NotFound())
})

app.use(async (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        code: err.status || 500,
        message: err.message
    })
})

mongoUtil.connectToServer((error) => {
    if (config.DEBUG) console.log("connectToServer ++");
    if (error) {
        return console.log('MongoClient connection error : ' + error);
    }
    const port = process.env.PORT || 4000;
    app.listen(port, (error) => {
        if (error) {
            return console.log("Server Down", error);
        } else {
            console.log(`${process.env.NODE_ENV} server running at http://localhost:${port}`);
        }
    });
    if (config.DEBUG) console.log("connectToServer --");
});

