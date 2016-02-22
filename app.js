'use strict';

/*Imports**********************************************************************/
const express = require('express');     // imports the Express library
const passport = require('passport');   // handles auth0
const strategy = require('./auth/setup-passport');    // import the stub we made
const cookieParser = require('cookie-parser');        // a tool to parse cookies
const session = require('express-session');           // used to track user sessions
const path = require('path');
var requiresLogin = require('./auth/requiresLogin')


/*Globals**********************************************************************/
var app = express();                // creates a new Express app
const PORT = 3000;                  // keep the port we're opening as a global


/*Middlewares******************************************************************/
app.use(session({                       // Used to track user session
        secret: "ASECRETCODEGOESHERE",
        resave: false,
        saveUninitialized: false
    }));
app.use(passport.initialize());         // Used for auth
app.use(passport.session());            // Used for auth

app.use(express.static('static'));      // serves things in static at the '/' endpoint
                                        // ex: localhost:3000/css/index.css


/*Routes***********************************************************************/
// The route handler for index
app.get('/', function(req, res) {
    // when a GET request is sent to '/' on our app, we apply a callback function
    // the function has request and response (req, res) params
    // req is what the server received, res is what wer are going to send back

    res.sendFile(path.join(__dirname, 'views/html/index.html'));

});

// route handler for our auth callback
app.get('/callback',
    passport.authenticate('auth0', {failureRedirect: '/failure'}),
    function(req, res) {
        if (!req.user) throw new Error('user null');
        else res.redirect('/');
    });


// route to handle when logins go wrong
app.get('/failure', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/html/failure.html'));
});

// Start the app
app.listen(PORT, function() {
    console.log('Listening on port', PORT);
})