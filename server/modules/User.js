const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	userName: {
		type: String,
		unique: true,
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
			},
		},
	],
	// tokens: [
	// 	{
	// 		token: {
	// 			type: String,
	// 			required: true,
	// 		},
	// 	},
	// ],
});

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

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
