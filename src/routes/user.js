const express = require("express");
const userSchema = require("../models/User");

const router = express.Router();

// create user
router.post("/users", async (req, res) => {
	const username = req.body.username;
	const existingUser = await userSchema.findOne({ username: username });

	if (existingUser) {
		return res
			.status(409)
			.json({ message: "El nombre de usuario ya está en uso." });
	}

	const user = userSchema(req.body);
	user
		.save()
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

// get all users
router.get("/users", (req, res) => {
	userSchema
		.find()
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

// get a user
router.get("/users/:username", (req, res) => {
	const { username } = req.params;
	userSchema
		.findOne({ username })
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

// delete a user
router.delete("/users/:id", (req, res) => {
	const { id } = req.params;
	userSchema
		.remove({ _id: id })
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

// update a user
router.put("/users/:id", (req, res) => {
	const { id } = req.params;
	const { name, age, email } = req.body;
	userSchema
		.updateOne({ _id: id }, { $set: { name, age, email } })
		.then((data) => res.json(data))
		.catch((error) => res.json({ message: error }));
});

module.exports = router;
