var chirpInput = document.getElementById('chirp');
var chirpSubmit = document.getElementById('chirp-btn');
var loadMore = document.getElementById('load-more-chirps');
var chirpHolder = document.getElementById('chirp-holder');

var currentPage = 1;

loadMore.onclick = function() {
    $.get('/feed/' + currentPage)
        .success(function(data) {
            var chirps = data.chirps;
            for (var i in chirps) {
                chirpHolder.innerHTML += createChirpHtml(chirps[i]);
            }
            currentPage += 1
            chirpHolder.appendChild(loadMore);
        });
}

chirpSubmit.onclick = function() {
    var text = chirpInput.value;
    console.log(text.length);
    var data = {text: text}
    $.post("/chirp", data)
        .fail(function() {
            alert('failed to chirp! Are you logged in?')
        })

    chirpInput.value = '';
}


function createChirpHtml(chirp) {
    // forgive me father
    var htmlStr = "" + chirp.user + " " + chirp.timestamp.toString();
    htmlStr += "<p>" + chirp.text + "</p>";
    return htmlStr;
}