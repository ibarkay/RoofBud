const express = require("express");
const app = express();
require("../server/modules/mongoose");
const cors = require("cors");
app.use(cors());
app.use(express.json());
// ----------import modules----------------
const User = require("./modules/User");
// ----------------------------------------

// ?test
app.get("/api/", (req, res) => {
	res.send("fuck yeah");
});
// ?get users
app.get("/api/users", async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(500).send(e.message);
	}
});
// ?get user
app.get("/api/users/:username", async (req, res) => {
	try {
		console.log(req.params.username);
		const user = await User.findOne({ userName: req.params.username });
		res.send(user);
	} catch (e) {
		res.status(500).send(e.message);
	}
});

// ?match dates
app.post("/api/users/date", async (req, res) => {
	try {
		const matches = await User.find({
			toDate: {
				$lte: Date.parse(new Date(req.body.toDate)),
				$gte: Date.parse(new Date(req.body.fromDate)),
			},
		});
		res.send(matches);
	} catch (e) {
		res.status(500).send(e.message);
	}
});

// ?crate user
app.post("/api/users", async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.send("user added");
	} catch (e) {
		res.status(500).send(e.message);
	}
});

// --------listener--------------
app.listen(1337, () => {
	console.log("running on 1337");
});
