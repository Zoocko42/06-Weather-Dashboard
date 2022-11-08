const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearSearch");
const cityButtons = document.getElementById("cityButtons");
const searchForm = document.getElementById("searchSection");
const todayForecast = document.getElementById("todayForecast")

// These constants pull populated fields in the todayForecast box, if they are present.
var todayData = document.getElementsByClassName("todayData")
var todayTemp = document.getElementById("todayTemp")

const APIkey = "f700a26284d3a4077a271bbd39e39c99"
const oneCallAPIkey = "9de9a50c9590195121fe2b6ec8fd1876"

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

// // This converts the user input into longitude and latitude so it can be utilized by the forecastCall function.
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

// This function fetches the forecast for today and up to 8 days in the future.
async function oneCall (city) {
    var locationData = await geoCode(city);
    var openweather = (`https://api.openweathermap.org/data/3.0/onecall?lat=${locationData[0]}&lon=${locationData[1]}&units=imperial&exclude=minutely,hourly,alerts&appid=${oneCallAPIkey}`)

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

    // This section takes the data pulled from the oneCall function and saves it as an object.
    var oneCallData = await oneCall(inputSearch)
    console.log(oneCallData)

    if (!todayTemp) {
        // This code adds the current temperature to today's forecast.
        todayTemp = document.createElement("p");
        todayTemp.setAttribute("class", "todayData");
        todayTemp.setAttribute("id", "todayTemp");
        todayTemp.innerHTML = `Temp: ${oneCallData.current.temp}°F`;
        todayForecast.appendChild(todayTemp);

        // This code adds current windspeed to today's forecast.
        todayWind = document.createElement("p");
        todayWind.setAttribute("class", "todayData");
        todayWind.setAttribute("id", "todayWind");
        todayWind.innerHTML = `Wind: ${oneCallData.current.wind_speed} MPH`;
        todayForecast.appendChild(todayWind);
        // This adds current humidity to today's forecast.
        todayHum = document.createElement("p");
        todayHum.setAttribute("class", "todayData");
        todayHum.setAttribute("id", "todayHum");
        todayHum.innerHTML = `Humidity: ${oneCallData.current.humidity}%`;
        todayForecast.appendChild(todayHum);
        // This adds the UV index for the day.
        todayUVI = document.createElement("p");
        todayUVI.setAttribute("class", "todayData");
        todayUVI.setAttribute("id", "todayUVI");
        todayUVI.setAttribute("style", "background-color: transparent")
        todayUVI.innerHTML = `UV Index: `;
        todayForecast.appendChild(todayUVI);
        // This adds the actual number for the UV Index.
        UVIvalue = document.createElement("p");
        if (oneCallData.current.uvi < 3) {
            UVIvalue.setAttribute("style", "display: inline; background-color: green; color: white");
        } else if (6 > oneCallData.current.uvi >= 3 ) {
            UVIvalue.setAttribute("style", "display: inline; background-color: yellow; color: white");
        } else {
            UVIvalue.setAttribute("style", "display: inline; background-color: red; color: white");
        };
        UVIvalue.setAttribute("id", "UVIvalue");
        UVIvalue.innerHTML = oneCallData.current.uvi
        todayUVI.appendChild(UVIvalue);
    } else {
        todayTemp.innerHTML = `Temp: ${oneCallData.current.temp}°F`;
        todayWind.innerHTML = `Wind: ${oneCallData.current.wind_speed} MPH`;
        todayHum.innerHTML = `Humidity: ${oneCallData.current.humidity}%`;
        todayUVI.innerHTML = `UV Index: `;
        todayUVI.appendChild(UVIvalue);
        UVIvalue.innerHTML = oneCallData.current.uvi;
    }


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


