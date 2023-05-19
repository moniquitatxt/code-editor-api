const express = require("express");
const projectSchema = require("../models/Project");

const router = express.Router();

// create project
router.post("/projects", (req, res) => {
	const project = projectSchema(req.body);
	project
		.save()
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

// get all projects
router.get("/projects", (req, res) => {
	projectSchema
		.find()
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

// get a project
router.get("/projects/:id", (req, res) => {
	const { id } = req.params;
	projectSchema
		.findById(id)
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

// delete a project
router.delete("/projects/:id", (req, res) => {
	const { id } = req.params;
	projectSchema
		.remove({ _id: id })
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

// update a project
router.put("/projects/:id", (req, res) => {
	const { id } = req.params;
	const { name, description, status } = req.body;
	projectSchema
		.updateOne({ _id: id }, { $set: { name, description, status } })
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

module.exports = router;
