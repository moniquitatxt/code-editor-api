const mongoose = require("mongoose"); // Importamos la biblioteca Mongoose para trabajar con MongoDB

// Definimos el schema de un proyecto
const projectSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		default: "",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Definimos el schema de un usuario
const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	projects: [projectSchema], // El usuario tiene un arreglo de proyectos, cada uno con el schema definido anteriormente
});

module.exports = mongoose.model("User", userSchema); // Exportamos el modelo de usuario, que utiliza el schema definido anteriormente. El nombre del modelo es "User".
