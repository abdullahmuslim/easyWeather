var key = "8c07459f9be1805e0dcad855c72806f8"
function stopValidation(){
  return false;
}

function validate(){
  let input = document.getElementById("search")
  if (input.value == ""){
    alert("search is empty");
    return false
  }else if(input.value.length < 2){
    alert("search too short");
    return false;
  }else{
    prepare();
    return true;
  }
}

function prepare(){
  let input = document.getElementById("search");
  if(input.value.includes(",")){
    alert("longitude shit");
    const DMS = input.value.split(",");
    const lat = DMS[0];
    const lon = DMS[1];
    search(lat, lon);
  }else if(isNum(input.value)){
    alert("postal");
  }
}

function isNum(text){
  let check = text.match(/\d+/g);
  if(check != null){
    return true;
  }else{
    return false;
  }
}
function search(lat, lon){
  let form = document.getElementById("form");
  var url = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon=" + lon + "&appid=" + key;
  getData(url);
}

function geData(url){
  let page = document.getElementById("p");
  page.innerHTML = url;
  alert("new " + url);
  fetch("https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=8c07459f9be1805e0dcad855c72806f8")
    .then(response => response.json())
    .then(data => console.log(data))
  .catch(err => console.log(err))
  
}
async function getData(url){
  let response = await fetch(url);
  alert(url);
  console.log(response.status);
  let data = await response.json();
  if (response.state === 200){
    let data = await response.json();
  }
  alert(data["name"]);
}