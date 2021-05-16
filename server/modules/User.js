const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { SECRET } = require("../config/KEY");
// ----------Schema------------------
const userSchema = new mongoose.Schema({
	userName: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("illegal Email.");
			}
		},
		minlength: 5,
	},
	name: {
		type: String,
	},
	fromDate: {
		type: Date,
	},
	toDate: {
		type: Date,
	},
	age: {
		type: Number,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
	},
	moreText: {
		type: String,
		maxlength: 120,
	},
	msgs: [
		{
			msg: {
				type: String,
				meta: String,
			},
			from: {
				type: String,
			},
			time: {
				type: Date,
				default: new Date(),
			},
		},
	],
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
	avatar: {
		type: Buffer,
	},
	gender: {
		type: Boolean,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});
// -------methods------------
userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	if (user.isModified("fromDate")) {
		user.fromDate = Date.parse(user.fromDate);
	}
	if (user.isModified("toDate")) {
		user.toDate = Date.parse(new Date(user.toDate));
	}
	next();
});

userSchema.statics.findByCreds = async (userName, password) => {
	const user = await User.findOne({ userName: userName });
	if (!user) {
		throw new Error("unable to login");
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("unable to login");
	}
	return user;
};

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ userName: user.userName }, `${SECRET}`);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	delete userObject.avatar;

	return userObject;
};
// ----------------------------------------------
const User = mongoose.model("User", userSchema);

module.exports = User;
