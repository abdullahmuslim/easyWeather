var key = "8c07459f9be1805e0dcad855c72806f8";
var callBaseUrl = "https://api.openweathermap.org/data/2.5/onecall?";
var cordBaseUrl = "https://api.openweathermap.org/geo/1.0";
var revCoding = "https://api.openweathermap.org/data/2.5/weather?";
var unit = "metric";
var msg = document.getElementById("msgBox");
var units = ["°c", "m/s"];

function search(searchId){
  let value = document.getElementById(searchId).value;
  if (value ===""){
    msg.innerHTML = "search input can't be empty.";
  }
  else if(! value.match(/[a-zA-z]/)){
    getCordWther(value, 0, "s", "all");
  }else{
    if (value.match(/[0-9].+[a-zA-z]$/)){
      //zip code
      getZipData(value, 0, "s", "all");
    }else{
      getCityData(value, 0, "s", "all");//city name
    }
  }
}



function getCordWther(cords, index, target, option){
  cords = cords.replace(/ +/g, ',');
  cords = cords.replace(/,+/g, ',');
  cords = cords.split(",");
  let lat = cords[0];
  let lon = cords[1];
  let url = `${revCoding}lat=${lat}&lon=${lon}&appid=${key}`;
  fetch(url).then(res => {
    if(res.status == 200){
      message("success");
      delay(2500);
      return res.json();
}else if(res.status == 504){
      message ("server timeout");
      delay(2500);
      return res.json();
      }
  }).then(cords => {
    cords["country"] = [cords.sys.country];
    fill(cords, index, target, option);
  }).catch(err => {message("an error occurred")});
}
function getZipData(zipCode, index, target, option){
  zipCode = zipCode.replace(/ +/g, ',');
  zipCode = zipCode.replace(/,+/g, ',');
  zipCode = zipCode.split(',');
  let zip = zipCode[0];
  let country = zipCode[1].toUpperCase();
  let url = `${cordBaseUrl}/zip?zip=${zip},${country}&appid=${key}`;
  fetch(url).then(res => {
    if(res.status == 200){
      message("success");
      delay(2500);
      return res.json();
}else if(res.status == 504){
      message ("server timeout");
      delay(2500);
      return res.json();
      }
  }).then(cords => {
    cords = [cords];
    fill(cords, index, target, option);
  }).catch(err => {message("an error occurred");
    delay(5000);
  });
}

