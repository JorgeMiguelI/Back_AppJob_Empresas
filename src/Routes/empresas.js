const express = require('express');
const Router = express.Router();
const pool = require('../server.js');

//console.log(peliculas);

var Peticiones = [];

Router.get('/api/personas', async(req, res) => { //Me trae todas las peliculas guardadas
    pool.query('SELECT * FROM Persona', (err, datos) => {
        if (err) {
            res.status(400).send({ msg: "error" });
            console.log(err);
        } else {
            res.json(datos);
        }
    });
});
//se esta usando
Router.get('/api/personas/:correo/:password', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const correo = req.params.correo;
    const password = req.params.password;
    pool.query('SELECT * FROM Persona where email_registro = ? and password_registro = ?', [correo, password], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            res.json(datos[0]);
            //console.log(datos[0]);
        }
    });
});

Router.get('/api/personas/:id', async(req, res) => {
    const id_persona = req.params.id;
    pool.query('SELECT * FROM Persona where RFC = ?', [id_persona], (err, datos) => {
        if (err) {
            res.status(400).send({ message: "Error al realizar la consulta" });
        } else {
            if (datos.length == 0) {
                res.json({ msg: "Empresa no encontrada" });
            } else {
                res.json(datos[0]);
            }
        }
    });
});
//se esta usando
Router.get('/api/organizaciones/:rfc', async(req, res) => {
    const id_orga = req.params.rfc;
    pool.query('SELECT * FROM Moral where RFC = ?', [id_orga], (err, datos) => {
        if (err) {
            res.status(400).send({ message: "Error al realizar la consulta" });
        } else {
            if (datos.length == 0) {
                res.json({ msg: "Organizacion no encontrada" });
            } else {
                res.json(datos[0]);
            }
        }
    });
});
Router.get('/api/personasFisicas/:id', async(req, res) => {
    const id_persona = req.params.id;
    pool.query('SELECT * FROM Fisica where RFC = ?', [id_persona], (err, datos) => {
        if (err) {
            res.status(400).send({ message: "Error al realizar la consulta" });
        } else {
            if (datos.length == 0) {
                res.json({ msg: "Persona no encontrada" });
            } else {
                //  console.log(datos[0])
                res.json(datos[0]);
            }
        }
    });
});

//Se utiliza
Router.post('/api/personas', async(req, res) => {
    //console.log(req);
    //console.log(req.body);
    pool.query('INSERT INTO Persona SET ?', [req.body], (err, datos) => {
        if (err) {
            res.status(400).send({ msg: "Error al guardar los datos" });
            console.log(err)
        } else {
            //pool.query('INSERT ')
            res.json({ msg: "Bien" });
        }
    });
});
//Se utiliza
Router.post('/api/personas/fisicas', async(req, res) => {
    //console.log(req.body);
    pool.query('INSERT INTO Fisica SET ?', [req.body], (err, exit) => {
        if (err) {
            res.status(400).send({ msg: "Error al guardar los datos" });
        } else {
            res.json({ msg: "Bien" });
        }
    })
});
//Se utiliza
Router.post('/api/personas/morales', async(req, res) => {
    //console.log(req.body);
    pool.query('INSERT INTO Moral SET ?', [req.body], (err, exit) => {
        if (err) {
            res.status(400).send({ msg: "Error al guardar los datos" });
        } else {
            res.json({ msg: "Bien" });
        }
    })
});

//Se usa
Router.put('/api/personas', async(req, res) => {
    var Data = req.body;
    //console.log(Data);
    var idPersona = Data.RFC;
    pool.query('update Persona SET ? WHERE RFC= ?', [Data, idPersona], (err, datos) => {
        if (err) {
            res.status(400).send({ message: "Error al Actualizar" });
        } else {
            res.json(Data);
        }
    });
});

Router.put('/api/organizacion/changephoto/:idOrga', async(req, res)=>{
    let idOrganizacion= req.params.idOrga;
    let foto= req.body.fotografia;
    pool.query("UPDATE Moral SET foto = ? WHERE RFC = ?", [foto, idOrganizacion], (err, data)=>{
        if(err){
            res.status(400).send({msg: "Error"});
        }else{
            res.json({msg: "Bien"});
        }
    })
})

Router.get('/api/organizacion/getPhoto/:idOrga', async(req, res)=>{
    let idOrganizacion= req.params.idOrga;
    pool.query("SELECT foto FROM Moral WHERE RFC = ?", [idOrganizacion], (err, data)=>{
        if(err){
            res.status(400).send({msg: "error"});
        }else{
            res.json(data[0]);
        }
    })
})

Router.put('/api/perFisica/changephoto/:idPersona', async(req, res)=>{
    let idPersonaFis= req.params.idPersona;
    let foto= req.body.fotografia;
    pool.query("UPDATE Fisica SET foto = ? WHERE RFC = ?", [foto, idPersonaFis], (err, data)=>{
        if(err){
            res.status(400).send({msg: "Error"});
        }else{
            res.json({msg: "Bien"});
        }
    })
})

Router.get('/api/perFisica/getPhoto/:idPersona', async(req, res)=>{
    let idPersona= req.params.idPersona;
    pool.query("SELECT foto FROM Fisica WHERE RFC = ?", [idPersona], (err, data)=>{
        if(err){
            res.status(400).send({msg: "error"});
        }else{
            res.json(data[0]);
        }
    })
})

//Se usa
Router.put('/api/organizaciones', async(req, res) => {
    var Data = req.body;
    //console.log(Data);
    var idPersona = Data.RFC;
    pool.query('update Moral SET ? WHERE RFC= ?', [Data, idPersona], (err, datos) => {
        if (err) {
            res.status(400).send({ message: "Error al Actualizar" });
        } else {
            res.json(Data);
        }
    });
});
Router.put('/api/personasFisicas', async(req, res) => {
    var Data = req.body;
    console.log(Data);
    var idPersona = Data.RFC;
    pool.query('update Fisica SET ? WHERE RFC= ?', [Data, idPersona], (err, datos) => {
        if (err) {
            res.status(400).send({ message: "Error al Actualizar" });
        } else {
            res.json(Data);
        }
    });
});


Router.delete('/api/personas/:id', (req, res) => {
    const idPersona = req.params.id;
    pool.query('DELETE FROM persona WHERE id_persona = ?', [idPersona], (err, datos) => {
        if (err) {
            res.status(400).send({ msg: "Error no se pudo eliminar" });
        } else {
            if (datos.affectedRows == 0) {
                res.send({ msg: "la Empresa no existe " });
            } else {
                res.send({ msg: "Eliminacion Correcta" });
            }
        }
    });
});

module.exports = Router;