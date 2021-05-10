const express = require("express");
const app = express();
require("./modules/mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
app.use(express.static("public"));
// -----file upload settings-----
const upload = multer({
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|JPG|png|PNG|gif|GIF|jpeg|JPEG)$/)) {
			return cb(new Error("please jpg"));
		}
		cb(undefined, true);
	},
});
// ------------------------------

app.use(cors());
app.use(express.json());
// ----------import modules----------------
const User = require("./modules/User");
// ----------------------------------------
// ?upload picture
app.post(
	"/api/users/me/avatar",
	auth, //*first middleware is AUTH
	upload.single("avatar"), //*only then upload middleware
	async (req, res) => {
		const buffer = await sharp(req.file.buffer) //sharp-resize the img
			.resize({ width: 200, height: 200 })
			.png()
			.toBuffer();

		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	//*error handling
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);
// ?delete user picture
app.delete("/api/users/me/avatar", auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send("image was deleted");
});
// ?get user picture
app.get("/api/users/:username/avatar", async (req, res) => {
	try {
		const user = await User.findOne({ userName: req.params.username });
		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set("Content-Type", "image/png");
		res.send(user.avatar);
	} catch (e) {
		res.status(404).send();
	}
});

//
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
// ?get user2
app.get("/api/m3", auth, async (req, res) => {
	try {
		const user = await User.findOne({ userName: req.user.userName });
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
			},
			fromDate: {
				$lte: Date.parse(new Date(req.body.toDate)),
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
		res.status(500).send("ho");
	}
});

// --------listener--------------
app.listen(process.env.PORT || 1337, () => {
	console.log("running on 1337");
});