function getCityData(cityName, index, target, option){
  let allow = true;
  if ( cityName.includes(",") === false){
    cityName = cityName.replace(/ +/g, ',');
    cityName = cityName.replace(/,+/g, ',');
    cityName = cityName.split(',');
  }else{
    cityName = cityName.replace(/, +/g, ",");
    cityName = cityName.split(',');
  }
  if(cityName.length == 3){
    cityName[2] = cityName[2].toUpperCase();
    if (cityName[2] != "US"){
      cityName.splice(1,1);
      msg.innerHTML = `Only US cities can have additional state code. fetching weather for ${cityName}`;
    }
  }
  else if (cityName.length == 2){
    cityName[1] = cityName[1].toUpperCase();
  }
  else if (cityName.length > 3 && cityName.includes(",") === false){
    cityName.splice(1,-2);
    msg.innerHTML = "too many search input, consider seperating with comma.";
    allow = false;
  }
  if (allow){
    url = `${cordBaseUrl}/direct?q=${cityName}&appid=${key}`;
    fetch(url).then(res => {
      if(res.status == 200){
      message("success");
      delay(2500);
      return res.json();
}else if(res.status == 504){
      message ("server timeout");
      delay(2500);
      return res.json();
      }
    }).then(cords => {
      fill(cords, index, target, option);
    }).catch(err =>
    {message("an error occurred");
      delay(2500);
    });
  }
}
function fill(cords, index, target, option){
  getWther(cords, index, target, option);
}
function currentFill(data, index, target){
  document.getElementById(target).style.display = "block";
  let country = document.getElementsByClassName("cCountry");
  country = country[index];
  let citytime = document.getElementsByClassName("cCitytime");
  citytime = citytime[index]
  citytime = citytime.children;
  let sun = document.getElementsByClassName("cSun");
  sun = sun[index].children;
  let cdata = document.getElementsByClassName("cData");
  cdata = cdata[index].children;
  let temp = document.getElementsByClassName("cTemp");
  temp = temp[index].children;
  let time = new Date(data[1][0]["current"]["dt"]);
  let rise = new Date(data[1][0]["current"]["sunrise"]);
  let sset = new Date(data[1][0]["current"]["sunset"]);
  let container = [country,citytime[0],citytime[1],sun[0],sun[1],cdata[1],cdata[2],cdata[3],cdata[4],cdata[5],temp[0],temp[1],cdata[7],cdata[8], cdata[9]];
  let filldata = [`Country:&nbsp;${data[0][0]["country"]}`,`${data[0][0]["name"]}`,`${time.getHours()}&nbsp;:&nbsp;${time.getMinutes()}`,`&#127749;&nbsp;Sunrise: ${rise.getHours()}&nbsp;:&nbsp;${rise.getMinutes()}`,`&#127751;&nbsp;Sunset: ${sset.getHours()}&nbsp;:&nbsp;${sset.getMinutes()}`, `&#9729;&nbsp;Weather: ${data[1][0]["current"]["weather"][0]["main"]}`, `&#9729;&nbsp;Description: ${data[1][0]["current"]["weather"][0]["description"]}`,`&#127787;&nbsp;Visibility: ${data[1][0]["current"]["visibility"]} meters`, `&#127745;&nbsp;Humidity: ${data[1][0]["current"] ["humidity"]}%`, `&#128167;&nbsp;Dew&nbsp;point: ${data[1][0]["current"] ["dew_point"]}${units[0]}`, `&#127777;&nbsp;Temperature:&nbsp;${data[1][0]["current"]["temp"]}${units[0]}`, ` feels&nbsp;like&nbsp;${data[1][0]["current"]["feels_like"]}${units[0]}`, `&#127744;&nbsp;Wind&nbsp;speed ${data[1][0]["current"]["wind_speed"]}${units[1]}`, `&#10036;&nbsp;Wind&nbsp;Direction ${data[1][0]["current"]["wind_deg"]}°`,`&#127786;&nbsp;Wind Gust: ${data[1][0]["current"]["wind_gust"]}${units[1]}`];
  for (let i = 0;i < filldata.length;i++){
    container[i].innerHTML = filldata[i];
  }
}

