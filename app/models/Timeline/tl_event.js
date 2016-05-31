var mongoose = require('mongoose');

var tl_event = mongoose.Schema({

	user: String,				//The user its attached to.
	type: String,			//The type of event. Will add custom icons of various types.
	heading: String,		//Title
	content: String,		//description of the event.
	html: String,			//If we want formated markup.
	date: Date, 			//Date to display at in the timeline.
	createdOn: Date, 		//Date the event was created.	 
	sideDisplayed: String,	//What side of the timeline this event should be displayed.


	icon: String,
	iconStyle : String,
	panelStyle: String
});

module.exports = mongoose.model('tl_event', tl_event);