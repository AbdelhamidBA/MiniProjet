const mongoose = require('mongoose')
const Joi = require('joi')
const Float = require('mongoose-float').loadType(mongoose);
const Schema = mongoose.Schema;

const MatiereSchema = new Schema({
    libelle: { type: String, required: true },
    rigime: { type: String, minlength: 1, maxlength: 2, required: true },
    type: { type: String, required: true },
    nbSeanceTotal: { type: Float, required: true },
    nbSeanceMin: { type: Number, required: true }
}, { collection: 'Matiere', autoCreate: true });

MatiereSchema.methods.validateMatiere = (obj) => {
    const validSchema = Joi.object().keys({
        libelle: Joi.string().required(),
        rigime: Joi.string().trim().min(1).max(2).required(),
        type: Joi.string().required(),
        nbSeanceTotal: Joi.number().required(),
        nbSeanceMin: Joi.number().required()
    });
    return Joi.validate(obj, MatiereSchema);
}

module.exports = mongoose.model('Matiere', MatiereSchema);