const apiKey = "d2dab601d0eae5a749c42cb22a2beeff";
const aipURL ="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

async function checkWeather(city){
    const response  = await fetch(apiUrl+city+`&appid = ${apiKey}`);

    var data = await response.json();
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
}

checkWeather();