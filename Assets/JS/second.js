var artistDiv = $('#card')
let params = new URLSearchParams(document.location.search);
let names = params.get("ids");
var arrayOfIds = names.split(',');
var thing =$('#thing')
function makeModal(i, artTitle, artImage, artArtist, artCulture, artPeriod, artObjectDate, artMedium, artDepartment) {
    thing.append(`<div id="modal-${i}" aria-hidden='true' aria-modal='true' role='dialog' class='hidden overflow-y-hidden overflow-x-hidden h-full fixed right-0 left-0 top-0 z-50 justify-center items-center'>
                    <div class="flex flex-col bg-white rounded-lg shadow dark:bg-gray-700 m-4 w-full max-w-lg h-4/5">
                        <div class="flex justify-between items-center p-5 rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-medium text-gray-900 dark:text-white">${artTitle}</h3>
                            <button id="modal-${i}-close-btn" type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                        </div>
                        <img class='grow overflow-hidden object-contain object-center' src="${artImage}" alt="">
                        <div class='mx-8 py-5'>
                            <h3>Artist: <span class='font-bold'>${artArtist}</span></h3>
                            <h3>Culture: <span class='font-bold'>${artCulture}</span></h3>
                            <h3>Period: <span class='font-bold'>${artPeriod}</span></h3>
                            <h3>Object Date: <span class='font-bold'>${artObjectDate}</span></h3>
                            <h3>Department: <span class='font-bold'>${artDepartment}</span></h3>
                            <h3>Medium: <span class='font-bold'>${artMedium}</span></h3>
                        </div>
                    </div>
                </div>`)
}
var arrayOfRequests = [];
for (let i = 0; i < arrayOfIds.length; i++) {
    arrayOfRequests.push(fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects/' + arrayOfIds[i])
    .then(function (response){
        return response.json()
    }))
}
Promise.all(arrayOfRequests)
    .then(function (values) {
        for (let i=0; i < values.length; i++) {
            artistDiv.append(`<div id='btnModal-${i}' class="bg-white m-5 basis-3/4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 rounded hover:cursor-pointer hover:-translate-y-1 transition-all duration-200 " title="Click for More Info">
                                    <div class="h-full flex flex-col">
                                        <div class="grow w-full p-4 pb-2 flex flex-col justify-center">
                                            <img src=${values[i].primaryImageSmall} id="image" alt="painting">
                                        </div>
                                        <p class="font-light text-center p-4 pt-2 text-sm text-gray-700 hover:text-gray-900" id="paintingTitle">${values[i].title}</p>
                                    </div>
                                </div>`);
            makeModal(i, values[i].title, values[i].primaryImageSmall, values[i].artistDisplayName, values[i].culture, values[i].period, values[i].objectDate, values[i].medium, values[i].department);
            $(`#btnModal-${i}`).on('click', function() {
                    $(`#modal-${i}`).addClass('flex');
                    $(`#modal-${i}`).removeClass('hidden');
                    $('body').append('<div id="backdrop" modal-backdrop="true" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>')
            });
            $(`#modal-${i}-close-btn`).on('click', function(){
                    $(`#modal-${i}`).addClass('hidden');
                    $(`#modal-${i}`).removeClass('flex');
                    $('#backdrop').remove();
            });
        };
        $('#loading').remove()
    });
document.getElementById("returnHome").onclick = function () {
    location.href = "home.html";
};