const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	// code goes here.
	name: {
		type: String,
		unique: true,
		required: true,
		minlength: 4,
		maxlength: 10,
		// !
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		// maxlength: 10,
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
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ email: user.email }, "ibarkay");
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};
userSchema.methods.toJSON = function () {
	console.log("here");
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

userSchema.statics.findByCreds = async (email, password) => {
	const client = await Client.findOne({ email: email });
	if (!client) {
		throw new Error("unable to login");
	}
	const isMatch = await bcrypt.compare(password, client.password);
	if (!isMatch) {
		throw new Error("unable to login");
	}
	return client;
};

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const Client = mongoose.model("Client", userSchema);

module.exports = Client;
