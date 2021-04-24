const mongoose = require("mongoose");

// mongodb://localhost:27017/bankReact

mongoose.connect(
	"mongodb+srv://admin:7654321bbb@cluster0.dkqg3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	}
);
