const mongoose = require('mongoose')
const Joi = require('joi')
const Schema = mongoose.Schema;

const SeanceSchema = new Schema({
    id_ens: { type: Schema.Types.ObjectId, ref: 'Enseignant', required: true },
    id_salle: { type: Schema.Types.ObjectId, ref: 'Salle', required: true },
    id_matiere:  { type: Schema.Types.ObjectId, ref: 'Matiere', required: true },
    id_filiere:{ type: Schema.Types.ObjectId, ref: 'Filere', required: true },
    date: { type: String, required: true },
    heure: { type: String, required: true },
    etat: { type: String, default: 'Scheduled' }
}, { collection: 'Seance' });

SeanceSchema.methods.validateSeance = (obj) => {
    const validSchema = Joi.object().keys({
        id_ens: Joi.string().alphanum().required(),
        id_salle: Joi.string().alphanum().required(),
        id_matiere: Joi.string().alphanum().required(),
        id_filiere: Joi.string().alphanum().required(),
        date: Joi.string().trim().required(),
        heure: Joi.string().trim().required(),
        etat: Joi.string().trim().required()
    });
    return Joi.validate(obj, validSchema);
}






module.exports = mongoose.model('Seance', SeanceSchema);