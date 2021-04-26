const express = require("express");
const app = express();
const cors = require("cors");
require("./modules/mongoose");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");

// ---------functions---import-----------
const {
	createUser,
	deposits,
	updateCredit,
	withdraw,
	transferMoney,
} = require("./utilitis/utils");

// ---------muddles------import-----------
const BankAccount = require("./modules/bankAccount");
const TransActions = require("./modules/Transactions");
const Client = require("./modules/client");
const { ReplSet } = require("mongodb");

// -----------middleware------------------------
// app.use((req, res, next) => {
// 	if (req.method) {
// 		res.status(503).send("maintance");
// 	} else {
// 		next();
// 	}
// });

// ----------------------------------------
app.use(cors());
const port = process.env.PORT || 3007;
app.use(express.json());
// ----------------------------------------

// ----------Routes-------------------------
// ?test login
app.post("/bankReact/users/login", async (req, res) => {
	try {
		const user = await Client.findByCreds(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send();
	}
});
// ?logout
app.post("/bankReact/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});
// ?logout and delete all tokens
app.post("/bankReact/users/logoutAll", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});
// ?Get all users
app.get("/bankReact/users", auth, (req, res) => {
	Client.find({})
		.then((clients) => {
			res.status(200).send(clients);
		})
		.catch((e) => {
			res.status(400).send(e.message);
		});
});
app.get("/bankReact/users/me", auth, (req, res) => {
	res.send(req.user);
});
// ?Get all accounts
app.get("/bankReact/accounts", auth, (req, res) => {
	BankAccount.find({})
		.then((accounts) => {
			res.status(200).send(accounts);
		})
		.catch((e) => {
			res.status(400).send(e.message);
		});
});

// ?Get info Single User
app.post("/bankReact/users/getclient", auth, (req, res) => {
	Client.findOne(req.body)
		.then((client) => {
			res.status(200).send(client);
		})
		.catch((e) => {
			res.status(400).send(e.message);
		});
});
// ?Get info Single account
app.post("/bankReact/users/getaccount", auth, (req, res) => {
	BankAccount.findOne(req.body)
		.then((accout) => {
			res.status(200).send(accout);
		})
		.catch((e) => {
			res.status(400).send(e.message);
		});
});
// ?Get info transactions of email
app.post("/bankReact/users/transacrions/email", auth, (req, res) => {
	TransActions.find(req.body)
		.then((accouts) => {
			if (accouts.length > 0) {
				res.status(200).send(accouts);
			} else {
				throw new Error("nothing found");
			}
		})
		.catch((e) => {
			res.status(400).send(e.message);
		});
});

// ?Add User
app.post("/bankReact/users", async (req, res) => {
	try {
		const user = await createUser(req.body);
		const token = await user.generateAuthToken();
		res.status(200).send({ user, token });
	} catch (e) {
		res.status(404).send(e.message);
	}
});
// ?Deposit
app.post("/bankReact/users/deposit", auth, async (req, res) => {
	try {
		const reposed = await deposits(req.body);
		await res.status(200).send(reposed);
	} catch (e) {
		res.status(400).send(e.message);
	}
});
// ?EditCredit
app.post("/bankReact/users/credit-update", auth, async (req, res) => {
	try {
		if (!req.user) {
			throw new Error();
		}
		const respond = await updateCredit(req.body);
		res.status(200).send(respond);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// ?Withdraw
app.post("/bankReact/users/withdraw", auth, async (req, res) => {
	try {
		const resp = await withdraw(req.body);
		res.status(200).send(resp);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// ?Transfer
app.post("/bankReact/users/transfer", auth, async (req, res) => {
	try {
		const resp = await transferMoney(req.body);
		res.status(200).send(resp);
	} catch (e) {
		res.send(400).send(e.message);
	}
});

// ?get all transactions logs
app.get("/bankReact/users/transacrions/", auth, async (req, res) => {
	try {
		const resp = await TransActions.find({});
		res.status(200).send(resp);
	} catch (e) {
		res.status(400).send(e.message);
	}
});
// ?get all transactions by email
app.post("/bankReact/users/transacrions/", auth, async (req, res) => {
	try {
		const resp = await TransActions.find(req.body);
		res.status(200).send(resp);
	} catch (e) {
		res.status(400).send(e.message);
	}
});
//--------listener----------------------
app.listen(port, () => {
	console.log(
		"   ▐▀▄      ▄▀▌   ▄▄▄▄▄▄▄             \n   ▌▒▒▀▄▄▄▄▀▒▒▐▄▀▀▒██▒██▒▀▀▄         \n  ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄        \n ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▄▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄     \n▀█▒▒█▌▒▒█▒▒▐█▒▒▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌    \n▀▌▒▒▒▒▒▀▒▀▒▒▒▒▒▀▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐  ▄▄\n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌▄█▒█\n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▒█▀ \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▀  \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌    \n▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐     \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌     \n ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐      \n ▐▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▌      \n   ▀▄▄▀▀▀▀▄▄▀▀▀▀▀▀▄▄▀▀▀▀▀▀▄▄▀       \n \n"
	);
	console.log("S3cu7e B4nk 0n http://localhost:3007");
});
