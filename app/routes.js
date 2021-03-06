var express = require('express');
var router = express.Router();
//Models
var userProfile = require('../app/models/userProfile');
var contentManagerModel = require('../app/models/contentManagerModel');

var configDB = require('../config/database.js');
var discuss = require('mongodb-discuss')({mongoUrl: 'mongodb://localhost'});

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var request = require('request');//for url requests.
var fs = require('fs');

module.exports = function(app, passport){


	//Default route.
	router.get('/', function(req, res) {
		res.sendFile('./index.html', { root: __dirname } ); 
	});



	//TEMP ROUTE. currently unused.
	//asked for info from the user to get a match of a mentor.
	router.get('/signForMentor', isLoggedIn, function(req, res){
		res.send({user : req.user});
	});

//Forum routes////////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 		Used for posting/requesting/searching the forum's database.			//
//																				//
//////////////////////////////////////////////////////////////////////////////////

	//TEMP ROUTE. Called if we are login in from the forum's page.
	router.get('/forum/login', function(req, res){
		if(typeof req.user != 'undefined'){
			userProfile.findOne({'member.email': req.user.member.email}, function(err, uProfile){

			if(err)
			{
				return err;
			}
			if(!uProfile)
			{
				console.log('no match');
				return req.flash('loginMessage', 'Error matching data');
			}
				res.send({'userProfile' : uProfile});
			});
		}
		else
		{
			console.log('Not logged in.');
			return false;
		}

	});
	//Create a new Post ("Topic") to the forum.
	router.post('/forum/newPost', function(req, res){	
	
		discuss.createTopic(req.body.userEmail,{
		 	'subject': req.body.subject, 
		 	'body': req.body.message,
			'topicId': req.body.userEmail + Date.now(),
			'topicPrefix': 'same',
			'userType': req.body.userType,
			'username': req.body.username,
			'upVotes' : req.body.upVotes,
			'downVotes': req.body.downVotes,
			'replies' : [],
			'date': req.body.date
		}, 
		 	function (err, result) {
				if(err)
				{
					return err;
				}
				
				return result;
		});
	});
	//TEMP ROUTE. Retrieves EVERY posts on the forum's database. Requires a search/filter.
	router.get('/forum/getPosts', function(req,res){
		console.log('requesting posts in routes.js');
		discuss.getRecentTopics('myid', { 
			'type': 'all',
			'skip': 0,
			'limit': 100
		},
		function (err, result) {
			if(err)
			{
				console.log(err);
				return err;
			}

			res.send(result);
		});
		
	});

//Chat routes/////////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 			Used for live chat between mentor and mentee					//
//																				//
//////////////////////////////////////////////////////////////////////////////////

	router.post('/chat/Post', function(req,res){
		console.log('posting a new message on chat');

		return {status: 'empty', message:'null'};
		//implement comunication to post to socket IO.
	});

	router.get('/chat/Update', function(req, res){
		console.log('Updating chat...');
		return res.send({status: 'new', message:'hi this is a new message.'});
		//implement a live reload of the chat display.
	});
	//Dogan's code below.

	/*var name = getQueryVariable("name") || "Anonymous";
    var room = getQueryVariable("room");
    var socket = io();

    console.log(name + " wants to join " + room);

    jQuery(".room-title").text(room);

    socket.on("connect", function () {
        console.log("Connected to socket.io server!");
        socket.emit("joinRoom", {
            name: name,
            room: room
        });
    });

    socket.on("message", function (message) {
        var momentTimestamp = moment.utc(message.timestamp);
        var $messages = jQuery('.messages');
        var $message = jQuery('<li class="list-group-item"></li>');

        console.log('New message:');
        console.log(message.text);

        $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
        $message.append('<p>' + message.text + '</p>');
        $messages.append($message);
    });

    var $form = jQuery("#message-form");

    $form.on("submit", function(event){
        event.preventDefault();

        var $message = $form.find("input[name=message]")

        socket.emit("message",{
            name: name,
            text: $message.val()
        });

        $message.val("");
    });


    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1].replace(/\+/g, " "));
            }
        }
        
        return undefined;
    }*/


//Authentication routes///////////////////////////////////////////////////////////
//																				//
//																				//
//	 Used for login/signups using local/facebook/google and other services		//
//																				//
//////////////////////////////////////////////////////////////////////////////////
	
	//Local
	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/#/profile',
		failureRedirect: '/#/login',
		failureFlash: true
	}));

	router.post('/signup', passport.authenticate('local-signup', {
			successRedirect: '/#/profile',
			failureRedirect: '/#/mSignup',
			failureFlash: true
	}));

	//Facebook
	router.get('/auth/facebook', passport.authenticate('facebook', {scope:['email']}));


	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    	failureRedirect: '/' }), function(req, res){
		res.redirect('/#/profile');
	});

	//Retieve profile
	router.get('/getProfil',  isLoggedIn, function(req, res){
		
		userProfile.findOne({'member.email': req.user.member.email}, function(err, uProfile){
			if(err)
			{
				return err;
			}
			if(!uProfile)
			{
				return req.flash('loginMessage', 'Error matching data');
			}
			
			profile = uProfile;
			
			res.send(profile);
		});

	});

	//Close session.
	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

