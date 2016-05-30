var express = require('express');
var router = express.Router();
var userProfile = require('../app/models/userProfile');
var configDB = require('../config/database.js');
var discuss = require('mongodb-discuss')({mongoUrl: 'mongodb://localhost'});

var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

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
	//Let's us use router for our routes.
	app.use('/', router);

};
//Check if the session is valid. Redirect to login page if it fails.
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){

		return next();
	}
	
	res.send(false);
}

