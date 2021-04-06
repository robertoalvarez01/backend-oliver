const path = require('path');
const {Storage} = require('@google-cloud/storage');
const {format} = require('util');
const {config} = require('../config/config');

const googleCloud = new Storage({
  keyFilename:path.join(__dirname,'../../google.json'),
  projectId:config.ID_GOOGLE_CLOUD
});
const bucket = googleCloud.bucket(config.BUCKET_GCLOUD);

class CloudStorage{
    constructor(seccion=null) {
        (seccion)?this.seccion = seccion:this.seccion=null;
    }
    
    async upload(file){
        let url='';
        switch (this.seccion) {
            case 'categorias':
                url+='categorias/';
                break;
            case 'marcas':
                url+='marcas/';
                break;
            case 'usuarios':
                url+='usuarios/';
                break;
            case 'banners':
                url += 'banners/';
                break;
            default:
                break;
        }

        url+= `${file.originalname}`;
        return new Promise((resolve,reject)=>{
            const blob = bucket.file(url);
            const blobStream = blob.createWriteStream({
                resumable:false
            });
            blobStream.on('error', (err) => {
                reject(err)
            });
            
            blobStream.on('finish', () => {
                resolve(format(
                  `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                ));
            });
            blobStream.end(file.buffer);
        })
    }

    async delete(file){
        const fileDelete = bucket.file(file);
        return fileDelete.delete();
    }
}

module.exports = CloudStorage;