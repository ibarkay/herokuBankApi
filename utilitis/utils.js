const Client = require("../modules/client");
const BankAccount = require("../modules/bankAccount");
const Transaction = require("../modules/Transactions");

const createUser = async (ari) => {
	try {
		const client = new Client(ari);
		await client.save();
		creatBankAccount({ email: ari.email });
		const transactionLog = new Transaction({
			fromEmail: ari.email,
			msg: `user ${ari.name} was created`,
			date: new Date().toLocaleString(),
		});
		transactionLog
			.save()
			.then(() => {
				console.log("loged");
			})
			.catch((e) => {
				console.log(e.message);
			});

		return "client was created";
	} catch (e) {
		throw new Error(e.message);
	}
};
const creatBankAccount = async (j) => {
	//need only email
	try {
		const account = await new BankAccount(j);
		account.save();
		const transactionLog = new Transaction({
			fromEmail: j.email,
			msg: `Account was created for ${j.email}`,
		});
		transactionLog
			.save()
			.then(() => {
				console.log("logged");
			})
			.catch((e) => {
				console.log(e.message);
			});
		return account;
	} catch (e) {
		throw new Error(e.message);
	}
};
const deposits = async (ari) => {
	try {
		const acc = await BankAccount.findOneAndUpdate(
			{ email: ari.email },
			{ $inc: { cash: ari.amount } }
		);
		if (!acc) {
			throw new Error("unable to find client");
		}
		const transactionLog = new Transaction({
			fromEmail: ari.email,
			msg: `${ari.email} was deposited with ${ari.amount}`,
			date: new Date().toLocaleDateString(),
		});
		transactionLog
			.save()
			.then(() => {
				console.log("loged");
			})
			.catch((e) => {
				console.log(e.message);
			});

		return "deposited.";
	} catch (e) {
		throw new Error(e.message);
	}
};

const updateCredit = async (ari) => {
	try {
		const acc = await BankAccount.findOneAndUpdate(
			{ email: ari.email },
			{ $inc: { credit: ari.amount } }
		);
		if (!acc) {
			throw new Error("unable to find user");
		}
		const transactionLog = new Transaction({
			fromEmail: ari.email,
			msg: `${ari.email} Credit was add with ${ari.amount}`,
			date: new Date().toLocaleDateString(),
		});
		transactionLog
			.save()
			.then(() => {
				console.log("logged");
			})
			.catch((e) => {
				console.log(e.message);
			});
		return "Credit updated";
	} catch (e) {
		throw new Error(e.message);
	}
};

const withdraw = async (ari) => {
	try {
		const amountToWithdraw = ari.amount;
		const client = await BankAccount.findOne({ email: ari.email });
		if (client.cash + client.credit >= amountToWithdraw) {
			console.log("was here");
			BankAccount.findOneAndUpdate(
				{ email: ari.email },
				{ $inc: { cash: -ari.amount } }
			)
				.then(() => {
					console.log("ok");
				})
				.catch((e) => {
					console.log(e.message);
				});
			const transactionLog = new Transaction({
				fromEmail: ari.email,
				msg: `${ari.email} was withdrawn ${ari.amount}`,
				date: new Date().toLocaleDateString(),
			});
			transactionLog
				.save()
				.then(() => {
					console.log("logged");
				})
				.catch((e) => {
					console.log(e.message);
				});
			return "withdrawn";
		} else {
			throw new Error("not enough credit");
		}
	} catch (e) {
		throw new Error(e.message);
	}
};

const transferMoney = async (ari) => {
	try {
		const fromClient = await BankAccount.findOne({ email: ari.fromEmail });
		const toClient = await BankAccount.findOne({ email: ari.toEmail });
		const amount = await ari.amount;

		if (fromClient.cash + fromClient.credit >= amount) {
			BankAccount.findOneAndUpdate(
				{ email: ari.fromEmail },
				{ $inc: { cash: -amount } }
			)
				.then(() => {
					console.log("withdraw from user 1");
				})
				.catch((e) => {
					console.log(e.message);
				});
			BankAccount.findOneAndUpdate(
				{ email: ari.toEmail },
				{ $inc: { cash: amount } }
			)
				.then(() => {
					console.log("deposit mony to user 2");
				})
				.catch((e) => {
					console.log(e.message);
				});
			const transactionLog = new Transaction({
				fromEmail: ari.fromEmail,
				toEmail: ari.toEmail,
				msg: `${ari.fromEmail} transferred ${amount} to ${ari.toEmail}`,
				date: new Date().toLocaleString(),
			});
			transactionLog
				.save()
				.then(() => {
					console.log("logged");
				})
				.catch((e) => {
					console.log(e.message);
				});
			return "done.";
		} else {
			throw new Error("user1 hasn't got money!");
		}
	} catch (e) {
		throw new Error(e.message);
	}
};

module.exports = {
	createUser,
	deposits,
	updateCredit,
	withdraw,
	transferMoney,
};
