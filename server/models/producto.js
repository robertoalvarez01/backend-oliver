var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio Ãºnitario es necesario']
    },
    descripcionBasica: {
        type: String,
        required: false
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    marca: {
        type: Schema.Types.ObjectId,
        ref: 'Marca',
        required: true
    },
    img: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    stock: {
        type: Number,
        required: [true, 'El stock es necesario']
    },
    minimo: {
        type: Number,
        required: [true, 'El stock minimo o de alerta es necesario']
    },
    codigoBarra:{
        type: Number,
        required: false
    }
});


module.exports = mongoose.model('Producto', productoSchema);