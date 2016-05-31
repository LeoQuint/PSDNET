var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var tl_event = mongoose.Schema({

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
		memberStatus: String,
		timeline: [tl_event]
	}
});

//This create the default timeline.
profileSchema.methods.CreateTimeline = function(){
	var currentDate = Date.now();
	//Creates the first event on the timeline. A welcome message.
	var welcomeEvent = {};
	welcomeEvent.type = 'welcome';
	welcomeEvent.heading = 'Welcome to Psdnet!';
	welcomeEvent.content = 'Congratulation in joining Ontario fastest growing mentorship website!';
	welcomeEvent.html = '';
	welcomeEvent.date = currentDate;
	welcomeEvent.createdOn = currentDate;
	welcomeEvent.sideDisplayed = 'left';
	welcomeEvent.icon = 'glyphicon glyphicon-star';
	welcomeEvent.iconStyle = 'info';
	welcomeEvent.panelStyle = 'info';

	var firstTempEvent = {};
	firstTempEvent.type = 'tutorial';
	firstTempEvent.heading = 'Get Started!';
	firstTempEvent.content = 'To help you navigate the site, follow this tutorial.';
	firstTempEvent.html = '';
	firstTempEvent.date = addDays(currentDate, 3);
	firstTempEvent.createdOn = currentDate;
	firstTempEvent.sideDisplayed = 'right';
	firstTempEvent.icon = 'glyphicon glyphicon-apple';
	firstTempEvent.iconStyle = 'info';
	firstTempEvent.panelStyle = 'info';


	var secondTempEvent = {};
	secondTempEvent.type = 'training';
	secondTempEvent.heading = 'First module';
	secondTempEvent.content = 'Complete your first training module.';
	secondTempEvent.html = '';
	secondTempEvent.date = addDays(currentDate, 7);
	secondTempEvent.createdOn = currentDate;
	secondTempEvent.sideDisplayed = 'left';
	secondTempEvent.icon = 'glyphicon glyphicon-pencil';
	secondTempEvent.iconStyle = 'info';
	secondTempEvent.panelStyle = 'info';

	var thirdTempEvent = {};
	thirdTempEvent.type = 'training';
	thirdTempEvent.heading = 'Second module';
	thirdTempEvent.content = 'Complete your second training module.';
	thirdTempEvent.html = '';
	thirdTempEvent.date = addDays(currentDate, 14);
	thirdTempEvent.createdOn = currentDate;
	thirdTempEvent.sideDisplayed = 'right';
	thirdTempEvent.icon = 'glyphicon glyphicon-pencil';
	thirdTempEvent.iconStyle = 'info';
	thirdTempEvent.panelStyle = 'info';

	this.member.timeline.push(welcomeEvent);
	this.member.timeline.push(firstTempEvent);
	this.member.timeline.push(secondTempEvent);
	this.member.timeline.push(thirdTempEvent);

	return true;
}



profileSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

profileSchema.methods.validatePassword = function(password){
	return bcrypt.compareSync(password, this.member.password);
}

module.exports = mongoose.model('userProfile', profileSchema);

function addDays(date, days){
	return new Date(date + days*86400000);
};