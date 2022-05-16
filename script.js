
var key = "8c07459f9be1805e0dcad855c72806f8";
var baseUrl = "https://api.openweathermap.org/data/2.5/weather?";


var stage1;
var stage2;
var stage3;
var url1;
var weather1;

const interval1 = setInterval(createLocalUrl, 3000);



const successCallback = (position) => {
  location = position;
  alert(location['name']);
  stage1 = true;
};
const errorCallback = (error) => {
  alert(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

function createLocalUrl(){
  if (stage1){
    let lat = location['coords']['latitude'];
    let lon = location['coords']['longitude'];
    alert(location['coords']['latitude']);
    url1 = `${baseUrl}&lat=${lat}&lon=${lon}&appid=${key}`;
    stage2 = true;
    const interval2 = setInterval(localWeather, 6000);
  }
}
function localWeather(){
  if (stage2){
    clearInterval(interval1);
    weather1 = getWeather('https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=8c07459f9be1805e0dcad855c72806f8');
    alert(wheather1);
    stage3 = true;
    const interval3 = setInterval(showWeather, 9000);
  }
}
function showWeather(){
  if (stage3){
    clearInterval(interval2);
    name = document.getElementById("name");
    name.innerHTML += ` weather1['name']`;
    clearInterval(interval3);
  }
}

function getData(url){
  fetch(url,{method:'POST', headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'User1'})}).then(res => {return res.json()})
  .then(data => console.log(data))
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


