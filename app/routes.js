var express = require('express');
var router = express.Router();
var userProfile = require('../app/models/userProfile');
var configDB = require('../config/database.js');
var discuss = require('mongodb-discuss')({mongoUrl: 'mongodb://localhost'});

module.exports = function(app, passport){


	
	router.get('/', function(req, res) {
		res.sendFile('./index.html', { root: __dirname } ); 
	});


	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/#/profile',
		failureRedirect: '/#/login',
		failureFlash: true
	}));

	router.post('/test', function(){

	});

	router.post('/signup', passport.authenticate('local-signup', {
			successRedirect: '/#/profile',
			failureRedirect: '/#/mSignup',
			failureFlash: true
	}));

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
		})
		
	});

	//asked for info from the user to get a match of a mentor.
	router.get('/signForMentor', isLoggedIn, function(req, res){
		res.send({user : req.user});
	});

	//Forum routes

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

	//end of forum
	
	router.get('/auth/facebook', passport.authenticate('facebook', {scope:['email']}));


	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    	failureRedirect: '/' }), function(req, res){
		res.redirect('/#/profile');
	});
	

	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	app.use('/', router);

};

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/#/login');
}