function getWther(cords, index, target, option){
  let lat;
  let lon;
  try {
    lon = cords[0]["lon"];
    lat = cords[0]["lat"];
    cords = cords[0];
  } catch (TypeError) {
    lon = cords["coord"]["lon"];
    lat = cords["coord"]["lat"];
  }
  let url = `${callBaseUrl}lat=${lat}&lon=${lon}&units=${unit}&appid=${key}`;
  fetch(url).then(res => {
    if(res.status == 200){
      message("success");
      delay(2500);
      return res.json();
}else if(res.status == 504){
      message ("server timeout");
      delay(2500);
      return res.json();
      }
  }).then(data => {
    comData = [[cords],[data]];
    switch (target) {
      case 'c':
        if(comData[1][0]["current"] != undefined){
          currentFill(comData, index, 'cc');
        }
        if (comData[1][0]["minutely"] != undefined){
          forecastMinFill(comData, index, 'fmc');
        }else{
          document.getElementById("fmc").style.display = "block";
          document.getElementById("fmc").innerHTML = "minute forecasting not available for this location";
        }
        if (comData[1][0]["hourly"] != undefined){
          forecastHourFill(comData, index, 'fhc');
        }
        if (comData[1][0]["daily"] != undefined){
          forecastDailyFill(comData, index, 'fdc');
        }
        break;
      case 's':
        if(comData[1][0]["current"] != undefined){
          currentFill(comData, index, 'cs');
        }
        if (comData[1][0]["minutely"] != undefined){
          forecastMinFill(comData, index, 'fms');
        }
        if (comData[1][0]["hourly"] != undefined){
          forecastHourFill(comData, index, 'fhs');
        }
        if (comData[1][0]["daily"] != undefined){
         forecastDailyFill(comData, index, 'fds');
        }
        break;
      
      default:
        // code
    }
  }).catch(err => {message("an error occurred")});
}
function forecastMinFill(data, index, target){
  document.getElementById(target).style.display = "block";
  let country = document.getElementsByClassName("fmCountry");
  let citytime = document.getElementsByClassName("fmCitytime");
  citytime = citytime[index].children;
  country = country[index];
  let time = new Date(data[1][0]["minutely"][0]["dt"]);
  let minData = document.getElementsByClassName("mindata");
  let fmData = minData[index].children;
  let fillData = [`Country: ${data[0][0]["country"]}`,`${data[0][0]["name"]}`, `${time.getHours()}&nbsp;:&nbsp;${time.getMinutes()}`];
  let container = [country, citytime[0], citytime[1]];
  let counter = 3;
  for (let i = 0; i < fmData.length; i++){
    let com = fmData[i].children;
    container[counter] = com[0];
    container[counter + 1] = com[1];
    counter += 2;
  }
  let fmfill = data[1][0]["minutely"];
  counter = 3;
  for (let i = 0; i < fmfill.length; i++){
    let time = new Date(fmfill[i]["dt"]);
    fillData[counter] = [`${time.getHours()}&nbsp;:&nbsp;${time.getMinutes()}`];
    fillData[counter + 1] = [`${fmfill[i]["precipitation"]}`];
    counter += 2;
  }
  
  for (let i = 0; i < container.length; i++){
    container[i].innerHTML = fillData[i];
  }
}
function forecastHourFill(data, index,target){
  document.getElementById(target).style.display = "block";
  let country = document.getElementsByClassName("fhCountry");
  country = country[index];
  let individual = document.getElementsByClassName("fhFlipdata");
  individual = individual[index].children;
  let container = [country];
  let place = 1;
  for (let i = 0; i < individual.length; i++){
    for (let j = 0; j < individual[i].children.length; j++){
      if (j === 0){
        container[place] = individual[i].children[j].children[0];
        container[place + 1] = individual[i].children[j].children[1];
        place += 2;
      }
      else if (j === 6){
        container[place] = individual[i].children[j].children[0];
        container[place + 1] = individual[i].children[j].children[1];
        place += 2;
      }else{
        container[place] = individual[i].children[j];
        place++;
      }
    }
  }
  place = 1;
  let hourdata = data[1][0]["hourly"];
  let fillData = [`Country: ${data[0][0]["country"]}`];
  for (let i = 0; i < individual.length; i++){
    let time = new Date(hourdata[i]["dt"]);
    fillData[place] = `${data[0][0]["name"]}`;
    fillData[place+1] = `${time.getHours()}&nbsp;:&nbsp;${time.getMinutes()}`;
    fillData[place+2] = `&#9729;&nbsp;Weather: ${hourdata[i]["weather"][0]["main"]}`;
    fillData[place+3] = `&#9729;Description: ${hourdata[i]["weather"][0]["description"]}`;
    fillData[place +4] = `&#127787;&nbsp;Visibility: ${hourdata[i]["visibility"]} meters`;
    fillData[place+5] = `&#127745;&nbsp;Humidity: ${hourdata[i]["humidity"]}%`;
    fillData[place+6] = `&#128167;&nbsp;Dew&nbsp;point: ${hourdata[i]["dew_point"]}${units[0]}`;
    fillData[place+7] = `&#127777;&nbsp;Temperature:&nbsp;${hourdata[i]["temp"]}${units[0]}`;
    fillData[place+8] = `Feels&nbsp;like:&nbsp;${hourdata[i]["feels_like"]}${units[0]}`;
    fillData[place+9] = `&#127744;&nbsp;Wind&nbsp;speed: ${hourdata[i]["wind_speed"]}${units[1]}`;
    fillData[place+10] = `&#10036;&nbsp;Wind&nbsp;direction: ${hourdata[i]["wind_deg"]}°`;
    place += 11;
  }
  for (let i = 0; i < container.length; i++){
    container[i].innerHTML = fillData[i];
  }
}
function forecastDailyFill(data, index, target){
  document.getElementById(target).style.display = "block";
  let country = document.getElementsByClassName("fdCountry");
  country = country[index];
  let container = [country];
  let individual = document.getElementsByClassName("fdData");
  individual = individual[index].children;
  let place = 1;
  for (let i = 0; i < individual.length; i++){
    for (let j = 0; j < individual[i].children.length; j++){
      if (j === 0){
        container[place] = individual[i].children[j].children[0];
        container[place +1] = individual[i].children[j].children[1];
        place += 2;
      }else if (j === 1){
        container[place] = individual[i].children[j].children[0];
        container[place+1] = individual[i].children[j].children[1];
        place += 2;
      }else if (j === 7){
        let base = individual[i].children[j].children[1];
        container[place] = individual[i].children[j].children[0];
        container[place+1] = base.children[0].children[0];
        container[place+2] = base.children[0].children[1];
        container[place+3] = base.children[1].children[0];
        container[place+4] = base.children[1].children[1];
        container[place+5] = base.children[2].children[0];
        container[place+6] = base.children[2].children[1];
        place += 7;
      }else{
        container[place] = individual[i].children[j];
        place++;
      }
    }
  }
  let fillData = [`Country: ${data[0][0]["country"]}`];
  base = data[1][0]["daily"];
  place = 1;
  for (let i = 0; i < individual.length; i++){
    let time = new Date(base[i]["dt"]);
    let time1 = new Date(base[i]["sunrise"]);
    let time2 = new Date(base[i]["sunset"]);
    fillData[place] = `${data[0][0]["name"]}`;
    fillData[place+1] = `${time.getDay()}`;
    fillData[place+2] = `&#127749;&nbsp;Sunrise: ${time1.getHours()}&nbsp;:&nbsp;${time1.getMinutes()}`;
    fillData[place+3] = `&#127751;&nbsp;Sunset: ${time2.getHours()}&nbsp;:&nbsp;${time2.getMinutes()}`;
    fillData[place+4] = `&#9729;&nbsp;Weather: ${base[i]["weather"][0]["main"]}`;
    fillData[place+5] = `&#9729;&nbsp;Description: ${base[i]["weather"][0]["description"]}`;
    fillData[place+6] = ``;
    fillData[place+7] = `&#127745;&nbsp;Humidity: ${base[i]["humidity"]}%`;
    fillData[place+8] = `&#128167;&nbsp;Dew&nbsp;point: ${base[i]["dew_point"]}${units[0]}`;
    fillData[place+9] = `&#127777;&nbsp;Temperature`;
    fillData[place+10] = `Day:&nbsp;${base[i]["temp"]["day"]}${units[0]}`;
    fillData[place+11] = `Night:&nbsp;${base[i]["temp"]["night"]}${units[0]}`
    fillData[place+12] = `Morn:&nbsp;${base[i]["temp"]["morn"]}${units[0]}`;
    fillData[place+13] = `Eve:&nbsp;${base[i]["temp"]["eve"]}${units[0]}`;
    fillData[place+14] = `Min:&nbsp;${base[i]["temp"]["min"]}${units[0]}`;
    fillData[place+15] = `Max:&nbsp;${base[i]["temp"]["max"]}${units[0]}`;
    fillData[place+16] = `&#127744;&nbsp;Wind&nbsp;speed: ${base[i]["wind_speed"]}${units[1]}`;
    fillData[place+17] = `&#10036;&nbsp;Wind&nbsp;direction ${base[i]["wind_deg"]}°`;
    
    place += 18;
  }
  for (let i = 0; i < container.length; i++){
    container[i].innerHTML = fillData[i];
  }
}
const successCallback = (position) => {
  let pos = position.coords;
  let value = `${pos.latitude} ${pos.longitude}`;
  msg.innerHTML = JSON.stringify(value);
  getCordWther(value, 1, 'c', 'all');
}
const errorCallback = (error) => {
  message(error);
  delay(6000);
  message("error using built-in location navigator.\n 'using estimated location'");
  delay(9000);
  useAlt();
}
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

