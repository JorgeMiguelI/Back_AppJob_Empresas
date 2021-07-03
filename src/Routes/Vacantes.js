const express = require('express');
const Router = express.Router();
const pool = require('../server.js');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport')

//Se usa
Router.post('/api/vacantes', async(req, res) => {
    pool.query('INSERT INTO Vacante SET ?', [req.body], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(400).send({ msg: "Error al guardar los datos" });
        } else {
            res.send({ idVacante: datos.insertId });
        }
    });
});

Router.put('/api/vacantes', async(req, res) => {
    var info = req.body;
    var id_vacante = info.id_vacante;
    pool.query('UPDATE Vacante SET ? WHERE id_vacante = ? ', [info, id_vacante], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            res.json(info);
        }
    });
});


//Se usa
let ListaVacantes=[];
let ListanPostulaciones=[];
let ListaAceptados= [];
Router.get('/api/vacantes/:idPersona', async(req, res) => {
    ListanPostulaciones=[];
    ListaAceptados=[];
    const idPersona = req.params.idPersona;
    //console.log(idPersona)
    const result= await pool.query('SELECT * FROM Vacante WHERE RFC_persona = ?', [idPersona])
    .then(async data=>{
        ListaVacantes=data;
        await TraernPostulaciones();
        await TraerPostulantes();
        //console.log(ListanPostulaciones)
        res.json({ofertas: data, npostulaciones: ListanPostulaciones, aceptados: ListaAceptados});
    })
    .catch(e=>{
        console.log("Error")
    })
});

async function TraernPostulaciones(){
    for(let vacante of ListaVacantes){
        await ConsultarPostulaciones(vacante.id_vacante)
    }
}
async function TraerPostulantes(){
    for(let vacante of ListaVacantes){
        await VerAceptados(vacante.id_vacante);
    }
}

async function ConsultarPostulaciones(idVacante){
    await pool.query('SELECT COUNT(*) nPostulaciones FROM vacante_aspirante WHERE id_vacante= ?', [idVacante])
    .then(data=>{
        ListanPostulaciones.push(data[0].nPostulaciones)
    })
    .catch(e=>{
        console.log("error");
    })
}

async function VerAceptados(idVacante){
    await pool.query("SELECT A.idAspirante, A.Nombre, A.email, A.Password, A.telefono, A.foto, A.estado, A.ciudad, A.municipio, A.domicilio, A.Area_trabajo, A.cargo_deseado, A.fecha_Nacimiento, P.fecha_postulacion, P.estatus_postulacion FROM Aspirante A, vacante_aspirante P WHERE P.id_vacante= ? AND P.estatus_postulacion= 'S' AND A.idAspirante= P.id_aspirante", [idVacante])
    .then(data=>{
        //console.log(data)
        ListaAceptados.push({vacante: idVacante, aceptados: data})
    })
    .catch(e=>{
        console.log("error");
    })
}


Router.post('/api/sendcorreoaceptacion', async(req, res) => {
    const correodestino = req.body.correo;
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'appjobmx@gmail.com',
            pass: 'JorgeHola123'
        }
    }));
    var mailOptions = {
        from: 'appjobmx@gmail.com',
        to: correodestino, //debe de ir el correo del aspirante interesado
        subject: "Postulacion Aceptada",
        html: "<h1 style='color: red;'>AppJob</h1>" + "<h2>Han aceptado tu postulacion a la vacante "+ req.body.puesto + " Publicada por "+ req.body.publicante  +"</h2>" +
            "<p> Ingresa a tu perfil para que veas mas detalles y espera a que el publicante se comunique contigo.</p>"
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(400).send({ message: "no se mando" });
        } else {
            res.send({ message: "el correo Se mando con exito " });
        }
    });
});
//Se usa
Router.post('/api/vacante/requisitos', async(req, res) => {
    pool.query('INSERT INTO Requisito SET ?', [req.body], (err, exit) => {
        if (err) {
            res.status(400).send({ msg: "mal" });
        } else {
            res.json({ msg: "Bien" });
        }
    });
});
Router.get('/api/vacante/requisitos/:idVacante', async(req, res) => {
    const idVacante = req.params.idVacante;
    pool.query('SELECT descripcion, id_vacante, id_Requisito FROM Requisito WHERE id_vacante =  ?', [idVacante], (err, datos) => {
        if (err) {
            res.status(400).send({ msg: "mal" });
        } else {
            //console.log(datos)
            res.json(datos);
        }
    });
});
Router.get('/api/vacante/prestaciones/:idVacante', async(req, res) => {
    const idVacante = req.params.idVacante;
    pool.query('SELECT descripcion, id_vacante, id_Beneficio FROM Beneficio WHERE id_vacante =  ?', [idVacante], (err, datos) => {
        if (err) {
            res.status(400).send({ msg: "mal" });
        } else {
            //console.log(datos)
            res.json(datos);
        }
    });
});
//Se Usa
Router.post('/api/vacante/prestaciones', async(req, res) => {
    pool.query('INSERT INTO Beneficio SET ?', [req.body], (err, exit) => {
        if (err) {
            res.status(400).send({ msg: "mal" });
        } else {
            res.json({ msg: "Bien" });
        }
    });
});
Router.get('/api/vacante/:idVacante', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idVcante = req.params.idVacante;
    //console.log("IdVacante para buscar estado y area: "+ idVcante);
    pool.query('SELECT estado, area_trabajo FROM Vacante WHERE id_vacante = ?', [idVcante], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            //console.log(datos[0]);
            res.json(datos[0]);
            //console.log(datos[0]);
        }
    });
});


