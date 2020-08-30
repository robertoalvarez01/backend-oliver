const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let subCategoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    }
});

module.exports = mongoose.model('subCategoria', subCategoriaSchema);