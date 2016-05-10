var mongoose = require('mongoose');

var cSearchable = mongoose.Schema({
	Search: {

		dbId: String,

		topics: String[],
		userType: String,
		username: String,
		date: String,
		type: String,
		rating: Number
	}
});

cSearchable.methods.Remove = function(){

	this.search.type.find({ "_id" : ObjectId(this.dbId)).remove(function (err, result) {
			if(err)
			{
				return err;
			}
			console.log(result);
			return result;
		});

}

module.exports = mongoose.model('cSearchable', cSearchable);