window.onload = function(){
  if('geolocation' in navigator){
    message("geolocation is available, ensure you turn on device location for the app to run");
    delay(9000);
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
  }else{
    message("geolocation not available\n using estimated geolocation");
    delay(5000);
    useAlt();
  }
}

function useAlt(){
  fetch("https://ipwho.is").then(res => {
    if(res.status == 200){
      message("success");
      delay(2500);
      return res.json();
}else if(res.status == 504){
      message ("server timeout");
      delay(2500);
      return res.json();
      }
  }).then(cords => {
    cords = `${cords["latitude"]} ${cords["longitude"]}`;
    getCordWther(cords, 1, 'c', 'all')
  }).catch(err => {
    message("an error occurred");
    delay(2500);
  });
}
function delay(n){
  start = new Date().getTime();
  end = start + n*1000;
  while(start < end){
    start += 1;
  }
}

function message(text){
  let div = document.createElement("div");
  text = document.createTextNode(text);
  div.appendChild(text);
  div.id = "messg";
  let old = document.getElementById("messg");
  old.parentNode.replaceChild(div, old);
  div = document.getElementById("messg");
  let body = document.getElementsByTagName("body")[0];
  div = window.getComputedStyle(div);
  div = div.width;
  let screen = window.getComputedStyle(body);
  screen = screen.width;
  let leftSpace = (parseInt(screen) - parseInt(div))/2;
  document.getElementById("messg").style.left = leftSpace.toString();
}

