"use strict"

let locationName = document.querySelector('.box__heading'),
    currentDate = document.querySelector('.box__date'),
    currentStatus = document.querySelector('.box__center--weatherStatus'),
    currentTemp = document.querySelector('.box__center--temp'),
    apparentTemp = document.querySelector('.box__indicators--apparentTemp'),
    currentPrecip = document.querySelector('.box__indicators--precip'),
    currentWind = document.querySelector('.box__indicators--wind');

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

    var icons = new Skycons({"color": changeCurrentColors(json.currently.icon)});
    var rainCon = new Skycons({"color": '#72bcd4' });
    var windCon = new Skycons({"color": '#99cc99'});
    
    icons.add('todaysIcon', json.currently.icon);
    icons.play();

    var sym;

    currentTemp.textContent = `${Math.round(json.currently.temperature)}° F`;
    updateSymbolVariable();

    currentStatus.textContent = json.currently.summary;
    apparentTemp.textContent = `${Math.round(json.currently.apparentTemperature)}° F`;

    currentPrecip.textContent = `${(json.currently.precipProbability*100)}%`;
    rainCon.add('windIcon', Skycons.RAIN);
    rainCon.play();
    
    currentWind.textContent = `${Math.round(json.currently.windSpeed)} Mph`
    windCon.add('rainIcon', Skycons.WIND);
    windCon.play();

    let selectAllTemps = [...document.querySelectorAll('.temp-conv')];
    // console.log();

    currentTemp.addEventListener("click", function f() {
      if(sym == "F") {
        for(let i = 0; i < selectAllTemps.length; i++) {
          let c = `${convertDegrees(sym, selectAllTemps[i].textContent.match(/\d{1,3}/)[0])}° C`;
          selectAllTemps[i].textContent = c;          
        }
        updateSymbolVariable();
      } else {
        for(let i = 0; i < selectAllTemps.length; i++) {
          let f = `${convertDegrees(sym, selectAllTemps[i].textContent.match(/\d{1,3}/)[0])}° F`;
          selectAllTemps[i].textContent = f;          
        }
        updateSymbolVariable();
      }
    });

        
    currentTemp.addEventListener("mouseover", function(e) {   
      // highlight the mouseover target
      e.target.style.color = "#72bcd4";
    });
    
    
    currentTemp.addEventListener("mouseout", function(e) {   
      // highlight the mouseover target
      e.target.style.color = "black";
      e.target.style.transitionDuration = ".8s";
    });
    
    createForecast(json.daily.data);
    
     
    function updateSymbolVariable() {
      sym = currentTemp.textContent[currentTemp.textContent.length-1];
    }   
    
    // Change color of icons to black if they are night-time icons
    function changeCurrentColors(icon) {
      if(icon == "clear-night" || icon == "partly-cloudy-night") {
        return 'black';
      } else {
        return '#E3DB25';
      }
    }
    
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

    // #f6f314
    // #E8EA3A
    var dailyIcon = new Skycons({"color": "#E3DB25"});
    dailyIcon.add(`icon${i}`, forecastData[i].icon);
    dailyIcon.play();
    
    document.querySelector(`.box__future--tempsHigh-${i}`).textContent = `${Math.round(forecastData[i].temperatureHigh)}° F`;
    document.querySelector(`.box__future--tempsLow-${i}`).textContent = `${Math.round(forecastData[i].temperatureLow)}° F`;
  }
}

function convertDegrees(symbol, value) {
  
  if(symbol == "F") {
     return Math.round(((value-32) * (5/9)));
     // currentTemp.textContent = `${Math.round(json.currently.temperature)}° F`
  }
  return Math.trunc((value * (9/5) + 32));
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