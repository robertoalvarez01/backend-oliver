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
app.use(require('./mercadopago'));
app.use(require('./legales'));
app.use(require('./zonas'));
app.use(require('./mercadopago'));
app.use(require('./envio'));
app.use(require('./ventas.js'))
app.use(require('./mediosDePago.js'))
app.use(require('./banner.js'));

module.exports = app;