function change(){
  let type = document.getElementById("type");
  if(! type.checked === true){
    document.getElementById("currentWther").style.display = "none";
    document.getElementById("forecast").style.display = "block";
  }else{
    document.getElementById("currentWther").style.display = "flex";
    document.getElementById("forecast").style.display = "none";
  }
}

function toggleMode(){
  let selection = document.getElementById("toggleMode");
  let child = selection.value;
  let min = document.getElementById("min").style;
  let hour = document.getElementById("hour").style;
  let daily = document.getElementById("daily").style;
  switch (child) {
    case 'min':
      min.display = "block";
      hour.display = "none";
      daily.display = "none";
      break;
    case 'hour':
      hour.display = "block";
      min.display = "none";
      daily.display = "none";
      break;
    case 'daily':
      daily.display = "block";
      min.display = "none";
      hour.display = "none";
      break;
    default:
      min.display = "block";
      hour.display = "none";
      daily.display = "none";
      break;
  }
}
function toggleoption(){
  let target = document.getElementById("toggle");
  if (target.checked === true){
    let option = document.getElementById("options");
    option.style.position = "fixed";
    option.style.left = "0";
    option.style.transition = "left 0.2s ease-in-out";
    option.style.zIndex = "2";
  }
  else if (target.checked === false){
    let option = document.getElementById("options");
    option.style.position = "fixed";
    option.style.left = "-150vw"
    option.style.transition = "left 2s ease-in-out";
    option.style.zIndex = "2";
  }
}
function cancHelp(){
  document.getElementById("help").style.display = "none";
}
function cancAbout(){
  document.getElementById("about").style.display = "none";
}
function cancContact(){
  document.getElementById("contact").style.display = "none";
}
function help(){
  document.getElementById("help").style.display = "block";
  document.getElementById("help").style.zIndex = "3";
}
function about(){
  document.getElementById("about").style.display = "block";
  document.getElementById("about"). style.zIndex = "3";
}
function contact(){
  document.getElementById("contact").style.display = "block";
  document.getElementById("contact").style.zIndex = "3";
}
function wtherForecast(){
  document.getElementById("currentWther").style.display = "none";
  document.getElementById("forecast").style.display = "block";
  document.getElementById("toggle").checked = false;
  let option = document.getElementById("options");
  option.style.position = "fixed";
  option.style.left = "-150vw";
  option.style.transition = "left 2s ease-in-out";
}
