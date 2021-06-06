const mercadopago = require('mercadopago');
const {config} = require('../config/config');

mercadopago.configure({
    access_token:config.MP_ACCESS_TOKEN
});

class MercadoPagoService{

    async nuevaTransaccion(data){
        const payment_data = {
            transaction_amount: Number(data.total),
            token: data.token,
            description: data.descripcion,
            installments: Number(data.installments),
            payment_method_id: data.paymentMethod.id,
            issuer_id: data.issuer,
            payer: {
              email: data.email,
              identification: {
                type: data.docType,
                number: data.docNumber
              }
            }
        };
        const res = await mercadopago.payment.save(payment_data);
        return res;
    }
}

module.exports = MercadoPagoService;
