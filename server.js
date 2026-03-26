//Dependencias de la api
const express = require ('express');
const mongoose = require ('mongoose'); //Dependencia que se encarga de la comunicación con MongoDB y el manejo de la información
require('dotenv').config();

const app =  express();
const PORT = process.env.PORT || 3000; //Puerto

//String de conexión con el schema de mongoDB
const mongoURI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@127.0.0.1:27017/${process.env.MONGO_DB}`;

//Prueba de conexión
mongoose.connect(mongoURI)
    .then(() => console.log("Conectado a MongoDB localmente de forma segura."))
    .catch(err => console.error("Error de conexión:", err));

//Mapeo del arreglo para consultar la información, los datos deben estar definidos como en la base de datos
const DataSchema = new mongoose.Schema({ 
    fname: String, 
    lname: String,
    yearsOld: Number,
    country: String,
    city : String 
}, { collection: 'TEST' }); //Definir la colección donde se va a hacer la búsqueda, es el equivalente a las tablas de sql server

//Creación del Modelo, que es como el objeto que trae consigo los datos consultados en formato JSON
const testModel = mongoose.model('testModel', DataSchema); //

//Endpoint de la consulta de la base de datos en mongodb
app.get('/api/v1/datos', async (req, res) => {
    try {
        
        const datos = await testModel.find().limit(100).lean();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: "Error interno al consultar la base de datos" });
    }
});

//Puerto donde corre el servicio de la API
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});
