var mongoose = require('mongoose');

var tl_event = mongoose.Schema({
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

module.exports = mongoose.model('tl_event', tl_event);