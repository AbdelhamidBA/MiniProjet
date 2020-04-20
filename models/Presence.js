const mongoose = require('mongoose')
const Joi = require('joi')
const Schema = mongoose.Schema;

const PresenceSchema = new Schema({
    id_seance: { type: Schema.Types.ObjectId, ref: 'Seance', required: true },
    id_etd: { type: Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    date: { type: String, required: true },
    etat: { type: String, required: true, minlength: 1, maxlength: 1 }
}, { collection: 'Presence' });

PresenceSchema.methods.validatePresence = (obj) => {
    const validSchema = Joi.object().keys({
        id_seance: Joi.string().alphanum().required(),
        id_etd: Joi.string().alphanum().required(),
        date: Joi.string().trim().required(),
        etat: Joi.string().trim().required().min(1).max(1)
    });
    return Joi.validate(obj, validSchema);
}

module.exports = mongoose.model('Presence', PresenceSchema);