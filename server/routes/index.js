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
<<<<<<< HEAD
app.use(require('./mercadopago'));
=======
app.use(require('./legales'));
//app.use(require('./mercadopago'));
>>>>>>> cebe0a0f2fef489905eb306f9b90fbda3c69e7d7


module.exports = app;
