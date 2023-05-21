// Importamos las bibliotecas necesarias
const express = require("express"); // Framework Express
//En el contexto de Mongoose, un schema es una representación de la estructura de los datos que se almacenarán en una colección de MongoDB. Un schema define los campos que tendrá cada documento en la colección
const userSchema = require("../models/User"); // Esquema de usuario
const projectSchema = require("../models/Project"); // Esquema de proyecto

const router = express.Router(); // Creamos un objeto router de Express para definir nuestras rutas

//Leyenda userId es el identificador del usuario específicado, y projectId es el identificador del proyecto especificado

// Ruta para crear un proyecto para un usuario específico
router.post("/users/:userId/projects", (req, res) => {
	// Extraemos el ID del usuario de los parámetros de la URL
	const { userId } = req.params;

	// Creamos un nuevo proyecto con los datos de la solicitud
	const project = new projectSchema(req.body);

	userSchema
		.findByIdAndUpdate(userId, { $push: { projects: project } }, { new: true }) // Agregamos el proyecto al array de proyectos del usuario en la base de datos
		.then((data) => {
			res.json(project); // Enviamos al cliente (nuestra página web) la información del proyecto creado
		})
		.catch((error) => res.json({ message: error })); // Enviamos un mensaje de error si ocurrió algún problema
});

// Ruta para obtener todos los proyectos de un usuario específico
router.get("/users/:userId/projects", (req, res) => {
	const { userId } = req.params; // Extraemos el ID del usuario de los parámetros de la URL
	userSchema
		.findById(userId, "projects") // Buscamos el usuario en la base de datos y especificamos que solo queremos obtener la lista de proyectos
		.populate("projects") // Poblamos la lista de proyectos con la información completa de cada proyecto
		.then((user) => {
			res.json(user.projects); // Enviamos al cliente la lista de proyectos
		})
		.catch((error) => res.json({ message: error })); // Enviamos un mensaje de error si ocurrió algún problema
});

// Ruta para obtener un proyecto específico de un usuario específico
router.get("/users/:userId/projects/:projectId", (req, res) => {
	// Extraemos el ID del usuario y del proyecto de los parámetros de la URL
	const { userId, projectId } = req.params;

	userSchema
		.findById(userId, "projects") // Buscamos el usuario en la base de datos y especificamos que solo queremos obtener la lista de proyectos
		.populate({
			path: "projects", // Poblamos la lista de proyectos con la información completa de cada proyecto
			match: { _id: projectId }, // Especificamos que solo queremos el proyecto con el ID correspondiente
		})
		.then((user) => {
			const project = user.projects.find((p) => p._id.equals(projectId)); // Buscamos el proyecto en el array de proyectos del usuario
			if (!project) {
				return res.json({ message: "El proyecto no se encontró" }); // Enviamos un mensaje de error si el proyecto no se encontró
			}
			res.json(project); // Enviamos al cliente la información del proyecto
		})
		.catch((error) => res.json({ message: error })); // Enviamos un mensaje de error si ocurrió algún problema
});

// Ruta para eliminar un proyecto específico de un usuario específico
router.delete("/users/:userId/projects/:projectId", (req, res) => {
	// Extraemos el ID del usuario y del proyecto de los parámetros de la URL
	const { userId, projectId } = req.params;

	userSchema
		.updateOne({ _id: userId }, { $pull: { projects: { _id: projectId } } }) // Eliminamos el proyecto del array de proyectos del usuario en la base de datos
		.then((result) => {
			if (result.nModified === 0) {
				return res.json({ message: "El proyecto no se encontró" }); // Enviamos un mensaje de error si el proyecto no se encontró
			}
			res.json({ message: "El proyecto fue eliminado exitosamente" }); // Enviamos un mensaje indicando que el proyecto se eliminó correctamente
		})
		.catch((error) => res.json({ message: error })); // Enviamos un mensaje de error si ocurrió algún problema
});

// Ruta para actualizar un proyecto específico de un usuario específico
router.put("/users/:userId/projects/:projectId", (req, res) => {
	const { userId, projectId } = req.params; // Extraemos el ID del usuario y del proyecto de los parámetros de la URL
	const { code } = req.body; // Extraemos el código del proyecto de la solicitud
	userSchema
		.findOneAndUpdate(
			{ _id: userId, "projects._id": projectId }, // Buscamos el proyecto en la base de datos
			{
				$set: {
					"projects.$.code": code, // Actualizamos el código del proyecto
				},
			},
			{ new: true }
		)
		.then((user) => {
			const project = user.projects.find((p) => p._id.toString() === projectId); // Buscamos el proyecto en el array de proyectos del usuario
			if (!project) {
				return res.json({ message: "El proyecto no se encontró" }); // Enviamos un mensaje de error si el proyecto no se encontró
			}
			res.json(project); // Enviamos al cliente la información del proyecto actualizado
		})
		.catch((error) => res.json({ message: error })); // Enviamos un mensaje de error si ocurrió algún problema
});

module.exports = router; // Exportamos el objeto router para que pueda ser utilizado en otros módulos de la aplicación.
