const express = require('express');
const app = express();
const upload = require('../lib/multer');

app.post('/prueba-imagen',upload.single('foto'),async(req, res) => {
    try {
        res.status(200).json({
            info:req.file
        });
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});

module.exports = app;