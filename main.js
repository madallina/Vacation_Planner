const apiKey = "edb12adc1f574778b9e164024232911";
const apiUrl = "http://api.weatherapi.com/v1/forecast.json";
document.getElementById("search-btn").addEventListener("click", function () {
  const selectedZone = document.getElementById("zoneSelector").value;
  

  searchCitiesByZone(selectedZone);

  
});

const zones = {
  Asia: ["Beijing", "Tokyo", "Seoul", "Bangkok", "Singapore", "Mumbai"],
  SouthAmerica: ["Bogotá","Quito","Lima","Buenos Aires","Santiago","Montevideo"],
  NorthAmerica: ["Toronto","New York City","Chicago","Ciudad de México","Guatemala City","San Salvador"],
  Europe: ["Stockholm", "Oslo", "Helsinki", "Athens", "Rome", "Lisbon"],
  Australia: ["Brisbane", "Perth", "Darwin", "Sydney", "Melbourne", "Adelaide"],
};
let stoc = [];
let filteredCities = [];

function searchCitiesByZone(zoneName) {
  filteredCities = [];
  stoc=[];
  
  
  const selectedZone = zones[zoneName];
  

  if (selectedZone) {
    const promises = selectedZone.map((el) => {
      return fetch(`${apiUrl}?key=${apiKey}&q=${el}&days=5&aqi=no&alerts=no`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((val) => {
          stoc.push(val);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });

    Promise.all(promises)
    .then(() => {
      filterCitiesByTemperature(stoc);

    })
    .catch((error) => {
      console.error("Error during Promise.all:", error);
    });

    
  }
}
function filterCitiesByTemperature(val) {
  // debugger
  let searchInputTxt = document.getElementById("search-input").value.trim();

  if(searchInputTxt){
    
    val.forEach(val => {
      
      let currentCity = val.location.name;
      const isValid = val.forecast.forecastday.every(
        (item) => item.day.maxtemp_c > searchInputTxt
        );
        if (isValid) {
          filteredCities.push(currentCity);
        }
        
        
        
      })
      renderResult(filteredCities,val);
    }else{
      alert("Please enter a value for temperature!");
    }
    
}

function renderResult(nameOfCities, weatherData) {
  const prevResultContainer = document.querySelector(".filtered-cities");
  if (prevResultContainer) {
    prevResultContainer.remove();
  }
  const resultContainer = document.createElement("div");
  resultContainer.classList.add("filtered-cities");
  const resultList = document.createElement("ul");

  nameOfCities.forEach((city) => {
    const item = document.createElement("li");
    item.textContent = city;
    const cityWeatherData = weatherData.find((data) => data.location.name === city);

    if (cityWeatherData && cityWeatherData.forecast && cityWeatherData.forecast.forecastday) {
      const forecast = cityWeatherData.forecast.forecastday;

      const dayItem = document.createElement("div");
      dayItem.classList.add("weather-week");

      forecast.forEach((day) => {
        const weatherDay=document.createElement("div");
        weatherDay.classList.add("weather-day");
        const weatherIcons = day.day.condition.icon;
        const maxT=day.day.maxtemp_c;
        const maxTemp=document.createElement("h5");
        maxTemp.textContent=maxT + "°C";
        const iconElement = document.createElement("img");
        iconElement.src = "https:" + weatherIcons;
        iconElement.alt = city + " Weather Icon";
        weatherDay.appendChild(iconElement);
        weatherDay.appendChild(maxTemp);
        dayItem.appendChild(weatherDay);
      });

      item.appendChild(dayItem);
    }

    resultList.appendChild(item);
  });

  resultContainer.appendChild(resultList);
  document.body.appendChild(resultContainer);
}
