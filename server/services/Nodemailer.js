const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const {config} = require('../config/config');
const path = require('path');

class Nodemailer{
    constructor() {
        this.transporter = nodemailer.createTransport({
            // host:config.ACCOUNT_HOST,
            // port:config.ACCOUNT_PORT,
            // secure:false,
            service:'gmail',
            auth:{
                user:config.ACCOUNT_USERNAME,
                pass:config.ACCOUNT_PASSWORD
            }
        });
    }

    armarBody(config){
        let html = `
        <p>Hola, <b>${config.nombre}</b></p>
        <p>Hemos recibido la informacion de tu compra: </p><br/>`;

        config.productos.map(prd=>{
            html += `
                <b>${prd.subProducto} - por (${prd.cantidad}) unidad/es</b><br/>
            `;
        });

        if(config.tipoEnvio == 'Local'){
            html += `
            <br/><br/>
            <p>Para poder retirar tu compra, acércate a nuestro local y presentá el código de la compra que se muestra a continuación.</p>
            <br/>
            <p>Código de compra: <b>${config.idUltimoEnvio}</b></p>`;
        }else{
            html += `<p>En breve te informaremos cuando el envío esté en camino.</p>`;
        }

        html += `<br/><br/>
        <p>Para cualquier consulta, comunicarse a <b>02304347008</b></p>
        Muchas gracias por tu confianza, <b>OLIVER PETSHOP.</b>
        <br/>
        <img src="cid:OliverPetShop" width="50px" height="50px"/>`

        return html;
    }
    
    send(mailOptions){
        return new Promise((resolve,reject)=>{
            this.transporter.use('compiler',hbs({
                viewEngine:'express-handlebars',
                viewPath:path.join(__dirname,'../templates')
            }))
            this.transporter.sendMail(mailOptions,(err,res)=>{
                if(err) return reject(err.message);
                return resolve(res);
            })
        })
    }
}

module.exports = Nodemailer;