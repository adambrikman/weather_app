"use strict"

let locationName = document.querySelector('.box__current--heading'),
    currentDate = document.querySelector('.box__current--date'),
    currentStatus = document.querySelector('.box__current--weatherStatus'),
    currentTemp = document.querySelector('.box__current--temp'),
    apparentTemp = document.querySelector('.box__current--apparentTemp'),
    currentPrecip = document.querySelector('.box__current--precip'),
    currentWind = document.querySelector('.box__current--wind');

// Temporary, not to overdraw API call
getWeather(36.1750, -115.1372, 'Las Vegas', 'Nevada');

function getWeather(lat, lon, city, state) {
  
  let date = new Date;

    var currDateString = date.toString()
    .slice(4,15)
    .replace(/\s/,', ');

  var k = '480116125360973e021906a2496e9911';
  var cross = 'https://cors-anywhere.herokuapp.com/';
  fetch(`${cross}https://api.darksky.net/forecast/${k}/${lat},${lon}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {       
    locationName.textContent = `${city}, ${state}`;
    currentDate.textContent = currDateString;
    
    // Change color of icons to black if they are night-time icons
    function changeCurrentColors(icon) {
      if(icon == "clear-night" || icon == "partly-cloudy-night") {
        return 'black';
      } else {
        return '"#f6f314';
      }
    }
    
    var icons = new Skycons({"color": changeCurrentColors(json.currently.icon)});
    var rainCon = new Skycons({"color": '#72bcd4' });
    var windCon = new Skycons({"color": '#99cc99'});
    
    icons.add('todaysIcon', json.currently.icon);
    icons.play();

    var sym, v;
    
    function setVars() {
      sym = currentTemp.textContent[currentTemp.textContent.length-1];
      v = currentTemp.textContent.match(/\d{1,3}/)[0];  
    }
    
    currentTemp.textContent = `${Math.round(json.currently.temperature)}° F`;
    setVars()

    currentTemp.addEventListener("click", function f() {
      if(sym == "F") {
        currentTemp.textContent = `${Math.round(convertDegrees(sym, v))}° C`;
        setVars()
      } else {
        currentTemp.textContent = `${Math.round(convertDegrees(sym, v))}° F`;
        setVars()
      }
    }  );
    
    currentStatus.textContent = json.currently.summary;
    apparentTemp.textContent = `Feels like: ${Math.round(json.currently.apparentTemperature)}° F`;

    currentPrecip.textContent = `${(json.currently.precipProbability*100)}%`;
    rainCon.add('windIcon', Skycons.RAIN);
    rainCon.play();
    
    currentWind.textContent = `${Math.round(json.currently.windSpeed)} Mph`
    windCon.add('rainIcon', Skycons.WIND);
    windCon.play();

    createForecast(json.daily.data);
    
  });

}

function createForecast(forecastData) {
  
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let dailyIndex;
  
  let date = new Date();
  let dateNumber = date.getDay();
      
  for(let i = 1; i <= 6; i++) {
    dailyIndex = dateNumber + i;
    if(dailyIndex > 6) {
      dailyIndex -= 7;
    }
    document.querySelector(`.box__future-${i} div`).textContent = days[dailyIndex];

    var dailyIcon = new Skycons({"color": "#f6f314"});
    dailyIcon.add(`icon${i}`, forecastData[i].icon);
    dailyIcon.play();
    
    document.querySelector(`.box__future-${i}--temps`).textContent = 
      `${Math.round(forecastData[i].temperatureHigh)}° F / ${Math.round(forecastData[i].temperatureLow)}° F`;
  }
}

function convertDegrees(symbol, value) {
  
  if(symbol == "F") {
     return Math.round(((value-32) * (5/9)));
     // currentTemp.textContent = `${Math.round(json.currently.temperature)}° F`
  }
  return Math.round((value * (9/5) + 32));
}

// fetch('https://ipinfo.io/json')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(json) {
//       var location = json.loc.split(","),
         // lat = location[0], lon = location[1],
         // city = json.city,
         // state = json.region;
//       getWeather(lat, lon, city, state);
//    });
/*
{
// 'https://ipinfo.io/json'
  "ip": "24.253.34.97",
  "hostname": "ip24-253-34-97.lv.lv.cox.net",
  "city": "Las Vegas",
  "region": "Nevada",
  "country": "US",
  "loc": "36.1750,-115.1372",
  "org": "AS22773 Cox Communications Inc.",
  "postal": "89111",
  "readme": "https://ipinfo.io/missingauth"
}
*/