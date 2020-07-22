const express = require('express'); // import the express package
const cors = require('cors');
const Axios =  require('axios');
require("dotenv").config();


const server = express(); // creates the server

server.use(cors());

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000", "https://weather-rand.netlify.app");
  next();
});

// handle requests to the root of the api, the / route
server.get('/', (req, res) => {
  res.send('Hello from Express');
});

server.get('/weather/:number', (req, res) => {
  let {number} = req.params;
  number = parseInt(number);
  //this is the call for getting random latitude points
  let lat_arr = null;
  let lon_arr = null;
  let rand_api_promises = [];
  // let api2_promise= [];
  getRandomCoords();
  async function getRandomCoords(){ //this is an async function that makes both of the random number api calls then moves on after the response of whichever one takes longer
    rand_api_promises.push(
      Axios({ 
        method: 'get',
        url: 'https://api.random.org/json-rpc/1/invoke',
        data: {
              jsonrpc: "2.0",
        method: "generateIntegers",
        params: {
            apiKey: process.env.API_RAND_KEY,
            n: number,
            min: -90,
            max: 90,
            replacement: true
        },
        id: 42
        }
      }) 
        .then(response => {
          lat_arr = response.data.result.random.data;
          
          })
          .catch(error => {
            response.status(500).json("rand1");
          })
    );
    rand_api_promises.push(
      Axios({
        method: 'get',
        url: 'https://api.random.org/json-rpc/1/invoke',
        data: {
              jsonrpc: "2.0",
        method: "generateIntegers",
        params: {
            apiKey: process.env.API_RAND_KEY,
            n: number,
            min: -80,
            max: 180,
            replacement: true
        },
        id: 42
        }
      }) 
      .then(response => {
          lon_arr = response.data.result.random.data;
      
      })
      .catch(function(error) {
            response.status(500).json("rand2");
      })
    );
    await Promise.all(rand_api_promises).then(() => { //this awaits the response of whichever rand_api_promise takes longest
      let weather_arr = [];
      let promises = [];
      getWeatherData();
      async function getWeatherData(){ //this calls the weather data api in parallel with all random lats and lons, then await the responses
        for(let i = 0; i < number; i++){
          // console.log("i:", i);
          promises.push(
          Axios({
            method: 'get',
            url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat_arr[i]}&lon=${lon_arr[i]}&appid=${process.env.API_WEATHER_KEY}`
          })
            .then(aresponse => {
              weather_arr.push(aresponse.data); //push every response from the weather api onto an array so it can be sent back in once piece
              })
              .catch(error => {
                res.status(500).json(`weather: ${error}`);
              })
            );
        }
        await Promise.all(promises).then(() => { //once we have all the api data, we return the array we generated
          res.status(200).json(weather_arr);
        });
      }
    });

  };

  
});

// watch for connections on port 5000
server.listen(5000, () =>
  console.log('Server running on http://localhost:5000')
);






