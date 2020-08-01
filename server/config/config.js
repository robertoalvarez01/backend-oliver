// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Seed de JWT
// ============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============================
//  Expiración de JWT
// ============================

// 60 segundos
// 60 minutos
// 24 horas
// -- 30 días --

process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60 * 24 * 30;

// ============================
//  DataBase
// ============================
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;

// ============================
//  Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '759343055701-1afqomoua243637l31br8n88be1t2c3j.apps.googleusercontent.com';