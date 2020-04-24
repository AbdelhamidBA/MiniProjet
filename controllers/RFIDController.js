const mongoose = require("mongoose");
const Salle = require('../models/Salle')
const Enseignant = require('../models/Enseignant')
const Matiere = require('../models/Matiere')
const Seance = require('../models/Seance')
const Filiere = require('../models/Filiere')
const Etudiant = require('../models/Etudiant')
const Presence = require('../models/Presence')
const moment = require('moment');
const { func } = require("joi");

//Testing Example
// AP 5ea2e203cff0ab3684e7b2ed
// AC 5ea2e2e6e64a0a3e2c88745f
// salle 5ea2e3bb2452d8135c931500
// Salle i2 5ea2e5155c46eb2790afac1e
// Filiere FIA2 5ea2e49b92b8440f44379d2e
// Filiere FIA1 5ea2e4cb1a92ae1d98f9e12b
// Enseignant 5ea1e5a1ba0e353230e98fb6
exports.InsertMatiere = async(req, res) => {
    try {
        let ens = new Etudiant({
            nom: 'Ben Abdefettah',
            prenom: 'Abdelhamid',
            cin: '06959108',
            date_naiss: '1996-02-18',
            email: 'rev_predator@hotmail.fr',
            tel: '26922402',
            id_filiere: '5ea2e4cb1a92ae1d98f9e12b',
            rfid: 'W1X2C3V4'
        })
        let newMat = await ens.save()
        console.log('Sucessfully Added :' + newMat)
    } catch (err) {
        console.log('Inserting Error : ' + err)
    }
}


exports.OuvertureSession = async(req, res) => {
    let receivedRFID = ""
    let idEnseignant = ""
    let currentSeance
    let currentSalle
    let currentRFID
    let isReadyToOpen = false;
    try {
        receivedRFID = req.body.rfid
        currentRFID = req.body.dispo
        let isTeacher = await isEnseignant(receivedRFID);
        if (isTeacher !== null) {
            idEnseignant = isTeacher._id
            currentSeance = await seanceActif(idEnseignant)
            if (currentSeance != null) {
                currentSalle = await getSalle(currentSeance.id_salle)
                if (currentSalle.libelle === currentRFID) {
                    isReadyToOpen = true
                }
            }

            if (isReadyToOpen == true) {
                let updateStatus = await Seance.findByIdAndUpdate(currentSeance._id, { $set: { etat: 'Taken' } })
                console.log('updated:' + updateStatus)
                res.json({
                    ID_SEANCE: currentSeance._id,
                    ID_FILIERE: currentSeance.id_filiere
                })
            } else {
                res.json({
                    ID_SEANCE: '',
                    ID_FILIERE: ''
                })
            }


        } else {
            res.sendStatus(404)
        }
    } catch (err) {
        console.log('Ouverture Session Error: ' + err)
    }
}

exports.MarquagePres = async(req, res) => {
    let etdRFID
    let idSeance
    let currentSeance
    let currentFiliere
    let currentEtudiant
    try {
        etdRFID = req.body.etdRFID
        idSeance = req.body.idSeance
        currentSeance = await getSeance(idSeance)
        currentFiliere = await getFiliere(currentSeance.id_filiere)
        currentEtudiant = await getEtudiant(etdRFID)
        if (currentEtudiant !== null && currentEtudiant !== undefined) {
            if (currentEtudiant.id_filiere.toString() == currentFiliere._id.toString()) {
                let pres = new Presence({
                    id_seance: idSeance,
                    id_etd: currentEtudiant._id,
                    etat: 'P'
                })
                let marquer = await pres.save()
                if (Object.keys(marquer).length != 0) {
                    res.json({
                        status: 'done'
                    })
                } else {
                    res.json({
                        status: ''
                    })
                }
            } else {
                res.json({
                    status: ''
                })
            }
        } else {
            res.json({
                status: ''
            })
        }

    } catch (err) {
        res.sendStatus(404)
        console.log('MarquagePres :' + err)
    }
}

async function isEnseignant(rfid) {
    try {
        let ens = await Enseignant.findOne({ rfid: rfid })
        return ens
    } catch (err) {
        console.log('Error Message During Looking For Teacher' + err)
    }


}

async function seanceActif(idEnseignant) {
    try {
        let currentDay = moment().format('YYYY-MM-DD')
        let currentHour = moment()
        let currentSeance
        let listofseance = await Seance.find({ id_ens: idEnseignant, date: currentDay.toString() })
        if (listofseance != null) {
            if (Object.keys(listofseance).length !== 0) {
                listofseance.forEach(seance => {
                    let seanceHour = moment(seance.heure, 'HH:mm');
                    let seanceDeadline = moment(seance.heure, 'HH:mm').add(1, 'hours').add(30, 'minutes')
                    if ((currentHour.hour() >= seanceHour.hour()) && (currentHour.hour() <= seanceDeadline.hour())) {
                        if ((currentHour.minute() >= seanceHour.minute()) && (currentHour.minute() <= seanceDeadline.minute())) {
                            currentSeance = seance;
                        }
                    }
                })
                if (currentSeance !== null && currentSeance !== undefined) {
                    return currentSeance
                } else {
                    return null
                }

            }
        } else {
            return null
        }
    } catch (err) {
        console.log('Seance Actif :' + err)
    }
}

async function getMatiere(idMat) {
    try {
        let mat = await Matiere.findOne({ _id: idMat })
        return mat
    } catch (err) {
        console.log('Matiere:' + err)
    }
}

async function getSalle(idSalle) {
    try {
        let salle = await Salle.findOne({ _id: idSalle })
        return salle
    } catch (err) {
        console.log('Salle:' + err)
    }
}

async function getSeance(idSeance) {
    try {
        let seance = await Seance.findOne({ _id: idSeance })
        return seance
    } catch (err) {
        console.log('Seance:' + err)
    }
}

async function getFiliere(idFiliere) {
    try {
        let filiere = await Filiere.findOne({ _id: idFiliere })
        return filiere
    } catch (err) {
        console.log('Filiere:' + err)
    }
}

async function getEtudiant(rfid) {
    try {
        let etd = await Etudiant.findOne({ rfid: rfid })
        return etd
    } catch (err) {
        console.log('Etudiant:' + err)
    }
}