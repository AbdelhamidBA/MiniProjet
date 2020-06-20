const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const { collection } = require('./Etudiant');

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "ROLE_ENSEIGNANT" }
}, { collection: 'Users', autoCreate: true });

UserSchema.methods.validateSchema = (obj) => {
    const validSchema = Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().required(),
        role: Joi.string().default('ROLE_ENSEIGNANT')
    });
    return Joi.validate(obj, validSchema);
}

module.exports = mongoose.model('Users', UserSchema);