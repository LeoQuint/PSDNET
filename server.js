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
app.use(cookieParser());//cokkie pasrser no longer require since newer version of express-session
                                  
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(session({secret: 'stringtextcookie', 
						saveUninitialized: true,
						resave: true}));
//-------------------------------------------------------------------------//
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./app/routes.js')(app, passport);



app.listen(port);
console.log('server running in port' + port);
