const express= require('express');
const Router= express.Router();
const pool= require('../server.js');

//Se utiliza
Router.get('/api/aspirantes/:estado/:area_trabajo', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const estado=req.params.estado;
    const area_trabajo= req.params.area_trabajo;
   // console.log(estado +", "+ area_trabajo)
    pool.query('SELECT email FROM Aspirante where estado = ? AND Area_trabajo = ?', [estado, area_trabajo], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
            //console.log(datos);
            res.json(datos);
            
        }
    });
});

Router.get('/api/aspirante/getFoto/:idAspirante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idAspirante=req.params.idAspirante;
    console.log(idAspirante);
    pool.query("SELECT foto FROM Aspirante WHERE idAspirante= ?", [idAspirante], (err, data)=>{
        if(err){
            console.log(err);
            res.status(400).send({msg: "error"});
        }else{
            console.log(data[0].foto);
            res.json(data[0].foto);
        }
    })
});

Router.get('/api/aspirante/:idAspirante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idAspirante=req.params.idAspirante;
    console.log(idAspirante);
    pool.query("SELECT * FROM Aspirante WHERE idAspirante= ?", [idAspirante], (err, data)=>{
        if(err){
            console.log(err);
            res.status(400).send({msg: "error"});
        }else{
            res.json(data[0]);
        }
    })
});


Router.get('/api/aspirante/experiencias/:idAspirante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idAspirante=req.params.idAspirante;
    //console.log(idAspirante);
    pool.query('SELECT * FROM Experiencia WHERE idAspirante = ?', [idAspirante], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
            //console.log(datos);
            res.json(datos);
            
        }
    });
});
Router.get('/api/aspirante/habilidades/:idAspirante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idAspirante=req.params.idAspirante;
    pool.query('SELECT * FROM Habilidad WHERE idAspirante = ?', [idAspirante], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
     //       console.log(datos);
            res.json(datos);
            
        }
    });
});

Router.get('/api/aspirantescorreo/:idAspirante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idAspirante=req.params.idAspirante;
    pool.query('SELECT email FROM Aspirante WHERE idAspirante = ?', [idAspirante], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
            //console.log(datos[0].email);
            res.send({correo: datos[0].email});
            
        }
    });
});

Router.get('/api/aspirante/formaciones/:idAspirante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idAspirante=req.params.idAspirante;
    pool.query('SELECT * FROM Formacion_Academica WHERE idAspirante = ?', [idAspirante], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
            //console.log(datos);
            res.json(datos);
            
        }
    });
});

Router.get('/api/aspirante/especialidades/:idAspirante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idAspirante=req.params.idAspirante;
    pool.query('SELECT * FROM Especializacion WHERE idAspirante = ?', [idAspirante], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
            //console.log(datos);
            res.json(datos);
            
        }
    });
});

Router.get('/api/aspirante/idiomas/:idAspirante', async(req, res)=>{   //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idAspirante=req.params.idAspirante;
    pool.query('SELECT I.Nombre, IA.porcentaje porcentaje FROM Idioma I, Idioma_Aspirante IA WHERE IA.id_Aspirante = ? AND IA.id_Idioma= I.id_Idioma', [idAspirante], (err, datos)=>{
        if(err){
            console.log(err);
            res.status(404).send({msg: "error"});
        }else{
            //console.log(datos);
            res.json(datos);
            
        }
    });
});

module.exports= Router;