Router.get('/api/vacantes', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idVcante = req.params.idVacante;
    //console.log("IdVacante para buscar estado y area: "+ idVcante);
    pool.query('SELECT * FROM Vacante', (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            console.log(datos[0]);
            res.json(datos);
            //console.log(datos[0]);
        }
    });
});

Router.put('/api/vacante/aspirante', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    var info = req.body;
    var id_vacante = info.id_vacante;
    var id_aspirante = info.id_aspirante;
    pool.query("UPDATE vacante_aspirante SET estatus_postulacion='S' WHERE id_vacante = ? AND id_aspirante= ?", [id_vacante, id_aspirante], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            res.json(info);
            //console.log(datos[0]);
        }
    });
});


Router.get('/api/vacante/aspirante/:idVacante/:idAspirante', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const idVacante = req.params.idVacante;
    const idAspirante = req.params.idAspirante;
    pool.query('SELECT * FROM vacante_aspirante WHERE id_vacante= ? AND id_aspirante= ?', [idVacante, idAspirante], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            res.send({ info: datos[0].estatus_postulacion });
            //console.log(datos[0]);
        }
    });
});

Router.post('/api/sendmail/:email', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const email = req.params.email;
    const info = req.body;
    //console.log(info);
    //console.log(email);
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'appjobmx@gmail.com',
            pass: 'JorgeHola123'
        }
    }));
    var mailOptions = {
        from: 'appjobmx@gmail.com',
        to: email, //debe de ir el correo del aspirante interesado
        subject: "Se ha publicado una nueva vacante que podria interesarte ",
        html: "<h1 style='color: red;'>AppJob</h1>" + "<h2>Puesto: " + info.puesto + "</h2>" + "<h4>Publicado Por: " + info.persona + "</h4>" +
            "<h4>Descripcion de la Vacante</h4>" + "<p>" + info.descripcion + "</p>" + "<br> <h4 style='color: red;'>Ingresa a la aplicación Para que puedas consultar la vacante disponible.</h4>"
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(400).json({ message: "no se mando" });
        } else {
            res.json({ message: "el correo Se mando con exito " });
        }
    });
});

Router.get('/api/sendCorreo/:email', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    const email = req.params.email;
    //console.log(info);
    console.log(email);
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'appjobmx@gmail.com',
            pass: 'JorgeHola123'
        }
    }));
    var mailOptions = {
        from: 'appjobmx@gmail.com',
        to: email, //debe de ir el correo del aspirante interesado
        subject: "Se ha publicado una nueva vacante que podria interesarte ",
        html: "<h1 style='color: red;'>AppJob</h1>" + "<h2>Puesto: Programador</h2>" +
            "<h4>Descripcion de la Vacante</h4>" + "<p> Programador back y front End </p>" + "<button type='button'>Ver Detalles de la Vacante</button>"
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(400).send({ message: "no se mando" });
        } else {
            res.send({ message: "el correo Se mando con exito " });
        }
    });
});

Router.put('/api/vacantes/requisito', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    var info = req.body;
    var id_requisito = info.id_Requisito;
    pool.query('UPDATE Requisito SET ? WHERE id_Requisito = ? ', [info, id_requisito], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            res.json(info);
            //console.log(datos[0]);
        }
    });
});

Router.delete('/api/vacantes/requisito/:idRequisito', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    var id_requisito = req.params.idRequisito;
    pool.query('DELETE FROM Requisito WHERE id_Requisito = ? ', [id_requisito], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            res.json(datos);
            //console.log(datos[0]);
        }
    });
});

Router.put('/api/vacantes/beneficio', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    var info = req.body;
    var id_beneficio = info.id_Beneficio;
    pool.query('UPDATE Beneficio SET ? WHERE id_Beneficio = ? ', [info, id_beneficio], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            res.json(info);
            //console.log(datos[0]);
        }
    });
});
Router.delete('/api/vacantes/beneficio/:idBeneficio', async(req, res) => { //Mandare los parametros desde la appMovil si los encuentra retornara el json con la informacion de la organizacion
    var id_beneficio = req.params.idBeneficio;
    pool.query('DELETE FROM Beneficio WHERE id_Beneficio = ? ', [id_beneficio], (err, datos) => {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: "error" });
        } else {
            res.json(datos);
            //console.log(datos[0]);
        }
    });
});



module.exports = Router;