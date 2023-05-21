// Importamos las bibliotecas necesarias
const express = require("express"); // Framework Express
//En el contexto de Mongoose, un schema es una representación de la estructura de los datos que se almacenarán en una colección de MongoDB. Un schema define los campos que tendrá cada documento en la colección
const userSchema = require("../models/User"); // Esquema de usuario

const router = express.Router(); // Creamos un objeto router de Express para definir nuestras rutas

//Leyenda id es el identificador del usuario específicado

//Ruta para el inicio de sesión de un usuario
router.post("/login", async (req, res) => {
	const { username, password } = req.body; // Extraemos el nombre de usuario y la contraseña de la solicitud

	// Buscamos el usuario en la base de datos con el campo username
	const user = await userSchema.findOne({ username: username });

	// Si no se encontró el usuario, enviamos un error de autenticación
	if (!user) {
		return res.status(401).json({ message: "El usuario no existe" });
	}
	// Si se encontró el usuario, verificamos si la contraseña es correcta
	if (password !== user.password) {
		return res.status(401).json({ message: "La contraseña es incorrecta" });
	}

	// Si las credenciales son válidas, enviamos un mensaje de éxito
	return res.status(201).json({ message: "Inicio exitoso" });
});

// Ruta para crear un nuevo usuario
router.post("/users", async (req, res) => {
	// Extraemos el nombre de usuario de la solicitud
	const username = req.body.username;
	// Verificamos si el nombre de usuario ya existe en la base de datos
	const existingUser = await userSchema.findOne({ username: username });

	// Si el nombre de usuario ya existe, enviamos un error de conflicto
	if (existingUser) {
		return res
			.status(409)
			.json({ message: "El nombre de usuario ya está en uso." });
	}

	// Si el nombre de usuario no existe, creamos un nuevo objeto de usuario con los datos de la solicitud
	const user = userSchema({
		name: req.body.name,
		username: username,
		password: req.body.password,
	});

	// Guardamos el nuevo usuario en la base de datos
	user
		.save()
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

// Ruta para obtener todos los usuarios de la base de datos
router.get("/users", (req, res) => {
	userSchema
		.find() // Buscamos todos los usuarios en la base de datos
		.then((data) => res.json(data)) // Enviamos al cliente la lista de usuarios
		.catch((error) => res.json({ message: error })); // Enviamos un mensaje de error si ocurrió algún problema
});

// Ruta para obtener un usuario específico por su nombre de usuario
router.get("/users/:username", (req, res) => {
	const { username } = req.params; // Extraemos el nombre de usuario de los parámetros de la URL
	userSchema
		.findOne({ username }) // Buscamos el usuario en la base de datos por su nombre de usuario
		.then((data) => res.json(data)) // Enviamos al cliente la información del usuario encontrado
		.catch((error) => res.json({ message: error })); // Enviamos un mensaje de error si ocurrió algún problema
});

// Ruta para eliminar un usuario específico por su ID
router.delete("/users/:id", (req, res) => {
	const { id } = req.params; // Extraemos el ID del usuario de los parámetros de la URL
	userSchema
		.deleteOne({ _id: id }) // Eliminamos el usuario de la base de datos por su ID
		.then((data) => res.json(data)) // Enviamos al cliente la información del usuario eliminado
		.catch((error) => res.json({ message: error })); // Enviamos un mensaje de error si ocurrió algún problema
});

// Ruta para actualizar un usuario específico por su ID
router.put("/users/:id", (req, res) => {
	const { id } = req.params; // Extraemos el ID del usuario de los parámetros de la URL
	const { name, username, password } = req.body; // Extraemos los datos a actualizar de la solicitud

	userSchema
		.updateOne({ _id: id }, { $set: { name, username, password } }) // Actualizamos el usuario de la base de datos por su ID
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

module.exports = router;
