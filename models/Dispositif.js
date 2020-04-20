const mongoose = require('mongoose')
const Joi = require('joi')
const Schema = mongoose.Schema;

const DispositifSchema = new Schema({
    id_salle: { type: Schema.Types.ObjectId, ref: 'Salle', required: true }
}, { collection: 'Dispositif' });

DispositifSchema.methods.validateDispositif = (obj) => {
    const validSchema = Joi.object().keys({
        id_salle: Joi.string().alphanum().required()
    });
    return Joi.validate(obj, validSchema);
}
module.exports = mongoose.model('Dispositif', DispositifSchema);