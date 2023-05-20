const mongoose = require("mongoose");
const projectSchema = require("../models/Project");

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
	projects: [projectSchema],
});

module.exports = mongoose.model("User", userSchema);
