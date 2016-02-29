// Used for interacting with Elasticsearch (we're using ES as a DB)
var elasticsearch = require('elasticsearch'); // import ES JS client library
var escapeHtml = require('./escape')

var client = new elasticsearch.Client({ // define the location of out elasticsearch instance
    host: 'localhost:9200'
});

function composeChirp(req) {
    var chirpText = escapeHtml(req.body.text);
    var user = req.user.nickname;
    var date = new Date()
    var chirp = {
        user: user,
        timestamp: date,
        text: chirpText,
        length: chirpText.length,
    }
    return chirp;
}

function storeChirp(chirp) {
    client.index({
        index: 'chirper',
        type: 'chirp',
        body: chirp
    }, function(err, res) {
        if (err) {
            console.error(err);
            return 500;
        } else {
            console.log("Successfully inserted chirp!");
            return 200;
        }
    });
}

function getUserChirps(user, callback) {
    client.search({
        index: 'chirper',
        type: 'chirp',
        q: 'user:' + user,
        sort: 'timestamp:desc',
    }, function(err, res) {
        if (err) {
            console.error(err);
            console.log("failed here");
        } else {
            var chirps = [];
            var data = res.hits.hits;
            for (var i in data) {
                chirps.push({
                    text: data[i]._source.text,
                    user: data[i]._source.user,
                    timestamp: data[i]._source.timestamp,
                    length: data[i]._source.length
                })
            }
            callback(err, chirps);
        }
    });
}

function getRecentChirps(callback) {
    client.search({
        index: 'chirper',
        type: 'chirp',
        sort: 'timestamp:desc'
    }, function(err, res) {
        if (err) console.error(err);
        else {
            var chirps = [];
            var data = res.hits.hits;
            for (var i in data) {
                chirps.push({
                    text: data[i]._source.text,
                    user: data[i]._source.user,
                    timestamp: data[i]._source.timestamp,
                    length: data[i]._source.length
                })
            }
            callback(err, chirps);
        }
    });
}

function initESIndex() {
    client.search({
        index: 'chirper',
        type: 'chirp',
        sort: 'timestamp:desc'
    }, function(err, res) {
        if (err) {
            client.index({
                index: 'chirper',
                type: 'chirp',
                body: {
                    text: 'hello world!',
                    timestamp: new Date(),
                    user: 'erikreppel',
                    length: 10
                }
            }, function(err, res) {
                if (err) {
                    console.error(err);
                    return 500;
                } else {
                    console.log("Successfully inserted chirp!");
                    return 200;
                }
            })
        }
    });
}

module.exports = {
    storeChirp: storeChirp,
    composeChirp: composeChirp,
    getRecentChirps: getRecentChirps,
    getUserChirps: getUserChirps,
    initESIndex: initESIndex
}