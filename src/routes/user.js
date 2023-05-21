const express = require("express");
const userSchema = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	const user = await userSchema.findOne({ username: username });

	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	if (password !== user.password) {
		return res.status(401).json({ message: "Invalid credentials" });
	}
	return res.status(201).json({ message: "Valid credentials" });
});

// create user
router.post("/users", async (req, res) => {
	const username = req.body.username;
	const existingUser = await userSchema.findOne({ username: username });

	if (existingUser) {
		return res
			.status(409)
			.json({ message: "El nombre de usuario ya está en uso." });
	}

	// Hash the user's password before saving it to the database

	const user = userSchema({
		name: req.body.name,
		username: username,
		password: req.body.password,
	});

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
		.deleteOne({ _id: id })
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
