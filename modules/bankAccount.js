const Schema = require("bson");
const mongoose = require("mongoose");
const validator = require("validator");
const BankAccount = mongoose.model("BankAccount", {
	// connect the user to bank account by his id.
	email: {
		type: String,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("illegal Email.");
			}
		},
	},
	cash: {
		type: Number,
		default: 0,
		minlength: 1,
	},
	credit: {
		type: Number,
		default: 0,
	},
});

module.exports = BankAccount;
