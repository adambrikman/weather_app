"use strict"

let locationName = document.querySelector('.box__current--heading'),
    currentDate = document.querySelector('.box__current--date'),
    currentStatus = document.querySelector('.box__current--weatherStatus'),
    currentTemp = document.querySelector('.box__current--temp'),
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
    
    console.log(json);
    
    locationName.textContent = `${city}, ${state}`;
    currentDate.textContent = currDateString;
    
    var icons = new Skycons({"color": "black"});
    var rainCon = new Skycons({"color": "black"});
    var windCon = new Skycons({"color": "black"});
    
    icons.add('todaysIcon', json.currently.icon);
    icons.play();

    currentStatus.textContent = json.currently.summary;
    currentTemp.textContent = `${Math.round(json.currently.temperature)}° F`;

    currentPrecip.textContent = `${(json.currently.precipProbability*100)}%`;
    rainCon.add('rainIcon', Skycons.WIND);
    rainCon.play();
    
    currentWind.textContent = `${Math.round(json.currently.windSpeed)} Mph`
    windCon.add('windIcon', Skycons.RAIN);
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

    var dailyIcon = new Skycons({"color": "black"});
    dailyIcon.add(`icon${i}`, forecastData[i].icon);
    dailyIcon.play();
    
    document.querySelector(`.box__future-${i}--temps`).textContent = 
      `${Math.round(forecastData[i].temperatureHigh)}° F / ${Math.round(forecastData[i].temperatureLow)}° F`;
  }
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