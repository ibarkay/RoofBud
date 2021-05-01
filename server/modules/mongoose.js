const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/roof_bud", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
