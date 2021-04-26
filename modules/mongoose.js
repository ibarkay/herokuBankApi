const mongoose = require("mongoose");

// mongodb://localhost:27017/bankReact

mongoose.connect("mongodb://localhost:27017/bankReact", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});
