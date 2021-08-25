const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, verificarAdmin_role,verificarRefreshToken } = require('../middlewares/autenticacion')
const app = express();
const upload = require('../lib/multer');

// url ->  /usuario

app.get('/', [verificarToken,verificarAdmin_role],usuarioController.getAll);

app.get('/:id',verificarToken,usuarioController.getById);

app.post('/',usuarioController.create);

app.delete('/:id', [verificarToken, verificarAdmin_role], usuarioController.delete);

app.put('/:id', [verificarToken, verificarAdmin_role], usuarioController.update);

app.put('/actualizarUsuarioDesdeWeb/:id',[verificarToken],usuarioController.updateUserWeb);

app.put('/actualizarFotoUsuarioDesdeWeb/:id',[verificarToken,upload.single('foto')],usuarioController.updateFotoWeb);

app.put('/actualizarDireccion/:id',verificarToken,usuarioController.updateAddress);

app.post('/reset-password',usuarioController.resetPassword);

app.put('/new-password',verificarRefreshToken,usuarioController.newPassword);

module.exports = app;
