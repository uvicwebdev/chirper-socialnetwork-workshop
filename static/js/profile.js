var chirpInput = document.getElementById('chirp');

var chirpSubmit = document.getElementById('chirp-btn');

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
