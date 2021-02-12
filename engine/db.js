const mongoose = require('mongoose');
mongoose
	.connect(
		"mongodb://localhost:27017/jest_testing",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.info('Connected to Database');
	})
	.catch((err) => {
		console.log(err)
		console.error('Could not establish connection with Database');
	});

mongoose.set('useFindAndModify', false);

module.exports = mongoose;
