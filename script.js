var key = "8c07459f9be1805e0dcad855c72806f8";
var baseUrl = "https://api.openweathermap.org/data/2.5/weather?";


var stage1;
var stage2;
var stage3;
var url1;
var weather1;

const interval1 = setInterval(createLocalUrl, 1000);
const interval2 = setInterval(localWeather, 1000);
const interval3 = setInterval(showWeather, 1000);

const successCallback = (position) => {
  location = position;
  stage1 = true;
};
const errorCallback = (error) => {
  alert(error);
  console.log(error);
};



function createLocalUrl(){
  if (stage1){
    let lat = location['coords']['latitude'];
    let lon = location['coords']['longitude'];
    url1 = `${baseUrl}&lat=${lat}&lon=${lon}&appid=${key}`;
    stage2 = true;
    clearInterval(interval1);
  }
}
function localWeather(){
  if (stage2){
    weather1 = getWeather(url1);
    stage3 = true;
    clearInterval(interval2);
  }
}
function showWeather(){
  if (stage3){
    name = document.getElementById("name");
    name.innerHTML += ` weather1['name']`;
    clearInterval(interval3);
  }
}

function getData(url){
  fetch(url,{method:'POST', headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'User1'})}).then(res => {return res.json()})
  .then(data => weather1)
  .catch(error => alert(error))
}

async function getWeather(url){
  alert(url);
  let response = fetch(url);
  alert(response.status);
  console.log(response.status);
  let data = await response.json();
  if (response.state === 200){
    console.log("buzz off");
    let data = await response.json();
  }
  return data;
}


navigation.getCurrentPosition(successCallback, errorCallback);
