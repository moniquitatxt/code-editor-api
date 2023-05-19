const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/user");
const projectRoute = require("./routes/project");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

//middleware
app.use(express.json());
app.use(cors());
app.use("/api", userRoute);
app.use("/api", projectRoute);

//mongodb connection
mongoose
	.connect(process.env.MONGOURL)
	.then(() => console.log("Conectado a la base de datos"))
	.catch((error) => console.log(error));

app.listen(9000, () => console.log("listening on port", port));

module.exports = app;
