const express= require('express');
const mongoose = require('mongoose');
const Etudiant = require('../models/Etudiant');
const Salle = require('../models/Salle')
const Enseignant = require('../models/Enseignant')
const Matiere = require('../models/Matiere')
const Seance = require('../models/Seance')
const Filiere = require('../models/Filiere')
const Presence = require('../models/Presence')

exports.AddStudent= async(req,res) => {
  
      const etudiant= new Etudiant({
        nom: req.body.nom,
        prenom: req.body.prenom,
        date_naiss: req.body.date_naiss,
        cin: req.body.cin,
        email: req.body.email,
        tel:req.body.tel,
        rfid:req.body.rfid,
        id_filiere:req.body.id_filiere
      });
   try {  
        const savedetudiant= await etudiant.save();
        
        res.json(savedetudiant);
        console.log('add vide',savedetudiant);
        if (savedetudiant==null)
       {console.log('add vide');} else{console.log('add non vide');}

  }catch(err){
     res.json({message: err})
  }
}





exports.updateStudent= async(req,res) =>{
  try{
    const updatedStudent = await Etudiant.updateOne({_id: req.params.etudiantId},
        {$set : {
         nom: req.body.nom,
        prenom: req.body.prenom,
        date_naiss: req.body.date_naiss,
        cin: req.body.cin,
        email: req.body.email,
        tel:req.body.tel,
        rfid:req.body.rfid,
        id_filiere:req.body.id_filiere
        }}
        )
        res.json(updatedStudent);
  }catch(err){res.json({update: err})}
}

exports.listeEtudiant= async(req,res) => {
    try{
    const etudiant= await Etudiant.find();
    res.json(etudiant);
    }catch(err){ res.json({message: err})}
}
exports.getEtudiant= async(req,res) => {
    try{
    const etudiant= await Etudiant.findById({_id:req.params.studentId});
    res.json(etudiant);
    }catch(err){res.json({message:err})}
}
exports.deleteStudent= async(req,res) => {
  try{
    const removedstudent= await Etudiant.remove({_id:req.params.studentId});
    res.json(removedstudent);
  }catch(err){
    res.json({message:err})
  }
}



exports.Elimination= async(req,res) => {
 try{
  let ListeElimination=[];
  let Matiere= await getMatiere(req.params.idmatiere);
  console.log("matiere",Matiere);
 
  let Minseance = Matiere.nbSeanceMin;
  console.log('----');
    let liste= await getEtudiant(req.params.idfiliere) ;
    console.log("liste"+liste);
            for(let i=0;i<liste.length;i++){
                  let countpres=await countPresence(liste[i]._id,req.params.idmatiere);
                         if (countpres < Minseance )
                          ListeElimination.push(liste[i]);
                        
                        }   

                        console.log("elimination" +ListeElimination)
                        res.json(ListeElimination);
  }catch(err){
    res.json({message:err})

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

async function getFiliere(idFiliere) {
  try {
      let filiere = await Filiere.findOne({ _id: idFiliere })
      return filiere
  } catch (err) {
      console.log('Filiere:' + err)
  }
}




async function countPresence(idetud,idmat) {
  try {
      let count= await Presence.count({
     
      id_seance: { "$in": await getSeanceofmatiere(idmat) },
      id_etd: idetud });
      
      console.log('count'+count) ;
      return count;
  }catch(err){
    console.log('presencecount'+err)
  }
}

async function getSeanceofmatiere(idmat) {
  try {
      let arrayID = [];
      let seance = await Seance.find({ id_matiere: idmat })
      console.log('seance'+ seance);
      for(let s of seance){
        arrayID.push(s._id);
      }
      console.log("ArrayID:"+ arrayID);
      return arrayID;

  } catch (err) {
      console.log('Seance:' + err)
  }
}

async function getEtudiant(id_fil) {
  try {
   
      let etd = await Etudiant.find({ id_filiere:id_fil})
      return etd
  } catch (err) {
      console.log('Etudiant:' + err)
  }
}



