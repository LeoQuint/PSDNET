var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


//var User = require('../app/models/user');
var userProfile = require('../app/models/userProfile');
//var tl_event = require('../app/models/Timeline/tl_event');
var configAuth = require('./auth');

module.exports = function(passport){

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		userProfile.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function(req, email, password, done){
			process.nextTick(function(){
					
				userProfile.findOne({'member.email': email}, function(err, user){
					if(err)
					{
						return done(err);
					}

					if(user)
					{
						return done(null, false, 
							req.flash('signupMessage', 'This email is already registered'));
					}
					else
					{
						
						var newUser = new userProfile();
						newUser.member.email = email;
						newUser.member.password = newUser.generateHash(password);
						newUser.member.since = Date.now();
						newUser.member.firstName = req.body.firstName;
						newUser.member.lastName = req.body.lastName;
						newUser.member.memberStatus = req.body.userType;
						if(req.body.college != '')
						{
							newUser.member.school = req.body.college;
						}
						else
						{
							newUser.member.school = req.body.university;
						}
						
						newUser.member.program = req.body.program;
						newUser.member.academicYear = req.body.currentYear;
						newUser.member.reasonForMentorship = '';
						console.log('Creating user');


						if(newUser.CreateTimeline()){

						newUser.save(function(err){
								if(err)	{
									throw err;
								}
								else{
									return done(null, newUser);
								}
							})
						}

					}
				})

			});
	}));
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			userProfile.findOne({'member.email': email}, function(err, user){
				if(err)
				{
					return done(err);
				}
				if(!user)
				{
					return done( null, false, req.flash('loginMessage', 'No User found'));
				}
				if(!user.validatePassword(password))
				{
					return done(null, false, req.flash('loginMessage', 'invalid Password'));
				}
				return done(null, user);
			})
		})
	}
	));

	passport.use(new FacebookStrategy(
		{
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
	    callbackURL: configAuth.facebookAuth.callbackURL,
	    profileFields: ['emails' , 'name']
	 	},
	  	function(accessToken, refreshToken, profile, done) 
	  	{
			process.nextTick(function()
			{
				User.findOne({'facebook.id' : profile.id}, function(err, user)
				{
					if(err)
					{
						return done(err);
					}
					if(user)
					{
						return done(null, user);
					}
					else
					{
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.token = accessToken;
						newUser.facebook.name = profile.name.givenName + " " + profile.name.familyName;
						newUser.facebook.email = profile.emails[0].value;


						newUser.save(function(err)
						{
							if(err)
							{
								throw err;
							}
							return done(null, newUser);
						});
					}
				});
			});
    }));
	

};


/*//Function that creates all the default timeline events for a user.
function CreateTimeline(username)
{	


	var currentDate = Date.now();
	//Creates the first event on the timeline. A welcome message.
	var welcomeEvent = new tl_event();


	
	welcomeEvent.user = username;
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

	welcomeEvent.save(function(err){
		if(err)
		{
			console.log('Error in passport.js / CreateTimeline / WecomeEvent!');
			throw err;
		}
	});

	var firstTempEvent = new tl_event();

	firstTempEvent.user = username;
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

	firstTempEvent.save(function(err){
		if(err)
		{
			console.log('Error in passport.js / CreateTimeline / firstTempEvent!');
			throw err;
		}
	});

	var secondTempEvent = new tl_event();

	secondTempEvent.user = username;
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

	secondTempEvent.save(function(err){
		if(err)
		{
			console.log('Error in passport.js / CreateTimeline / secondTempEvent!');
			throw err;
		}
	});

	var thirdTempEvent = new tl_event();

	thirdTempEvent.user = username;
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

	thirdTempEvent.save(function(err){
		if(err)
		{
			console.log('Error in passport.js / CreateTimeline / thirdTempEvent!');
			throw err;
		}
	});

};

function addDays(date, days){
	return new Date(date + days*86400000);
};*/