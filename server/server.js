const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {config} = require('./config/config');
const bodyParser = require('body-parser');

// Enable CORS Origin
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});*/
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Carpeta Public
app.use(express.static(path.resolve(__dirname, '../public')))

app.use(require('./routes/index'));


app.listen(config.port, console.log("Server running on port "+config.port));
// https.createServer(options, app).listen(3000, console.log("Secure server running on port 3000"));
