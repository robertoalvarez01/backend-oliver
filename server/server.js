require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const https = require('https');
const fs = require('fs');

const options = {
    cert: fs.readFileSync('../certificates/fullchain.pem'),
    key: fs.readFileSync('../certificates/privkey.pem')
};

const bodyParser = require('body-parser');

// Enable CORS Origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Carpeta Public
app.use(express.static(path.resolve(__dirname, '../public')))

app.use(require('./routes/index'));

const conexion = async() => {

    return await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

conexion()
    .then(res => console.log('MongoDB is connected...'))
    .catch(err => console.log(err));

app.listen(3001, console.log("Server running"));
https.createServer(options, app).listen(3000, console.log("Secure server running on port 3000"));