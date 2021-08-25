const express = require('express');
const app = express();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middlewares/autenticacion');

app.post('/login',authController.login);

app.post('/register',authController.register);

app.get('/verify-sesion',verificarToken,authController.verifySession);

app.get('/confirmed',authController.confirmAccount);

app.post('/google',authController.authenticationByGoogle);

module.exports  = app;