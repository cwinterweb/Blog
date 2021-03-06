var express = require("express");
var mongoose = require("mongoose");
var parser = require("body-parser");
var override = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var Post = require("./models/post");
var User = require("./models/user");
// var config = require("./config");
var app = express();

// CONFIG
mongoose.Promise = global.Promise;

mongoose.connect(process.env.DATABASEURL, {useMongoClient: true});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(parser.urlencoded({extended: true}));
app.use(override("_method"));
app.use(flash());

// PASSPORT
app.use(require("express-session")({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// ROUTES
var postRoutes = require("./routes/posts");
var indexRoutes = require("./routes");
app.use('/posts', postRoutes);
app.use('/', indexRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
	console.log('server listening...');
});