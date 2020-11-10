require('dotenv').config();
let caducidad_token = 1000 * 60 * 60 * 24 * 30;
const config = {
    port:process.env.PORT || 3000,
    node_env:process.env.NODE_ENV || 'dev',
    // ============================
    //  Seed de JWT
    // ============================
    
    seed:process.env.SEED || 'este-es-el-seed-desarrollo',
    
    // ============================
    //  Expiración de JWT
    // ============================
    
    // 60 segundos
    // 60 minutos
    // 24 horas
    // -- 30 días --
    
    caducidad_token:caducidad_token,

    //data db
    dbHost:process.env.DB_HOST,
    dbUser:process.env.DB_USER,
    dbPw:process.env.DB_PW,
    dbName:process.env.DB_NAME,

    SP_CATEGORIA:process.env.SP_CATEGORIA,
    SP_CATEGORIA_DELETE:process.env.SP_CATEGORIA_DELETE,
    SP_MARCA:process.env.SP_MARCA,
    SP_MARCA_DELETE:process.env.SP_MARCA_DELETE,
    SP_PRODUCTO:process.env.SP_PRODUCTO,
    SP_PRODUCTO_DELETE:process.env.SP_PRODUCTO_DELETE,
    SP_SUBCATEGORIA:process.env.SP_SUBCATEGORIA,
    SP_SUBCATEGORIA_DELETE:process.env.SP_SUBCATEGORIA_DELETE,
    SP_SUBPRODUCTO:process.env.SP_SUBPRODUCTO,
    SP_SUBPRODUCTO_DELETE:process.env.SP_SUBPRODUCTO_DELETE,
    SP_TAM:process.env.SP_TAM,
    SP_TAM_DELETE:process.env.SP_TAM_DELETE,
    SP_USUARIO:process.env.SP_USUARIO,
    SP_USUARIO_DELETE:process.env.SP_USUARIO_DELETE,
    
    TABLE_CATEGORIA:process.env.TABLE_CATEGORIA,
    TABLE_MARCA:process.env.TABLE_MARCA,
    TABLE_PRODUCTO:process.env.TABLE_PRODUCTO,
    TABLE_SUB_PRODUCTO:process.env.TABLE_SUB_PRODUCTO,
    TABLE_SUB_CATEGORIA:process.env.TABLE_SUB_CATEGORIA,
    TABLE_TAM:process.env.TABLE_TAM,
    TABLE_USER:process.env.TABLE_USER,

    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    ID_GOOGLE_CLOUD: process.env.PROJECT_ID_GCLOUD,
    BUCKET_GCLOUD: process.env.BUCKET_GCLOUD, 

    MP_ACCESS_TOKEN:process.env.MERCADO_PAGO_ACCESS_TOKEN_DEV,
    MP_PUBLIC_KEY:process.env.MERCADO_PAGO_PUBLIC_KEY_DEV,
    MP_CLIENT_ID:process.env.MERCADO_PAGO_CLIENT_ID,
    MP_CLIENT_SECRET:process.env.MERCADO_PAGO_CLIENT_SECRET
};

module.exports = {config}

