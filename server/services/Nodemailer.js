const nodemailer = require('nodemailer');
const {config} = require('../config/config');

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

    send(mailOptions){
        return new Promise((resolve,reject)=>{
            this.transporter.sendMail(mailOptions,(err,res)=>{
                if(err) return reject(err.message);
                return resolve(res);
            })
        })
    }
}

module.exports = Nodemailer;