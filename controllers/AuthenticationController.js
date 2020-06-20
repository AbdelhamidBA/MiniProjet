const jwt = require('jsonwebtoken');
const mongosse = require('mongoose');
const User = require('../models/User');
const Enseignant = require('../models/Enseignant');



exports.AdminRegister = async(req, res) => {
    try {
        let add = {
            email: 'admin@issatso.com',
            password: 'ISSATSO-ADMIN',
            role: 'ROLE_ADMIN'
        }
        let user = new User(add);
        let added = await user.save();
        if (Object.keys(added).length != 0) {
            let payload = { subject: added._id }
            let token = jwt.sign(payload, 'ISSATSecurityCode')
            res.json({
                token: token,
                message: `Admin is Successfully Added`,
                error: false
            });
        } else {
            res.json({
                token: null,
                message: `Something Went Wrong`,
                error: true
            });
        }

    } catch (err) {
        res.json({
            token: null,
            message: err,
            error: true
        });
    }
}


exports.RegisterUser = async(req, res) => {
    let add = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        cin: req.body.cin,
        date_naiss: req.body.date_naiss,
        email: req.body.email,
        tel: req.body.tel,
        rfid: req.body.rfid
    }
    let enseignant = new Enseignant(add);

    try {
        let addError = await enseignant.validateEnseignant(add);
        if (addError.error == null) {
            let added = await enseignant.save();
            if (Object.keys(added).length != 0) {
                let usdata = {
                    email: added.email,
                    password: added.cin,
                    role: 'ROLE_ENSEIGNANT'
                }
                let us = new User(usdata);
                let account = await us.save();
                let payload = { subject: account._id }
                let token = jwt.sign(payload, 'ISSATSecurityCode')
                res.json({
                    token: token,
                    message: `${added.nom} is Successfully Added`,
                    error: false
                });
            }
        } else {
            //res.render
            res.json({
                token: null,
                message: `${addError.error}`,
                errpr: true
            });
        }
    } catch (err) {
        res.json({
            token: null,
            message: `${err}`,
            error: true
        });
    }
}


exports.login = async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    console.log("email:" + email);
    try {
        let found = await User.findOne({
            email: email,
            password: password
        });
        console.log("User:" + found);
        if (Object.keys(found).length != 0) {
            if (found.role == "ROLE_ENSEIGNANT") {
                let payload = { subject: found._id }
                let token = jwt.sign(payload, 'ISSATSecurityCode');
                let ens = await Enseignant.findOne({ email: found.email });
                console.log("ENS:" + ens.nom);
                res.json({
                    user: { _id: ens._id, nom: ens.nom, prenom: ens.prenom, email: found.email, role: found.role, token: token },
                    message: 'Enseignant Successfully Logged In',
                    error: false
                });
            } else {
                let payload = { subject: found._id }
                let token = jwt.sign(payload, 'ISSATSecurityCode');
                console.log("Admin");
                res.json({
                    user: { _id: found._id, nom: "Admin", prenom: "Admin", role: 'ROLE_ADMIN', email: found, token: token },
                    message: 'Admin Successfully Logged In',
                    error: false
                });
            }

        } else {
            res.json({
                user: null,
                message: 'Check Your Email & Password and Try Again',
                error: false
            });
        }
    } catch (err) {
        res.json({
            user: null,
            message: err,
            error: true
        });
    }
}