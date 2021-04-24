const express = require("express");
const router = new express.Router();
// const app = express();
const cors = require("cors");
require("./modules/mongoose");

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

// -----------globals------------------------
router.use(cors());
const port = process.env.PORT || 3007;
router.use(express.json());
// ----------------------------------------

// ----------Routes-------------------------
// ?Get all users
router.get("/bankReact/users", (req, res) => {
	Client.find({})
		.then((clients) => {
			res.status(200).send(clients);
		})
		.catch((e) => {
			res.status(400).send(e.message);
		});
});
// ?Get all accounts
router.get("/bankReact/accounts", (req, res) => {
	BankAccount.find({})
		.then((accounts) => {
			res.status(200).send(accounts);
		})
		.catch((e) => {
			res.status(400).send(e.message);
		});
});

// ?Get info Single User
router.post("/bankReact/users/getclient", (req, res) => {
	Client.findOne(req.body)
		.then((client) => {
			res.status(200).send(client);
		})
		.catch((e) => {
			res.status(400).send(e.message);
		});
});
// ?Get info Single account
router.post("/bankReact/users/getaccount", (req, res) => {
	BankAccount.findOne(req.body)
		.then((accout) => {
			res.status(200).send(accout);
		})
		.catch((e) => {
			res.status(400).send(e.message);
		});
});
// ?Get info transactions of email
router.post("/bankReact/users/transacrions/email", (req, res) => {
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
router.post("/bankReact/users", async (req, res) => {
	try {
		const user = await createUser(req.body);
		res.status(200).send("user was created");
	} catch (e) {
		res.status(404).send(e.message);
	}
});
// ?Deposit
router.post("/bankReact/users/deposit", async (req, res) => {
	try {
		const reposed = await deposits(req.body);
		await res.status(200).send(reposed);
	} catch (e) {
		res.status(400).send(e.message);
	}
});
// ?EditCredit
router.post("/bankReact/users/credit-update", async (req, res) => {
	try {
		const respond = await updateCredit(req.body);
		res.status(200).send(respond);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// ?Withdraw
router.post("/bankReact/users/withdraw", async (req, res) => {
	try {
		const resp = await withdraw(req.body);
		res.status(200).send(resp);
	} catch (e) {
		res.status(400).send(e.message);
	}
});

// ?Transfer
router.post("/bankReact/users/transfer", async (req, res) => {
	try {
		const resp = await transferMoney(req.body);
		res.status(200).send(resp);
	} catch (e) {
		res.send(400).send(e.message);
	}
});

// ?get all transactions logs
router.get("/bankReact/users/transacrions/", async (req, res) => {
	try {
		const resp = await TransActions.find({});
		res.status(200).send(resp);
	} catch (e) {
		res.status(400).send(e.message);
	}
});
// ?get all transactions by email
router.post("/bankReact/users/transacrions/", async (req, res) => {
	try {
		const resp = await TransActions.find(req.body);
		res.status(200).send(resp);
	} catch (e) {
		res.status(400).send(e.message);
	}
});
//--------listener----------------------
router.listen(port, () => {
	console.log(
		"   ▐▀▄      ▄▀▌   ▄▄▄▄▄▄▄             \n   ▌▒▒▀▄▄▄▄▀▒▒▐▄▀▀▒██▒██▒▀▀▄         \n  ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄        \n ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▄▒▒▒▒▒▒▒▒▒▒▒▒▒▀▄     \n▀█▒▒█▌▒▒█▒▒▐█▒▒▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌    \n▀▌▒▒▒▒▒▀▒▀▒▒▒▒▒▀▀▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐  ▄▄\n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌▄█▒█\n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▒█▀ \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▀  \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌    \n▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐     \n▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▌     \n ▌▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐      \n ▐▄▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▄▌      \n   ▀▄▄▀▀▀▀▄▄▀▀▀▀▀▀▄▄▀▀▀▀▀▀▄▄▀       \n \n"
	);
	console.log("S3cu7e B4nk 0n http://localhost:3007");
});
