const nodemailer = require("nodemailer");
const { GMAIL, GMAILPASS } = require("../config/KEY");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: `${GMAIL}`,
		pass: `${GMAILPASS}`,
	},
});

module.exports = transporter;
