const jwt = require("jsonwebtoken");
const { config } = require("../config/config.js");
// ==========================
// Verificar Token
// ==========================

let verificarEnvioToken = (req, res, next) => {
  const token = req.get("token");
  jwt.verify(token, config.seed, (err, decoded) => {
    if (err) {
      req.usuario = null;
    } else {
      req.usuario = decoded.usuario;
    }
    next();
  });
};

let verificarToken = (req, res, next) => {
  let token = req.get("token");

  jwt.verify(token, config.seed, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

let verificarRefreshToken = (req, res, next) => {
  let token = req.get("refresh-token");

  jwt.verify(token, config.seed, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        info: err.message,
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

// ==========================
// Verificar Admin_Role
// ==========================

let verificarAdmin_role = (req, res, next) => {
  if (!req.usuario.admin) {
    return res.status(401).json({
      ok: false,
      err: {
        message: "Se necesitan permisos de administrador",
      },
    });
  } else {
    next();
  }
};

// ==========================
// Verificar Token desde URL
// ==========================

let verificarTokenURL = (req, res, next) => {
  let token = req.query.token;

  jwt.verify(token, config.seed, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

module.exports = {
  verificarToken,
  verificarAdmin_role,
  verificarTokenURL,
  verificarRefreshToken,
  verificarEnvioToken,
};
