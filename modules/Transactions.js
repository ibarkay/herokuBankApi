const Schema = require("mongoose");
const mongoose = require("mongoose");
const TransAction = mongoose.model("TransAction", {
	fromEmail: {
		required: true,
		type: String,
	},
	date: {
		type: String,
	},
	toEmail: {
		type: String,
	},
	amount: {
		type: Number,
		minLength: 1,
	},
	msg: {
		type: String,
	},
});

module.exports = TransAction;
