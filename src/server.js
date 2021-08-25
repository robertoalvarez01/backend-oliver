const express = require("express");
const app = express();
const cors = require("cors");
const { config } = require("./config/config");

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Carpeta Public
//app.use("/",express.static('./public'));

app.use(require("./routes/index"));

app.listen(config.port, console.log("Server running on port " + config.port));
// https.createServer(options, app).listen(3000, console.log("Secure server running on port 3000"));
