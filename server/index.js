// -------------external lib----------------------
const express = require("express");
const app = express();
require("./modules/mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const nodemailer = require("nodemailer");
// ------------static setup---------------------
app.use(express.static("public"));
// -----file upload settings-----
const upload = multer({
	limits: {
		fileSize: 1000000,
	},

	fileFilter(req, file, cb) {
		if (
			!file.originalname.match(
				/\.(jpg|JPG|png|PNG|gif|GIF|jpeg|JPEG|bmp|BMP|webp|WebP|heif|HEIF)$/
			)
		) {
			return cb(new Error("please jpg"));
		}
		cb(undefined, true);
	},
});

// -------app setup-------------
app.use(cors());
app.use(express.json());
// ----------import modules----------------
const User = require("./modules/User");
const SendEmail = require("./modules/Email");

// ----------END POINTS---------------
// ? send msg
app.post("/api/send/msg", auth, async (req, res) => {
	try {
		const user = await User.findOne({ userName: req.body.to });
		const msg = {};
		msg["msg"] = req.body.msg;
		msg["from"] = req.body.from;
		user.msgs = user.msgs.concat(msg);
		user.save();
		SendEmail.sendMail(
			{
				from: "7oofbud@gmail.com",
				to: user.email,
				subject: "r00fBud -> הודעה חדשה",
				text: ` יש לך הודעה חדשה מ \n ${msg.from} \n https://r00fbud.herokuapp.com/`,
			},
			(error, info) => {
				if (error) {
					console.log(error);
				} else {
					console.log(info.response);
				}
			}
		);
		res.send("ok");
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// ?delete all msgs
app.delete("/api/delete/msgs", auth, async (req, res) => {
	try {
		req.user.msgs = [];
		req.user.save();
		res.send("msgs cleaned");
	} catch (e) {
		res.status(400).send(e.message);
	}
});
// ?delete msg by id
app.delete("/api/delete/msg/:id", auth, async (req, res) => {
	try {
		req.user.msgs = await req.user.msgs.filter((m) => {
			return m._id.toString() !== req.params.id;
		});
		await req.user.save();
		res.send("ok");
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// ?upload picture
app.post(
	"/api/users/me/avatar",
	auth, //*first middleware is AUTH
	upload.single("avatar"), //*only then upload middleware
	async (req, res) => {
		const buffer = await sharp(req.file.buffer) //sharp-resize the img
			.resize({ width: 150, height: 150 })
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
		const users = await User.find({});
		// console.log(req.body);
		const matches = users.filter(
			(user) =>
				user.isActive &&
				user.fromDate - new Date(req.body.fromDate) <= 0 &&
				user.toDate - new Date(req.body.toDate) >= 0 &&
				user.gender === req.body.gender
		);
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
	console.log(
		"   ▐▀▄      ▄▀▌   ▄▄▄▄▄▄▄             \n   ▌▒▒▀▄▄▄▄▀▒▒▐▄▀▀▒██▒██▒▀▀▄         \n  ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄        \n ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▄▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄     \n▀█▒▒█▌▒▒█▒▒▐█▒▒▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌    \n▀▌▒▒▒▒▒▀▒▀▒▒▒▒▒▀▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐  ▄▄\n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌▄█▒█\n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▒█▀ \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▀  \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌    \n▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐     \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌     \n ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐      \n ▐▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▌      \n   ▀▄▄▀▀▀▀▄▄▀▀▀▀▀▀▄▄▀▀▀▀▀▀▄▄▀       \n \n"
	);
});
