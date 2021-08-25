const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const tamañosController = require('../controllers/tamañosController');


// ======================================
// Crea un tamaño
// ======================================

app.post(`/add`, [verificarToken,verificarAdmin_role], tamañosController.create);

// ======================================
// Actualiza un tamaño
// ======================================

app.put(`/update/:id`, [verificarToken,verificarAdmin_role], tamañosController.update);


// ======================================
// Borra un tamaño -- (Borrado definitivo)
// ======================================

app.delete(`/delete/:id`, [verificarToken, verificarAdmin_role], tamañosController.delete);

// ======================================
// Trae todos los tamaños
// ======================================

app.get(`/`, tamañosController.getAll);

// ======================================
// Trae un solo tamaño
// ======================================

app.get(`/:id`, tamañosController.getById);



module.exports = app;