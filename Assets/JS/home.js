// global variables
var searchInput = $('#search-input');
var btnInput = $('#input-btn');
var historyEl = $('#history-container')
var artistArray;
function renderHistory() {
    historyEl.text('')
    for (let i = 0; i < artistArray.length; i++) {
        var btnEl = $('<button>').attr('class', 'bg-stone-200 hover:bg-stone-400 hover:text-white font-bold border border-stone-700 text-stone-700 rounded-md block mx-auto m-3 text-center text-lg sm:text-2xl px-4 py-2').text(artistArray[i]).appendTo(historyEl)
        btnEl.on('click', function(){
            artFetch(artistArray[i]);
        })
    }
};
if (localStorage.getItem('searchInput')){
    artistArray = JSON.parse(localStorage.getItem('searchInput'));
    renderHistory(artistArray);
} else {
    artistArray = [];
};
function setLocal(search) {
    // check if already in local storage
    for (let i = 0; i < artistArray.length; i++) {
        if (artistArray[i]===search){
            return
        }
    }
    // if not, push to the end of artist array
    artistArray.push(search)
    // set local storage
    localStorage.setItem('searchInput', JSON.stringify(artistArray))
};
function noIds() {
    $('#search-container').append('<div id="error-div" class="mt-5 bg-red-300 border-2 border-red-700 py-2 px-3 rounded"><p>No results found.<br>Check spelling or try another artist.</p></div>')
    setTimeout(function() {$('#error-div').remove()}, 3000)
}
var initialQuery = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=';
function artFetch(search) {
    fetch(initialQuery + search)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        var objectArray = [];
        if(data.total === 0){
            noIds()
            return
        } else if (data.objectIDs.length<=12){
            objectArray = data.objectIDs
        } else {
            for (let i = 0; i < 12; i++) {
                objectArray.push(data.objectIDs[i])
            }
        }
        document.location = 'second.html?ids='+objectArray.join(',');
    })
}
btnInput.on('click', function() {
    var search = searchInput.val();
    if (search === ''){
        return
    }
    searchInput.val('');
    setLocal(search);
    artFetch(search);
})
searchInput.on('keypress', function(event) {
    if (event.originalEvent.key === 'Enter'){
        var search = searchInput.val();
        if (search === ''){
            return
        }
        searchInput.val('');
        setLocal(search);
        artFetch(search);
    }
})
$("#clear-history").on("click", function () {
    localStorage.clear();
    artistArray = [];
    renderHistory();
});