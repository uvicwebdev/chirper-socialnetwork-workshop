/*Imports**********************************************************************/
var express = require('express');     // imports the Express library

var passport = require('passport');   // handles auth0
var strategy = require('./auth/setup-passport')

var cookieParser = require('cookie-parser');        // a tool to parse cookies
var session = require('express-session');           // used to track user sessions
var path = require('path');
var requiresLogin = require('./auth/requiresLogin')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()

var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var elasticsearch = require('elasticsearch');


/*Globals**********************************************************************/
var app = express();                // creates a new Express app
var PORT = 3000;                  // keep the port we're opening as a global
var client = new elasticsearch.Client({
    host: 'localhost:9200'
});

/*Middlewares******************************************************************/
app.use(cookieParser());
app.use(session({                       // Used to track user session
        secret: "ASECRETCODEGOESHERE",
        resave: true,
        saveUninitialized: true
    }));
passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());         // Used for auth
app.use(passport.session());            // Used for auth

app.use(express.static('static'));      // serves things in static at the '/' endpoint
                                        // ex: localhost:3000/css/index.css
app.set('view engine', 'ejs');          // allows us to use ejs


/*Routes***********************************************************************/
// The route handler for index
app.get('/', function(req, res) {
    // when a GET request is sent to '/' on our app, we apply a callback function
    // the function has request and response (req, res) params
    // req is what the server received, res is what wer are going to send back

    if (!req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, 'views/html/index.html'));
    }
    else {
        res.redirect('/feed');
    }
});

// route handler for our auth callback
app.get('/callback',
    passport.authenticate('auth0', {failureRedirect: '/failure'}),
    function(req, res) {
        console.log("auth callback");
        if (!req.user) throw new Error('user null');
        else res.redirect('/feed');
    });

app.get('/feed', function(req, res) {
    res.render(path.join(__dirname, 'views/partials/feed'));
});

// route to handle when logins go wrong
app.get('/failure', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/html/failure.html'));
});

app.post('/chirp', function(req, res) {
    console.log(req);
    res.status(200);
});

// Start the app
app.listen(PORT, function() {
    console.log('Listening on port', PORT);
})