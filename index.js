const express = require('express'); // import the express package
const cors = require('cors');
const Axios =  require('axios');
require("dotenv").config();


const server = express(); // creates the server

server.use(cors());

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

// handle requests to the root of the api, the / route
server.get('/', (req, res) => {
  res.send('Hello from Express');
});

server.get('/weather/:number', (req, res) => {
  let {number} = req.params;
  number = parseInt(number)
  console.log("num", number);
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
      let lat_arr = response.data.result.random.data;
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
          let lon_arr = response.data.result.random.data;
          let weather_arr = [];
          let promises = [];
          getWeatherData();
          async function getWeatherData(){
            for(let i = 0; i < number; i++){
              console.log("i:", i);
              promises.push(
              Axios({
                method: 'get',
                url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat_arr[i]}&lon=${lon_arr[i]}&appid=${process.env.API_WEATHER_KEY}`
              })
                .then(aresponse => {
                  weather_arr.push(aresponse.data);
                  })
                  .catch(error => {
                    res.status(500).json(`weather: ${error}`);
                  })
                );
            }
            await Promise.all(promises).then(() => {
              // console.log("all:", weather_arr);
              res.status(200).json(weather_arr);
            });
          }
          })
          .catch(function(error) {
            response.status(500).json("rand2");
          })
      })
      .catch(function(error) {
        response.status(500).json("rand1");
      })
  
});

// watch for connections on port 5000
server.listen(5000, () =>
  console.log('Server running on http://localhost:5000')
);