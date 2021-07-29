const express = require('express');
const app = express();


app.use('/usuario',require('./usuario'));
app.use('/auth',require('./auth'));
app.use('/categorias',require('./categoria'));
app.use('/marcas',require('./marca'));
app.use(`/${encodeURIComponent('tamaño')}`,require('./tamaño'));
app.use('/envios',require('./envio'));
app.use(require('./subCategoria'));
app.use(require('./producto'));
app.use(require('./subproducto'));
app.use(require('./google'));
app.use(require('./mercadopago'));
app.use(require('./legales'));
app.use(require('./zonas'));
app.use(require('./mercadopago'));
app.use(require('./ventas.js'))
app.use(require('./mediosDePago.js'))
app.use(require('./banner.js'));
app.use(require('./usuarioOferta.js'));
app.use(require('./balance.js'));

module.exports = app;
