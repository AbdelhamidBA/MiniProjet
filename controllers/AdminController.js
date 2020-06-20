const express= require('express');
const mongoose = require('mongoose');
const Etudiant = require('../models/Etudiant');

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
exports.deleteStudent= async(res,req) => {
  try{
    const removedstudent= await Etudiant.remove({_id:req.params.studentId});
    res.json(removedstudent);
  }catch(err){
    res.json({message:err})
  }
}