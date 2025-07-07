const apiKey = "d2dab601d0eae5a749c42cb22a2beeff";
const apiUrl = "http://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    if (!city) {
        alert("Please provide a city name.");
        return;
    }

    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();
        console.log(data);

        // Check if API returned an error
        if (data.cod !== 200) {
            alert(`Error: ${data.message}`);
            return;
        }

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

        if(data.weather[0].main == "Clouds"){
            weatherIcon.src = "images/clouds.png";
        }
        else if(data.weather[0].main == "Clear"){
            weatherIcon.src = "images/clear.png";
        }
        else if(data.weather[0].main == "Rain"){
            weatherIcon.src = "images/rain.png";
        }
        else if(data.weather[0].main == "Drizzle"){
            weatherIcon.src = "images/drizzle.png";
        }
        else if(data.weather[0].main == "Mist"){
            weatherIcon.src = "images/mist.png";
        }
        else if(data.weather[0].main == "Snow"){
            weatherIcon.src = "images/snow.png";
        }

        document.querySelector(".weather").style.display = "block";
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to fetch weather data. Please check your internet connection.");
    }
}

searchBtn.addEventListener("click",()=>{
    checkWeather(searchBox.value);
})

// Always call with a valid city name:
