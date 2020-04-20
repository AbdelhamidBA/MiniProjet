const mongoose = require('mongoose')
const Joi = require('joi')
const Schema = mongoose.Schema;

const SalleSchema = new Schema({
    libelle: { type: String, unique: true, required: true }
}, { collection: 'Salle' });

SalleSchema.methods.validateSalle = (obj) => {
    const validSchema = Joi.object().keys({
        libelle: Joi.string().trim().required()
    });
    return Joi.validate(obj, validSchema);
}
module.exports = mongoose.model('Salle', validateSalle);