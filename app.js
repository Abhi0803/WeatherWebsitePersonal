const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/weather", function(req, res) {
  // res.sendFile(__dirname + "/pubic/weather.html");

  const cityName = req.body.cityName;
  const apiKey = "056ceaec162d84d33b4cb29dee7ef1d5";
  const units = "metric";
  const endPoint ="https://api.openweathermap.org/data/2.5/weather";
  const parameters = "?q=" + cityName + "&appid=" + apiKey + "&units=" + units;

  const url = endPoint + parameters;

  https.get(url, function(response){
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      console.log(weatherData.cod);

      if(weatherData.cod == 404)
      {
        res.sendFile(__dirname + "/failure.html");
      }
      else{
        const weatherIcon = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";
        const cityNamed = weatherData.name;
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const weatherMain = weatherData.weather[0].main;
        res.write("<!DOCTYPE html><html lang='en' dir='ltr'><head> <meta charset='utf-8'> <link rel='stylesheet' href='styles.css'> <title>Weather Report</title> <style>body{background-image: url('" + weatherMain +".jpg');}</style></head><body> <div class='"+ weatherMain +"'> <h1>" + cityNamed + "<br>" + temp +"°c</h1> <h1>" + cityNamed +" is in " + weatherDescription +"</h1> </div></body></html>");
        res.send();
      }

    })
  })
// <style>body{background-image: url('mist.jpg');}</style>
// API call = api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
})



app.listen(process.env.PORT || 3000, function(){
  console.log("Server Started");
});
