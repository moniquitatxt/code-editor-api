const express = require("express");
const userSchema = require("../models/User");
const projectSchema = require("../models/Project");

const router = express.Router();

// create project for a user
router.post("/users/:userId/projects", (req, res) => {
	const { userId } = req.params;
	const project = new projectSchema(req.body);
	userSchema
		.findByIdAndUpdate(userId, { $push: { projects: project } }, { new: true })
		.then((data) => {
			res.json(project);
		})
		.catch((error) => res.json({ message: error }));
});

// get all projects for a user
router.get("/users/:userId/projects", (req, res) => {
	const { userId } = req.params;
	userSchema
		.findById(userId, "projects")
		.populate("projects")
		.then((user) => {
			res.json(user.projects);
		})
		.catch((error) => res.json({ message: error }));
});

// get a project for a user
router.get("/users/:userId/projects/:projectId", (req, res) => {
	const { userId, projectId } = req.params;
	userSchema
		.findById(userId, "projects")
		.populate({
			path: "projects",
			match: { _id: projectId },
		})
		.then((user) => {
			const project = user.projects[0];
			if (!project) {
				return res.json({ message: "Project not found" });
			}
			res.json(project);
		})
		.catch((error) => res.json({ message: error }));
});

// delete a project for a user
router.delete("/users/:userId/projects/:projectId", (req, res) => {
	const { userId, projectId } = req.params;
	userSchema
		.findByIdAndUpdate(
			userId,
			{ $pull: { projects: projectId } },
			{ new: true }
		)
		.then((user) => {
			const project = user.projects.find((p) => p._id.toString() === projectId);
			if (!project) {
				return res.json({ message: "Project not found" });
			}
			res.json(project);
		})
		.catch((error) => res.json({ message: error }));
});

// update a project for a user
router.put("/users/:userId/projects/:projectId", (req, res) => {
	const { userId, projectId } = req.params;
	const { name, description } = req.body;
	userSchema
		.findOneAndUpdate(
			{ _id: userId, "projects._id": projectId },
			{
				$set: {
					"projects.$.name": name,
					"projects.$.description": description,
				},
			},
			{ new: true }
		)
		.then((user) => {
			const project = user.projects.find((p) => p._id.toString() === projectId);
			if (!project) {
				return res.json({ message: "Project not found" });
			}
			res.json(project);
		})
		.catch((error) => res.json({ message: error }));
});

module.exports = router;
