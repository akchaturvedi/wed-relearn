document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.querySelector(".Weather-input");
  const getWeatherBtn = document.querySelector(".get-weather");
  const WeatherInfo = document.querySelector(".weather-info");
  const citynameDisplay = document.querySelector(".cityname");
  const tempratureDisplay = document.querySelector(".city-temprature");
  const discriptionDisplay = document.querySelector(".discription");
  const errorMsgDisplay = document.querySelector(".error-msg");

  API_KEY = "1444aa8092bdf976c349f2f2cd0bb32b";

  getWeatherBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return;

    // now making web request -->

    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  });

  async function fetchWeatherData(city) {
    // get the data
    const URL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
    const response = await fetch(URL);
    // console.log(typeof response);
    console.log(response);

    if (!response.ok) {
      throw new Error("city not found");
    }
    const data = await response.json();

    return data;
  }

  function displayWeatherData(data) {
    // display machanism
    console.log(data);

    // const { name, main, weather } = data;
    // citynameDisplay.textContent = data.city.name;
    // const weather_main = data.list[0].main.temp;
    // const description_main = data.list[0].weather[0].description;
    // console.log(weather_main, description_main);
    // tempratureDisplay.textContent = `${weather_main - 273.15} °C`;
    // discriptionDisplay.textContent = description_main;

    //data destructuring based on api

    const {
      city: { name: cityName },
      list: [
        {
          main: { temp: weather_main },
          weather: [{ description: description_main }],
        },
      ],
    } = data;

    // Convert temperature from Kelvin to Celsius and format to 2 decimal places
    const formattedTemp = (weather_main - 273.15).toFixed(2);

    citynameDisplay.textContent = cityName;
    tempratureDisplay.textContent = `${formattedTemp} °C`;
    discriptionDisplay.textContent = description_main;

    console.log(formattedTemp, description_main);

    // unlock the display
    WeatherInfo.classList.remove("hidden");
    errorMsgDisplay.classList.add("hidden");
  }

  function showError() {
    WeatherInfo.classList.add("hidden");
    errorMsgDisplay.classList.remove("hidden");
  }
});
