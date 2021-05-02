const express = require("express");
const app = express();
require("../server/modules/mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");

app.use(cors());
app.use(express.json());
// ----------import modules----------------
const User = require("./modules/User");
// ----------------------------------------

// ?get users
app.get("/api/users", auth, async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(500).send(e.message);
	}
});
// ?get user
app.get("/api/users/:username", auth, async (req, res) => {
	try {
		const user = await User.findOne({ userName: req.params.username });
		res.send(user);
	} catch (e) {
		res.status(500).send(e.message);
	}
});

// ?match dates
app.post("/api/users/date", auth, async (req, res) => {
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
		const token = await user.generateAuthToken();
		await user.save();
		res.send({ user, token });
	} catch (e) {
		res.status(500).send(e.message);
	}
});
// ?delete a user
app.delete("/api/users/:username", auth, async (req, res) => {
	try {
		User.deleteOne({ userName: req.params.username }, function (err) {
			if (err) console.log(err);
			res.send("deleted.");
		});
	} catch (e) {
		res.status(500).send(e.message);
	}
});
// ?edit a user
app.patch("/api/users/:username", auth, async (req, res) => {
	try {
		const user = await User.findOne({ userName: req.params.username });
		for (let i of Object.keys(req.body)) {
			user[i] = req.body[i];
		}
		await user.save();
		res.send("user has been updated.");
	} catch (e) {
		res.status(500).send(e.message);
	}
});
//? login
app.post("/api/login", async (req, res) => {
	try {
		const user = await User.findByCreds(req.body.userName, req.body.password);
		const token = await user.generateAuthToken();
		await user.save();
		res.send({ user, token });
	} catch (e) {
		res.status(500).send(e.message);
	}
});
// ?logout
app.post("/api/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.send("logged-off .");
	} catch (e) {
		res.status(500).send();
	}
});

// --------listener--------------
app.listen(1337, () => {
	console.log("running on 1337");
});
