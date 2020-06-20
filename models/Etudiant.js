const Joi = require('joi');
const mongoose = require('mongoose');
const { json } = require('express');
const Schema = mongoose.Schema;
const EtudiantSchema = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    cin: { type: String, unique: true, required: true },
    date_naiss: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    tel: { type: String, unique: true, required: true },
    id_filiere: { type: Schema.Types.ObjectId, ref: 'Filiere', required: true },
    rfid: { type: String, unique: true, required: true }
}, { collection: 'Etudiant', autoCreate: true });

EtudiantSchema.methods.validateEtudiant = (obj) => {
    let validSchema = Joi.object().keys({
        nom: Joi.string().trim().required(),
        prenom: Joi.string().trim().required(),
        cin: Joi.string().trim().min(8).max(8).required(),
        date_naiss: Joi.string().trim().required(),
        email: Joi.string().trim().email().required(),
        tel: Joi.string().regex(/^\d+$/).required(),
        id_filiere: Joi.string().alphanum().required(),
        rfid: Joi.string().trim().min(8).max(8).required()
    });
    return Joi.validate(obj, validSchema);
}

module.exports = mongoose.model('Etudiant', EtudiantSchema);