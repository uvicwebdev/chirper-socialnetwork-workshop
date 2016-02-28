var chirpInput = document.getElementById('chirp');

var chirpSubmit = document.getElementById('chirp-btn');

chirpSubmit.onclick = function() {
    var text = chirpInput.value;
    console.log(text.length);
}