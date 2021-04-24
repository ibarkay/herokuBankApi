const mongoose = require("mongoose");
const validator = require("validator");
const Client = mongoose.model("Client", {
	// code goes here.
	name: {
		type: String,
		required: true,
		minlength: 4,
		maxlength: 10,
		// !
	},

	email: {
		type: String,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("illegal Email.");
			}
		},
		minlength: 5,
	},
});

module.exports = Client;
