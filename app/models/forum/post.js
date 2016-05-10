var mongoose = require('mongoose');

var Post = mongoose.Schema({
	post: {
		postID: String,
		userType: String,
		username: String,
		date: String,
		subject: String,
		message: String,
		upVotes: Number,
		downVotes: Number,
		replies: String[]
	}
});


module.exports = mongoose.model('Post', Post);