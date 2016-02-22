'use strict';

const express = require('express'); // imports the Express library
const app = express();              // creates a new Express app
const PORT = 3000;                  // keep the port we're opening as a global

// The route handler for index
app.get('/', function(req, res) {
    // when a GET request is sent to '/' on our app, we apply a callback function
    // the function has request and response (req, res) params
    // req is what the server received, res is what wer are going to send back

    res.send('hello world');
})

app.listen(PORT, function() {
    console.log('Listening on port', PORT);
})