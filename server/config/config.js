require('dotenv').config();
let caducidad_token = 1000 * 60 * 60 * 24 * 30;
const config = {
    URL_SITE:process.env.URL_SITE || 'http://localhost:3000',
    URL_API:process.env.URL_API || 'http://localhost:3001',
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
    SP_USUARIO_UPDATE_WEB:process.env.SP_USUARIO_UPDATE_WEB,
    SP_USUARIO_RESET_PASSWORD:process.env.SP_USUARIO_RESET_PASSWORD,
    SP_USUARIO_UPDATE_ADDRESS:process.env.SP_USUARIO_UPDATE_ADDRESS,
    SP_LEGALES:process.env.SP_LEGALES,
    SP_ZONAS:process.env.SP_ZONAS,
    SP_ZONAS_DELETE:process.env.SP_ZONAS_DELETE,
    SP_ENVIO:process.env.SP_ENVIO,
    SP_ENVIO_DELETE:process.env.SP_ENVIO_DELETE,
    SP_ENVIO_ENTREGADO_NOENTREGADO:process.env.SP_ENVIO_ENTREGADO_NOENTREGADO,
    SP_ENVIOS_ENCAMINO:process.env.SP_ENVIOS_ENCAMINO,
    SP_ENVIOS_QR:process.env.SP_ENVIOS_QR,
    SP_VALIDAR_ENVIO = process.env.SP_ENVIOS_VENTA_APROBADA,
    SP_PRODUCTOSVENTA:process.env.SP_PRODUCTOSVENTA,
    SP_PRODUCTOSVENTA_DELETE:process.env.SP_PRODUCTOSVENTA_DELETE,
    SP_VENTAS:process.env.SP_VENTAS,
    SP_VENTAS_DELETE:process.env.SP_VENTAS_DELETE,
    SP_VENTA_PAGADO:process.env.SP_VENTA_PAGADO,
    SP_VALIDAR_VENTA = process.env.SP_VENTAS_SET_PAYMENT_ID,
    SP_MEDIOS_DE_PAGO:process.env.SP_MEDIOS_DE_PAGO,
    SP_MEDIOS_DE_PAGO_DELETE:process.env.SP_MEDIOS_DE_PAGO_DELETE,
    SP_BANNERS:process.env.SP_BANNERS,
    SP_BANNERS_DELETE:process.env.SP_BANNERS_DELETE,
    SP_USUARIOS_OFERTAS:process.env.SP_LISTADO_USUARIOS_OFERTAS,
    
    TABLE_CATEGORIA:process.env.TABLE_CATEGORIA,
    TABLE_MARCA:process.env.TABLE_MARCA,
    TABLE_PRODUCTO:process.env.TABLE_PRODUCTO,
    TABLE_SUB_PRODUCTO:process.env.TABLE_SUB_PRODUCTO,
    TABLE_SUB_CATEGORIA:process.env.TABLE_SUB_CATEGORIA,
    TABLE_TAM:process.env.TABLE_TAM,
    TABLE_USER:process.env.TABLE_USER,
    TABLE_ZONAS:process.env.TABLE_ZONAS,
    TABLE_ENVIO:process.env.TABLE_ENVIO,
    TABLE_VENTAS:process.env.TABLE_VENTAS,
    TABLE_PRODUCTOSVENTA:process.env.TABLE_PRODUCTOSVENTA,
    TABLE_MEDIOS_DE_PAGO:process.env.TABLE_MEDIOS_PAGO,
    TABLE_BANNERS:process.env.TABLE_BANNERS,
    TABLE_USUARIO_OFERTAS:process.env.TABLE_LISTADO_USUARIOS_OFERTAS,

    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    ID_GOOGLE_CLOUD: process.env.PROJECT_ID_GCLOUD,
    BUCKET_GCLOUD: process.env.BUCKET_GCLOUD, 

    MP_ACCESS_TOKEN:process.env.MERCADO_PAGO_ACCESS_TOKEN_DEV,
    MP_PUBLIC_KEY:process.env.MERCADO_PAGO_PUBLIC_KEY_DEV,
    MP_CLIENT_ID:process.env.MERCADO_PAGO_CLIENT_ID,
    MP_CLIENT_SECRET:process.env.MERCADO_PAGO_CLIENT_SECRET,

    DEFAULT_FOTO:'https://storage.googleapis.com/web-oliver/sin-imagen.png',

    //DATA EMAIL
    ACCOUNT_NAME:process.env.ACCOUNT_NAME,
    ACCOUNT_USERNAME:process.env.ACCOUNT_USERNAME,
    ACCOUNT_PASSWORD:process.env.ACCOUNT_PASSWORD,
    ACCOUNT_HOST:process.env.ACCOUNT_HOST,
    ACCOUNT_PORT:process.env.ACCOUNT_PORT
};

module.exports = {config}

