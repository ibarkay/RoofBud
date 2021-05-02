const jwt = require("jsonwebtoken");
const User = require("../modules/User");

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, "ibarkay");
		const user = await User.findOne({
			userName: decoded.userName,
			"tokens.token": token,
		});

		if (!user) {
			throw new Error("no user");
		}
		req.token = token;
		req.user = user;
		next();
	} catch (e) {
		console.log(e);
		res.status(401).send({ error: "no soup for you." });
	}
};

module.exports = auth;