//Content Manager routes//////////////////////////////////////////////////////////
//																				//
//																				//
//	 	Manages routes to post, update or change the site from admin login.		//
//																				//
//////////////////////////////////////////////////////////////////////////////////
	
	//routes to retrieve messages from the contentManager model saved.
	router.get('/contentManager/retrieveMessages', function(req, res){
		var query = contentManagerModel.find({}).select({"_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/about', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.about": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/chat', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.chat": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/community', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.community": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/contact', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.contact": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/education', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.education": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/evaluation', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.evaluation": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/featured', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.featured": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/forum', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.forum": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/home', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.home": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/login', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.login": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/mentor', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.mentor": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/mentorships', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.mentorships": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/news', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.news": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/3pillars', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.pillars": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/podcasts', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.podcasts": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/profile', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.profile": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/signup', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.signup": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/timeline', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.timeline": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/training', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.training": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	router.get('/contentManager/retrieveMessages/webinars', function(req, res){
		var query = contentManagerModel.find({}).select({"pages.webinars": 1, "_id": 0});
		query.exec(function(err, info){
			if(err){ return next(err); }
			res.send(info);
		});
	});
	
	//Creates a new contentManager model on the database if none exists.
	//Need to also update the data if one is found.
	router.post('/contentManager/UpdateMessages', function(req, res){

		contentManagerModel.count( function(err, count){
			if(err){ return err;}

			var firstCMModel = new contentManagerModel();

			if(count === 1)
			{
				console.log('Updating entry');
				//make our model a json object and delete the _id field so we can update.
				var updatingData = firstCMModel.toObject();
				delete updatingData._id;
				updatingData.pages = req.body;
				contentManagerModel.update({}, updatingData, function(err, numberAffected, rawResponse) {
				   //handle it
				   if(err)
				   {
				   		res.send("ERROR:  " + err.toString());
				   }
				   else
				   {
				   		res.send("successfully updated the doc.");
				   }
				});
				
			}
			else
			{
				res.send("ERROR UPDATING contentManager. Count shows too many entries.");	
			}
		});
	});


	router.post('/contentManager/loadMessagesFromJSON', function(req, res){

		contentManagerModel.count( function(err, count){
		if(err){ return err;}

		var firstCMModel = new contentManagerModel();
		
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_home.json', function (err, json_home) {
			if(err){ throw err; }
			firstCMModel.pages.home = json_home;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_login.json', function (err, msg_login) {
			if(err){ throw err; }
			firstCMModel.pages.login = msg_login;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_pillars.json', function (err, json_pillars) {
			if(err){ throw err; }
			firstCMModel.pages.pillars = json_pillars;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_about.json', function (err, json_about) {
			if(err){ throw err; }
			firstCMModel.pages.about = json_about;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_contact.json', function (err, json_contact) {
			if(err){ throw err; }
			firstCMModel.pages.contact = json_contact;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_community.json', function (err, json_community) {
			if(err){ throw err; }
			firstCMModel.pages.community = json_community;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_forum.json', function (err, json_forum) {
			if(err){ throw err; }
			firstCMModel.pages.forum = json_forum;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_profile.json', function (err, json_profile) {
			if(err){ throw err; }
			firstCMModel.pages.profile = json_profile;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_education.json', function (err, json_education) {
			if(err){ throw err; }
			firstCMModel.pages.education = json_education;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_news.json', function (err, json_news) {
			if(err){ throw err; }
			firstCMModel.pages.news = json_news;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_podcasts.json', function (err, json_podcasts) {
			if(err){ throw err; }
			firstCMModel.pages.podcasts = json_podcasts;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_webinars.json', function (err, json_webinars) {
			if(err){ throw err; }
			firstCMModel.pages.webinars = json_webinars;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_featured.json', function (err, json_featured) {
			if(err){ throw err; }
			firstCMModel.pages.featured = json_featured;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_chat.json', function (err, json_chat) {
			if(err){ throw err; }
			firstCMModel.pages.chat = json_chat;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_evaluation.json', function (err, json_evaluation) {
			if(err){ throw err; }
			firstCMModel.pages.evaluation = json_evaluation;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_mentor.json', function (err, json_mentor) {
			if(err){ throw err; }
			firstCMModel.pages.mentor = json_mentor;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_mentorships.json', function (err, json_mentorships) {
			if(err){ throw err; }
			firstCMModel.pages.mentorships = json_mentorships;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_signup.json', function (err, json_signup) {
			if(err){ throw err; }
			firstCMModel.pages.signup = json_signup;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_timeline.json', function (err, json_timeline) {
			if(err){ throw err; }
			firstCMModel.pages.timeline = json_timeline;
		});
		readJSONFile(__dirname + '/ContentManager/Resources/Messages/msg_training.json', function (err, json_training) {
			if(err){ throw err; }
			firstCMModel.pages.training = json_training;
			//this is INSIDE the last readJSON function. Need to figure a better way to do this as async issues are very likely.

			if(count === 0)
			{
				firstCMModel.save(function(err){
							if(err)	
							{
								throw err;
							}
							else
							{
								res.send("First upload of messages documents.");
								return (null, firstCMModel);
							}
				});
			}
			else if(count === 1)
			{
				contentManagerModel.find().remove(function(err){
					if(err){
						console.log(err);
					}
					firstCMModel.save(function(err){
							if(err)	
							{
								throw err;
							}
							else
							{
								res.send("FILES OVERWRITTEN!");
								return (null, firstCMModel);
							}
					});
				});
			}


		});
			
		});

	});
//Mentorship Routes///////////////////////////////////////////////////////////////
//																				//
//							For Mentor/mentee interarctions,					//
//	 						 training and communications.						//
//																				//
//////////////////////////////////////////////////////////////////////////////////

	router.get('/mentorships/requestMentor', function(req,res){
		console.log(req.body);
		console.log(req.data);
		var query = userProfile.find({ 'member.memberStatus' : 'mentor' });
		query.exec(function(err, info){
			if(err){ return next(err); }

			var matchedMentor = {
				'email': info[0].member.email,
				'firstName' : info[0].member.firstName,
				'lastName' : info[0].member.lastName
			};
			res.send(matchedMentor);
		}); 
	});

//Other routes////////////////////////////////////////////////////////////////////
//																				//
//																				//
//	 							Miscellaneous									//
//																				//
//////////////////////////////////////////////////////////////////////////////////
	
	//loads the json file for messages.
	//will replace with one function for content management that uploads/update all 
	//json data in the database from which we pull info.
	router.get('/load/json', function(req, res){
		console.log("url requested : " + req.url);
	var url = '/Javascript/controllers/test.json';

	request({
	    url: url,
	    json: true
		}, function (error, response, body) {
			console.log('requesting...');
			console.log(error);

	    if (!error && response.statusCode === 200) {
	        console.log(body) // Print the json response
	        console.log('working...');
	    }
	    console.log('sending...');
	    res.send(body);
		});
	});
	///Do not remove.
	//Let's us use router for our routes.
	app.use('/', router);

};



/*Functions***********************************************************************
**																				**
**																				**
**	 							FUNCTIONS  										**
**																				**
*********************************************************************************/

//Check if the session is valid. Redirect to login page if it fails.
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){

		return next();
	}
	
	res.send(false);
}

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) 
    {
      callback(err);
      return;
    }
    try 
    {
      callback(null, JSON.parse(data));
    } 
    catch(exception) 
    {
      callback(exception);
    }
  });
}


