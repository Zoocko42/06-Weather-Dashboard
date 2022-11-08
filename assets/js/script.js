const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearSearch");
const cityButtons = document.getElementById("cityButtons");
const searchForm = document.getElementById("searchSection");

const APIkey = "f700a26284d3a4077a271bbd39e39c99"

// This code finds the current date in Unix Timestamp, and then creates an array of both todayUnix and the next five days in Unix Timestamps as well.
var todayMDY = moment().format("L");
var todayUnix = moment().format("X");
const fiveDays = [todayUnix, ((parseInt(todayUnix)+ 86400).toString()), ((parseInt(todayUnix)+ (86400 * 2)).toString()), ((parseInt(todayUnix)+ (86400 * 3)).toString()), ((parseInt(todayUnix)+ (86400 * 4)).toString()), ((parseInt(todayUnix)+ (86400 * 5)).toString())]
var latLon = []

// This section checks local storage to see if cities have been searched by the user. If they have, the cities
// are pulled from local storage to the searchedCities variable.
var prevSearchedCities = JSON.parse(localStorage.getItem("searchedCities"))
if (prevSearchedCities == []) {
    var searchedCities = []
} else {
    var searchedCities = prevSearchedCities;
}

// This converts the user input into longitude and latitude so it can be utilized by the forecastCall function.
function geoCode (city) {
    var geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`
    var response = fetch(geoAPI).then((response) => {
        return response.json()
     }).then((data) => {
        latLon = [data[0].lat, data[0].lon]
        return latLon
     })
    return response;
}

// This code pulls the weather information for the current day for the requested city.
async function todayWeather (city) {
    var openweather = (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`);
    return fetch(openweather).then((response) => {
        return response.json()
     }).then((data) => {
        return data
     })
}

// This function fetches a five-day three-hour forecast for the selected city.
async function forecastCall (city) {
    var locationData = await geoCode(city);
    var openweather = (`https://api.openweathermap.org/data/2.5/forecast?lat=${locationData[0]}&lon=${locationData[1]}&appid=${APIkey}`)

    return fetch(openweather).then((response) => {
        return response.json()
     }).then((data) => {
        return data
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

// This function controls what occurs when a user enters a city then either hits the search button or hits enter on their keyboard.
async function searchCity (event) {
    event.preventDefault();

    const inputSearch = document.getElementById("citySearch").value;

    var cityAndDay = document.getElementById("cityAndDay")

    cityAndDay.innerHTML = `${inputSearch} (${todayMDY})`

    // This section reads the selected value input by the user in the search bar, and adds it to the searched cities list in local storage.
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"))
    searchedCities.push(inputSearch);
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    searchedCitiesList()

    // This section takes the data pulled from the forecastCall and the todayWeather functions and saves them as objects.
    var forecastData = await forecastCall(inputSearch)
    var weatherData = await todayWeather(inputSearch)
    console.log(weatherData)
    console.log(forecastData)

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


