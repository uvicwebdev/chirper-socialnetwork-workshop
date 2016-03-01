/*Imports**********************************************************************/
// For the Server we're writing
var express = require('express');                 // imports the Express library
var bodyParser = require('body-parser');          // middleware for json requests

// For user authentication (specific to auth0)
var passport = require('passport');               // handles auth0
var strategy = require('./auth/setup-passport')   // our auth0 strategy

// Useful for many things (we're using it for auth but useful for many things)
var session = require('express-session');         // used to track user sessions
var cookieParser = require('cookie-parser');      // a tool to parse cookies

// General util for finding file paths on the server
var path = require('path');                       // used for handling paths on the server

// util functions
var chirpUtils = require('./utils/chirp');

/*Globals**********************************************************************/
var app = express();                    // creates a new Express app
var PORT = 3000;                        // keep the port we're opening as a global

/*Middlewares******************************************************************/
app.use(cookieParser());
app.use(session({                       // Used to track user session
        secret: "ASECRETCODEGOESHERE",
        resave: true,
        saveUninitialized: true
    }));
passport.use(strategy);          // tell passport to use the strategy we defined

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
app.set('view engine', 'ejs');          // allows us to render ejs templates
app.use(bodyParser.urlencoded({ extended: false })); // setting for body parser
app.use(bodyParser.json())              // for parsing json from post bodies

chirpUtils.initESIndex();

/*Routes***********************************************************************/
// The route handler for index
app.get('/', function(req, res) {
    // when a GET request is sent to '/' on our app, we apply a callback function
    // the function has request and response (req, res) params
    // req is what the server received, res is what wer are going to send back
    
    // Want to send a logged in user to /feed, and show a non-loggedin user the
    // splash page
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
        // If user isn't present throw error, else they're authed so send to feed
        if (!req.user)
            throw new Error('user null');
        else
            res.redirect('/feed');
    });

// the route for our feed
app.get('/feed', function(req, res) {
   res.send("I dont exist yet!");
});

app.get('/feed/:page', function (req, res) {
    res.send("I also dont exist yet!")
});

// the route for a users chirps
app.get('/user', function(req, res) {
    if (!req.isAuthenticated())
        res.redirect('/');
    else {
        res.redirect('/user/' + req.user.nickname);
    }
});

app.get('/user/:username', function(req, res) {
    if (!req.isAuthenticated())
        res.redirect('/');
    else {
        var username = req.params.username;
        chirpUtils.getUserChirps(username, function(err, chirps) {
            res.render(
                path.join(__dirname, 'views/partials/profile'),
                {chirps: chirps, user: username}
            );
        });
    }
});


// route to handle when logins go wrong
app.get('/failure', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/html/failure.html'));
});

app.post('/chirp', function(req, res) {
    // console.log(req);
    if (!req.isAuthenticated())
        res.status(403)
    else {
        var chirp = chirpUtils.composeChirp(req);
        var status = chirpUtils.storeChirp(chirp);
        res.status(status);
    }
});

// Start the app and listen on PORT
app.listen(PORT, function() {
    console.log('Listening on port', PORT);
})