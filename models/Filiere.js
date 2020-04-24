const mongoose = require('mongoose')
const Joi = require('joi')
const Schema = mongoose.Schema;

const FiliereSchema = new Schema({
    libelle: { type: String, unique: true, required: true }
}, { collection: 'Filiere' });

FiliereSchema.methods.validateFiliere = (obj) => {
    const validSchema = Joi.object().keys({
        libelle: Joi.string().trim().required()
    });
    return Joi.validate(obj, validSchema);
}
module.exports = mongoose.model('Filiere', FiliereSchema);