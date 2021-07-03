const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const util = require('util');
const mysql = require('mysql');
const cors = require('cors');


//settings
app.set('port', 4000);
app.set('json spaces', 2);

//middlewares
//app.use(morgan('dev'));
app.use(cors());
app.use(bodyparser.json({limit: '50mb', extended: true})); // Para parsear lo que resiva el servidor a formato json
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true })); // se usa para entender los datos que llegan desde los formularios al poner true estara reconociendo imagenes archivos etc

//Coneccion a base de datos mysql
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '34.94.52.211',
    user: 'root',
    password: 'VQs*6NJN',
    port: 3306,
    database: 'BDAppJob'
});

pool.getConnection((err, conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DB connection was closed');
        }
        if (err.code === 'ER_CON_COUNT ERROR') {
            console.error('DB has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DB connection refused');
        }
    }
    if (conn)
        conn.release();
    return;
});

pool.query = util.promisify(pool.query);
module.exports = pool;

//Routes
app.use(require('./Routes/Rutas')); //Rutas para mi sitio Web
app.use(require('./Routes/empresas')); // Rutas para ingresar y modificar datos de empresas desde cualquier aplicacion
app.use(require('./Routes/Aspirantes')); // Rutas para los usuarios en busca de empleo 
app.use(require('./Routes/Vacantes')); // Rutas para los usuarios en busca de empleo 
app.use(require('./Routes/Postulaciones')); // Rutas para las potulaciones
// starting the server 
app.listen(app.get('port'), () => {
    console.log("Servidor Corriendo en el puerto " + app.get('port'));
});