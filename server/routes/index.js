const express = require('express');
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./subCategoria'));
app.use(require('./marca'));
app.use(require('./producto'));
app.use(require('./subproducto'));
app.use(require('./tamaño'));
app.use(require('./google'));
//app.use(require('./mercadopago'));


module.exports = app;