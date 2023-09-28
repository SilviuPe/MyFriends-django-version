var search = document.querySelector('.search').children[1];
var input = document.querySelector('.search').children[0];

function load_search_query() {
    var text = input.value;
    if (text.replaceAll(" ","").length !== 0) {
        window.location.href = "http://localhost:3000/chat/search?s=" + text;
    }
}

search.addEventListener('click', load_search_query);
input.addEventListener('keyup', function(event) {
    if(event.key === "Enter") {
        load_search_query();
    }
});

