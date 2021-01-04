// const mercadopago = require('mercadopago');
// const {config} = require('../config/config');

// mercadopago.configure({
//     access_token:config.MP_ACCESS_TOKEN
// });

// class MercadoPagoService{
//     async init(data=null){
//         let preference = {
//             items: data
//         };
//         const res = await mercadopago.preferences.create(preference);
//         return res;
//     }
// }

// module.exports = MercadoPagoService;