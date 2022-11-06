const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearSearch");
const cityButtons = document.getElementById("cityButtons");
const searchForm = document.getElementById("searchSection");

const APIkey = "f700a26284d3a4077a271bbd39e39c99"

// This code finds the current date in Unix Timestamp, and then creates an array of both today and the next five days in Unix Timestamps as well.
var today = moment().format("X");
const fiveDays = [today, ((parseInt(today)+ 86400).toString()), ((parseInt(today)+ (86400 * 2)).toString()), ((parseInt(today)+ (86400 * 3)).toString()), ((parseInt(today)+ (86400 * 4)).toString()), ((parseInt(today)+ (86400 * 5)).toString())]
var cityLatLon = []



// This section checks local storage to see if cities have been searched by the user. If they have, the cities
// are pulled from local storage to the searchedCities variable.
var prevSearchedCities = JSON.parse(localStorage.getItem("searchedCities"))
if (prevSearchedCities == []) {
    var searchedCities = []
} else {
    var searchedCities = prevSearchedCities;
}

// This converts the user input into longitude and latitude.
function geoCode (city) {

    var geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`

    fetch(geoAPI).then((response) => {
        return response.json()
     }).then((data) => {
        cityLatLon.push(data[0].lat)
        cityLatLon.push(data[0].lon)
     })
}

// This function fetches the API data for the requested city.
function weatherCall (city, date) {
    geoCode(city)
    var openweather = (`https://api.openweathermap.org/data/2.5/weather?q=${city}&dt=${date}&appid=${APIkey}`);
    // var openweather = (`api.openweathermap.org/data/2.5/forecast?lat=${cityLatLon[0]}&lon=${cityLatLon[1]}&appid=${APIkey}`)

    fetch(openweather).then((response) => {
        return response.json()
     }).then((data) => {
        console.log(data)
     })
}

// This function first clears the list of previously searched cities, then adds buttons with the cities based on localStorage.
function searchedCitiesList () {
    cityButtons.innerHTML = ""

    for (var i = 0; i < searchedCities.length; i++) {
        cityButton = document.createElement('button');
        cityButton.setAttribute("id", "city" + i)
        cityButton.setAttribute("style", "margin-top: 1%; margin-bottom: 1%; color: black; background-color: lightgrey;")
        cityButton.innerHTML = searchedCities[i];
        cityButtons.appendChild(cityButton)
    }
}
searchedCitiesList()

localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

// This function controls what occurs when a user enters a city and 
function searchCity (event) {
    event.preventDefault();

    const inputSearch = document.getElementById("citySearch").value;

    // This section reads the selected value input by the user in the search bar, and adds it to the searched cities list in local storage.
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"))
    searchedCities.push(inputSearch);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    searchedCitiesList()
    weatherCall(inputSearch, today)
    console.log(cityLatLon)

}

// This function clears out the saved searches in local storage.
function clearSearches (event) {
    event.preventDefault();
    localStorage.removeItem("searchedCities")
    searchedCities = []
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    searchedCitiesList()
}


searchForm.addEventListener("submit", searchCity)
clearButton.addEventListener("click", clearSearches)


