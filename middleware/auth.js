const jwt = require("jsonwebtoken");
const Client = require("../modules/client");

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, "ibarkay");
		const user = await Client.findOne({
			email: decoded.email,
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
		res.status(401).send({ error: "nop!" });
	}
};

module.exports = auth;
