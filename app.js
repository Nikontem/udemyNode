const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4} = require('uuid');

const feedRoutes = require('./routes/feed');

const {dbConnString} = require('./util/env_params');

const app = express();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + "." + file.mimetype.replace('image/',''));
    }
});

const filter = (req, file, cb) => {
    const acceptedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    console.log(acceptedMimeTypes.includes(file.mimetype));
    if (acceptedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb("Not An Accepted file type", false);
    }
}

app.use(express.json());
app.use(multer({storage: storage, fileFilter: filter}).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-COntrol-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.statusCode).json({message: error.statusMessage});
})

mongoose
    .connect(dbConnString)
    .then(() => {
        console.log('connected');
        app.listen(8080);
    })
    .catch(err => {
        console.error(err);
    });


