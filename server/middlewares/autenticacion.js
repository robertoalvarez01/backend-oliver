const jwt = require('jsonwebtoken');
const {config} = require('../config/config.js');
// ==========================
// Verificar Token
// ==========================

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, config.seed, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });


}

// ==========================
// Verificar Admin_Role
// ==========================

let verificarAdmin_role = (req, res, next) => {

    if (!(req.usuario.role === 'ADMIN_ROLE')) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Se necesitan permisos de administrador'
            }
        });
    } else {
        next();
    }


}

// ==========================
// Verificar Token desde URL
// ==========================

let verificarTokenURL = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, config.seed, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });


}

module.exports = {
    verificarToken,
    verificarAdmin_role,
    verificarTokenURL
};