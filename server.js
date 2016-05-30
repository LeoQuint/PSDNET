var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');



//------------------DataBase----------------------------------------------//
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);



require('./config/passport')(passport);


app.use(express.static(__dirname + '/app/public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());//cookie pasrser no longer require since newer version of express-session
                                  
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(session({secret: 'stringtextcookie', 
						saveUninitialized: true,
						resave: true}));

//-------------------Socket IO---------------------------------------------//

var http = require("http").Server(app);
var io = require("socket.io")(http);


var clientInfo = {};

function sendCurrentUsers(socket){
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === "undefined") {
		return;
	}
	
	Object.keys(clientInfo).forEach(function(socketId) {
		var userInfo = clientInfo[socketId];

		if(info.room === userInfo.room){
			users.push(userInfo.name);
		}
	});

	socket.emit("message",{
		name: "System",
		text: "Current users: " + users.join(", "),
		timestamp: moment().valueOf()
	});
}

io.on("connection", function(socket) {
	console.log("User connected via socket.io!");

	socket.on("disconnect", function(){
		var userData = clientInfo[socket.id];

		if (typeof userData !== "undefined"){
			socket.leave(userData.room);
			io.to(userData.room).emit("message", {
				name: "System",
				text: userData.name + " has left!",
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on("joinRoom", function(req){
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit("message",{
			name: "System",
			text: req.name + " has joined!",
			timestamp: moment().valueOf()
		});
	});

	socket.on("message", function(message){
		console.log("Message received: " + message.text);

		if (message.text === "@currentUsers") {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit("message", message);
		}
	});

	socket.emit("message", {
		name: "System",
		text: "Welcome to the chat room!",
		timestamp: moment().valueOf()
	});
});

//-------------------Passport and authentication------------------------------//


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./app/routes.js')(app, passport);



http.listen(port, function (){
	console.log("Server running on port:" + port);
});
