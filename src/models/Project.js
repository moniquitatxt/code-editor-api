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
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Exportamos el modelo de proyecto, que utiliza el schema definido anteriormente. El nombre del modelo es "Project"
module.exports = mongoose.model("Project", projectSchema);
