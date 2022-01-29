// global variables
var searchInput = $('#search-input');
var btnInput = $('#input-btn');
var historyEl = $('#history-container');
var magGlass = $('#mag-glass');
var spinner = $('#spinner');
var artistArray;

// a button rendering function to render save search terms for researching
function renderHistory() {
    historyEl.text('')
    for (let i = 0; i < artistArray.length; i++) {
        var btnEl = $('<button>').attr('class', 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-800 text-stone-700 hover:text-stone-800 dark:text-stone-100 hover:dark:text-stone-200 font-bold border border-stone-900 rounded text-center text-md sm:text-l px-4 py-2').text(artistArray[i]).appendTo(historyEl)
        btnEl.on('click', function(){
            spinnerMagToggle();
            artFetch(artistArray[i]);
        })
    }
};

// checking if local storage contains anything and rendering if there is something
if (localStorage.getItem('searchInput')){
    artistArray = JSON.parse(localStorage.getItem('searchInput'));
    renderHistory(artistArray);
} else { // and creating an array to go into local storage if there is not
    artistArray = [];
};

// a function to set the search terms to the local storage
function setLocal(search) {
    // check if search term is already in the local storage
    for (let i = 0; i < artistArray.length; i++) {
        if (artistArray[i]===search){
            return
        }
    }
    // if not, push it to the end of artist array
    artistArray.push(search)
    // set local storage
    localStorage.setItem('searchInput', JSON.stringify(artistArray))
};

// a function that displays a message if no results matched the search.
// uses timeout function to disappear 3.5 seconds after appearing
function noIds() {
    $('#user-div').toggleClass('opacity-0')
    setTimeout(function() {$('#user-div').toggleClass('opacity-0')}, 3500)
}

// function that gives user feedback
// when loading the magnifying glass becomes a spinner symbolising loading
function spinnerMagToggle() {
    spinner.toggleClass('hidden');
    magGlass.toggleClass('hidden');
    if (btnInput.prop('disabled')){
        btnInput.prop('disabled', false);
        searchInput.prop('disabled', false);
    } else {
        btnInput.prop('disabled', true);
        searchInput.prop('disabled', true);
    }
}

// the api address to get the ids (first of two fetch requests)
var initialQuery = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=';

// a function that searchs for artwork that relates to search term
function artFetch(search) {
    fetch(initialQuery + search)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        var objectArray = [];
        // if the data attribute 'total' === 0, then no results were found
        if(data.total === 0){
            // use error message function to tell user to search again
            spinnerMagToggle()
            noIds()
            return
        } else if (data.objectIDs.length<=12){
            // if there are results, this search is valid so save it for reuse
            setLocal(search);
            // as there are less than 12 (arbitrary maximum number) assign them to the array of ids
            objectArray = data.objectIDs
        } else {
            // else, there are more than 12 so save the search term and loop through to get first 12 ids
            setLocal(search);
            for (let i = 0; i < 12; i++) {
                objectArray.push(data.objectIDs[i])
            }
        }
        // add the object ids to as query string parameters to use on second html page
        // move user to the second page
        document.location = 'second.html?ids='+objectArray.join(',');
    })
}

// add an event listener to the search bar
btnInput.on('click', function() {
    // get the value inputed into the search bar
    var search = searchInput.val();
    // if it is does not contain anything, return
    if (search === ''){
        return
    }
    spinnerMagToggle()
    // else, remove search term from search bar and make a fetch request
    searchInput.val('');
    artFetch(search);
});
// function that does same as above event listener but for enter key
searchInput.on('keypress', function(event) {
    if (event.originalEvent.key === 'Enter'){
        var search = searchInput.val();
        if (search === ''){
            return
        }
        spinnerMagToggle()
        searchInput.val('');
        artFetch(search);
    }
});

// event listener for clear history button
$("#clear-history").on("click", function () {
    // clears local history
    localStorage.clear();
    // clears search terms saved in the array of search terms
    artistArray = [];
    // rerenders the history
    renderHistory();
});
