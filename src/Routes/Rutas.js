const express= require('express');
const Route= express.Router();
const Path= require('path');

Route.get('/', (req, res)=>{
    res.json({Nombre: "Jorge", Apellido: "Ibarra"});
});

module.exports= Route;