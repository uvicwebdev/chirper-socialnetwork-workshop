/*Imports**********************************************************************/
var express = require('express');     // imports the Express library
var passport = require('passport');   // handles auth0
var strategy = require('./auth/setup-passport');    // import the stub we made
var cookieParser = require('cookie-parser');        // a tool to parse cookies
var session = require('express-session');           // used to track user sessions
var path = require('path');
var requiresLogin = require('./auth/requiresLogin')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()


/*Globals**********************************************************************/
var app = express();                // creates a new Express app
var PORT = 3000;                  // keep the port we're opening as a global


/*Middlewares******************************************************************/
app.use(cookieParser());
app.use(session({                       // Used to track user session
        secret: "ASECRETCODEGOESHERE",
        resave: true,
        saveUninitialized: true
    }));
passport.use(strategy);
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
    console.log("hi");
    console.log(req.isAuthenticated());
    console.log(req.user);

    if (!req.isAuthenticated()) {
        console.log("hellooooo");
        res.sendFile(path.join(__dirname, 'views/html/index.html'));
    }
    else {
        res.render(path.join(__dirname, 'views/partials/home'));
    }
});

// route handler for our auth callback
app.get('/callback',
    passport.authenticate('auth0', {failureRedirect: '/failure'}),
    function(req, res) {
        console.log("auth callback");
        if (!req.user) throw new Error('user null');
        else res.redirect('/home');
    });

app.get('/home', requiresLogin, function(req, res) {
    res.render(path.join(__dirname, 'views/partials/home'));
});

// route to handle when logins go wrong
app.get('/failure', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/html/failure.html'));
});

// Start the app
app.listen(PORT, function() {
    console.log('Listening on port', PORT);
})