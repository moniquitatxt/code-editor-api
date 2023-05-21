//Importación de las librerías necesarias
//Express es un framework web para Node.js que se utiliza para construir aplicaciones web y APIs RESTful
const express = require("express");
//Mongoose es una biblioteca de Node.js que proporciona una interfaz para trabajar con MongoDB, una base de datos NoSQL
const mongoose = require("mongoose");
//Librería  Cors para permitir solicitudes desde otras fuentes
const cors = require("cors");

//Importación de las entidades que hacen referencia a las peticiones a la base de datos del CRUD de cada entidad
// Rutas de usuario
const userRoute = require("./routes/user");
// Rutas de proyecto
const projectRoute = require("./routes/project");

//Dotenv es una librería de Node.js, se utiliza para cargar variables de entorno desde un archivo .env que tiene las credenciales de la base de datos en mongodb
require("dotenv").config();

// Creamos una instancia de Express
const app = express();
// Definimos el puerto a utilizar, el valor por defecto es 9000
const port = process.env.PORT || 9000;

//middleware
// Analizamos las solicitudes entrantes con formato JSON
app.use(express.json());
// Permitimos solicitudes desde cualquier origen
app.use(cors());
// Usamos las rutas de usuario en la ruta /api
app.use("/api", userRoute);
// Usamos las rutas de proyecto en la ruta /api
app.use("/api", projectRoute);

// Conexión con MongoDB
mongoose
	.connect(process.env.MONGOURL) // Conectamos a la base de datos usando la URL especificada en la variable de entorno MONGOURL
	.then(() => console.log("Conectado a la base de datos")) // Si la conexión es exitosa, imprimimos un mensaje en la consola
	.catch((error) => console.log(error)); //Si hay un error en la conexión, imprimimos el error en la consola

// Iniciamos el servidor Express
app.listen(9000, () => console.log("listening on port", port));

// Exportamos la aplicación para poder ser utilizada en otros módulos
module.exports = app;
