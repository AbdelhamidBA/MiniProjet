const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const EnseignantSchema = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    cin: { type: String, unique: true, minlength: 8, maxlength: 8, required: true },
    date_naiss: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    tel: { type: String, unique: true, minlength: 8, maxlength: 8, required: true },
    rfid: { type: String, unique: true, minlength: 8, maxlength: 8, required: true }
}, { collation: 'Enseignant' });

EnseignantSchema.methods.validateEnseignant = (obj) => {
    const validSchema = Joi.object().keys({
        nom: Joi.string().trim().required(),
        prenom: Joi.string().trim().required(),
        cin: Joi.string().trim().min(8).max(8).required(),
        date_naiss: Joi.string().trim().required(),
        email: Joi.string().trim().email().required(),
        tel: Joi.string().regex(/^\d+$/).min(8).max(8).required(),
        rfid: Joi.string().trim().min(8).max(8).required()
    });

    return Joi.validate(obj, validSchema);
};

module.exports = mongoose.model('Enseignant', EnseignantSchema);