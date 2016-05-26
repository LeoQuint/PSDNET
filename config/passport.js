var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


//var User = require('../app/models/user');
var userProfile = require('../app/models/userProfile');
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

						newUser.save(function(err){
							if(err)
							{
								throw err;
							}
							else
							{
								return done(null, newUser);
							}
						})

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