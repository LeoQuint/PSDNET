var mongoose = require('mongoose');

var cm_Messages = mongoose.Schema({
	{
		main: String,
		altMain: String,

		daily: String[],
		announcements: String[],

		info: String[],
		learning: String[],

		log: String
	}
});

module.exports = mongoose.model('cm_Messages', cm_Messages);