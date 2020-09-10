var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    codigoBarra:{
        type: Number,
        required: false
    },
    stock: {
        type: Number,
        required: false
    },
    minimo: {
        type: Number,
        required: false
    },
    peso: {
        type: Number,
        required: false
    },
    precioUni: {
        type: Number,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


module.exports = mongoose.model('SubProducto', productoSchema);