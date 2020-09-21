const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
// const https = require('https');
// const fs = require('fs');

// const options = {
//     cert: fs.readFileSync(path.resolve(__dirname, '../certificates/fullchain.pem')),
//     key: fs.readFileSync(path.resolve(__dirname, '../certificates/privkey.pem'))
// };

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


app.listen(3000, console.log("Server running"));
// https.createServer(options, app).listen(3000, console.log("Secure server running on port 3000"));