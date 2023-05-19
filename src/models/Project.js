const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	status: { type: String, enum: ["active", "inactive"], required: true },
});

module.exports = mongoose.model("Project", projectSchema);
