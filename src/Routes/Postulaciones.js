const express= require('express');
const Router= express.Router();
const pool= require('../server.js');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport')

Router.get('/api/postulacion/vacante/:idVacante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idVcante=req.params.idVacante;
    pool.query('SELECT COUNT(*) nPostulaciones FROM vacante_aspirante WHERE id_vacante= ?', [idVcante], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
            //console.log(datos[0].nPostulaciones)
            res.json({nPostulaciones: datos[0].nPostulaciones});
            //console.log(datos[0]);
        }
    });
});

Router.get('/api/aspirante/vacante/:idVacante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idVcante=req.params.idVacante;
    //console.log(idVcante);
    pool.query('SELECT idAspirante, Nombre, email, Password, telefono, foto, estado, ciudad, municipio, domicilio, Area_trabajo, cargo_deseado, fecha_Nacimiento, P.fecha_postulacion, P.estatus_postulacion FROM Aspirante, vacante_aspirante P WHERE P.id_vacante= ? AND P.id_aspirante= idAspirante', [idVcante], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
            //console.log(datos)
            res.json(datos);
            //console.log(datos[0]);
        }
    });
});
//api para traer a los candidatos que fueron aceptados
Router.get('/api/postulacion/aceptados/:idVacante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idVcante=req.params.idVacante;
    console.log(idVcante)
    //console.log(idVcante);
    pool.query("SELECT A.idAspirante, A.Nombre, A.email, A.Password, A.telefono, A.foto, A.estado, A.ciudad, A.municipio, A.domicilio, A.Area_trabajo, A.cargo_deseado, A.fecha_Nacimiento, P.fecha_postulacion, P.estatus_postulacion FROM Aspirante A, vacante_aspirante P WHERE P.id_vacante= ? AND P.estatus_postulacion= 'S' AND A.idAspirante= P.id_aspirante", [idVcante], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
            res.json(datos);
            //console.log(datos[0]);
        }
    });
});



module.exports= Router;