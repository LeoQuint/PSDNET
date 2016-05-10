var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var profileSchema = mongoose.Schema({
	member: {
		email: String,//Used to search the DB
		password: String,
		since: Date,
		firstName: String,
		lastName: String,

		school: String,
		program: String,
		academicYear: Number,

		reasonForMentorship: String,

		//If the user is a mentee, mentor, content creator or Admin.
		memberStatus: String
	}
});


profileSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

profileSchema.methods.validatePassword = function(password){
	return bcrypt.compareSync(password, this.member.password);
}

module.exports = mongoose.model('userProfile', profileSchema);