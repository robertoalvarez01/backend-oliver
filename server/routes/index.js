const express = require('express');
const app = express();


app.use('/usuario',require('./usuario'));
app.use('/auth',require('./auth'));
app.use('/marcas',require('./marca'));
app.use(`/${encodeURIComponent('tamaño')}`,require('./tamaño'));
app.use('/envios',require('./envio'));
app.use('/banners',require('./banner.js'));
app.use('/categorias',require('./categoria'));
app.use('/subcategorias',require('./subCategoria'));
app.use('/productos',require('./producto'));
app.use('/subproductos',require('./subproducto'));
app.use('/aumentos',require('./aumentos'));
app.use('/zonas',require('./zonas'));
app.use('/legales',require('./legales'));
app.use('/medioDePago',require('./mediosDePago.js'));
app.use('/ventas',require('./ventas.js'));
app.use('/estadisticas',require('./estadisticas.js'));
app.use('/usuario-oferta',require('./usuarioOferta.js'));

module.exports = app;
