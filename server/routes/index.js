const express = require('express');
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
/*app.use(require('./subCategoria'));
app.use(require('./marca'));
app.use(require('./producto'));
app.use(require('./subproducto'));
app.use(require('./upload'));
app.use(require('./imagenes'));*/


module.exports = app;