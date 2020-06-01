const mongoose = require('mongoose');
const Presence = require('../models/Presence');
const Seance = require('../models/Seance');
const Matiere = require('../models/Matiere');
const Filiere = require('../models/Filiere');
const Etudiant = require('../models/Etudiant');
const Enseignant = require('../models/Enseignant');
const Salle = require('../models/Salle');
const moment = require('moment');
const joi = require('joi');

exports.ListSeance = async(req, res) => {
    try {
        let idEnseignant = req.params.idens;
        let idMatiere = req.body.id_matiere;
        let idFiliere = req.body.id_filiere;
        let date = req.body.date;

        let filtre = {
            id_ens: idEnseignant
        }

        if (idMatiere !== "" && idMatiere !== undefined) {
            filtre.id_matiere = idMatiere;
        }

        if (idFiliere !== "" && idFiliere !== undefined) {
            filtre.id_filiere = idFiliere;
        }

        if (date !== "" && date !== undefined) {
            if (moment(date, 'YYYY-MM-DD', true).isValid()) {
                let currentDay = moment().format('YYYY-MM-DD');
                let seanceDate = moment(date).format('YYYY-MM-DD');
                if (moment(seanceDate).isBefore(currentDay)) {
                    filtre.date = date;
                }
            }
        }

        let seance = await Seance.find(filtre);
        if (seance != null) {
            res.json({
                seance: seance,
                error: false
            });
        } else {
            res.json({
                seance: null,
                error: false
            });
        }
    } catch (err) {
        console.log("Error Seance" + err);
        res.json({
            seance: null,
            error: true
        });
    }
}


exports.InsertMatiere = async(req, res) => {
    try {

        let ens = new Presence({
            id_seance: '5eceee1fb673f840f804e4c3',
            id_etd: '5ecee91e643f9e2e4c98befc',
            //date: { type: String, required: true },
            etat: 'P',
        })


        let newMat = await ens.save()
        console.log('Sucessfully Added :' + newMat)
    } catch (err) {
        console.log('Inserting Error : ' + err)
    }
}

async function ListEtudiant(idFiliere) {
    try {

        let list = await Etudiant.find({ id_filiere: idFiliere });
        if (Object.keys(list).length !== 0) {
            return list;
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
    }
}

exports.ListPresence = async(req, res) => {
    let presencetd = [];
    let stdFound = false;
    try {
        let IdSeance = req.params.idseance;
        let seance = await getSeanceByID(IdSeance);
        let presence = await Presence.find({ id_seance: IdSeance });

        let listetudiant = await ListEtudiant(seance.id_filiere);

        listetudiant.forEach(etd => {
            presence.forEach(pre => {


                if (pre.id_etd.toString() === etd._id.toString()) {
                    stdFound = true;
                }
            });
            if (stdFound) {
                presencetd.push({
                    id: etd._id,
                    nom: etd.nom,
                    prenom: etd.prenom,
                    etat: "P"
                });
            } else {
                presencetd.push({
                    id: etd._id,
                    nom: etd.nom,
                    prenom: etd.prenom,
                    etat: "A"
                });
            }

            stdFound = false;
        });

        res.json({
            ListPres: JSON.parse(JSON.stringify(presencetd))
        });
    } catch (err) {
        res.json({
            ListPres: null
        });
    }
}


exports.getMatiere = async(req, res) => {
    try {
        //let idEnseignant = req.body.idens;
        let matiere = await Matiere.find();
        if (Object.keys(matiere).length != 0) {
            res.json({
                matiere: matiere,
                error: false
            });
        } else {
            res.json({
                matiere: null,
                error: false
            });
        }
    } catch (err) {
        console.log(err)
        res.json({
            matiere: null,
            error: true

        });
    }
}

exports.getFiliere = async(req, res) => {
    try {
        //let idEnseignant = req.params.idens;
        let filiere = await Filiere.find();
        if (filiere != null) {
            res.json({
                filiere: filiere,
                error: false
            });
        } else {
            res.json({
                filiere: null,
                error: false
            });
        }
    } catch (err) {
        res.json({
            filiere: null,
            error: true
        });
    }
}

async function getSeanceByID(idSeance) {
    try {
        let seance = await Seance.findById(idSeance);
        console.log("done")
        if (seance != null) {
            return seance;
        } else {
            return null
        }
    } catch (err) {
        console.log("getSeanceByID Error:" + err);
    }
}

exports.statistic = async(req, res) => {
    try {
        let statis = await Etudiant.countDocuments();
        if (statis != null) {
            res.json("le nombre d'étudiant est :" + statis);
        } else {
            res.json("erreur");
        }
    } catch (err) {
        console.log(err);
    }
}

exports.UpdateEtudiant = async(req, res) => {

    let idseance = req.body.id_seance;
    let idetd = req.body.id_etd;

    try {
        let presenceLine = await Presence.findOne({ id_seance: idseance, id_etd: idetd });
        if (presenceLine != null) {
            if (Object.keys(presenceLine).length != 0) {
                let del = await Presence.findByIdAndDelete(presenceLine._id);
                res.json({
                    message: "l'état de l'étudiant a été modifié avec succées",
                    error: false
                });
            } else {
                let etd = {
                    id_seance: idseance,
                    id_etd: idetd,
                    etat: "P"
                }
                let add = await Presence.save(etd);
                if (Object.keys(add).length != 0) {
                    res.json({
                        message: "l'état de l'étudiant a été modifié avec succées",
                        error: false
                    });
                } else {
                    res.json({
                        message: "Opération rejeté",
                        error: true
                    });

                }
            }
        } else {
            let etd = new Presence({
                id_seance: idseance,
                id_etd: idetd,
                etat: "P"
            });
            let add = await etd.save();
            if (Object.keys(add).length != 0) {
                res.json({
                    message: "l'état de l'étudiant a été modifié avec succées",
                    error: false
                });
            } else {
                res.json({
                    message: "Opération rejeté",
                    error: true
                });

            }
        }
    } catch (err) {
        console.log(err)
        res.json({
            message: err,
            error: true
        });
    }
}