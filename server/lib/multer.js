const Multer = require('multer');
const path = require('path');
const storage = Multer.diskStorage({
    storage: Multer.memoryStorage(),
    destination:'./public/img',	
    filename:(req,file,cb)=>{	
        cb(null,file.originalname);	
    }	
})	
    
const upload = Multer({	
    storage:storage,
    dest:'./public/img',	
    limits:{fieldSize:1000000000},	
    fileFilter:(req,file,cb)=>{	
        //validando extensiones.	
        const fileTypes = /jpeg|jpg|png|pptx|xlsx|xls|gif|doc|dot|docx|pdf|txt/;//extensiones aceptadas	
        const mimetype = fileTypes.test(file.mimetype);
        console.log(file);
        console.log(mimetype);	
        const extname = fileTypes.test(path.extname(file.originalname));	
        console.log(extname);
        if (mimetype && extname) {	
            return cb(null,true);	
        }	
        cb(JSON.stringify({status:400,message:"Archivo no soportado"}));	
    }	
});   

module.exports = upload;