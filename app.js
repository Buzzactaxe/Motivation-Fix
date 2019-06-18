var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	expressSanitizer = require('express-sanitizer'),
	env = require('dotenv'),
	LocalStrategy = require('passport-local'),
	passport = require('passport'),
	flash = require('connect-flash'),
	seedDB = require('./seeds'),
	User = require('./models/user'),
	mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

//Requiering routes
var commentRoutes = require('./routes/comments'),
	blogRoutes = require('./routes/blogs'),
	indexRoutes = require('./routes/index');

// console.log(process.env.DATABASEURL);

// config. APP
env.config();

//Closed Environment DB
mongoose
	.connect(process.env.DATABASEURL, {
		useNewUrlParser: true,
		useCreateIndex: true
	})
	.then(() => {
		console.log('Connected to DB!');
	})
	.catch((err) => {
		console.log('ERROR:', err.message);
	});

//Heroku Environment DB
// mongoose
// 	.connect(
// 		'mongodb+srv://buzzactaxe:buzzactaxe88@cluster0-co6r4.mongodb.net/motivationfix?retryWrites=true&w=majority',
// 		{
// 			useNewUrlParser: true,
// 			useCreateIndex: true
// 		}
// 	)
// 	.then(() => {
// 		console.log('Connected to DB!');
// 	})
// 	.catch((err) => {
// 		console.log('ERROR:', err.message);
// 	});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(flash());
app.use(express.static(__dirname + '/public'));
// seedDB(); //Seeds the database

// PASSPORT CONFIGURATION
app.use(
	require('express-session')({
		secret: 'first app just for a special person',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//auth middleware
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//Confirm our app to use the created routes
app.use('/blogs', blogRoutes);
app.use('/', indexRoutes);
//issue with mergeParams on commentRoutes so i left it default
app.use(commentRoutes);

//Listening to server
var port = process.env.PORT || 3000;
app.listen(port || process.env.PORT, process.env.IP, function() {
	console.log('Blog Server is Running and all is well!');
});
