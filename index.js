const express = require('express'); // import the express package
const cors = require('cors');
const Axios =  require('axios');
require("dotenv").config();


const server = express(); // creates the server

// server.use(cors());

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// handle requests to the root of the api, the / route
server.get('/', (req, res) => {
  res.send('Hello from Express');
});

function makeCalls(number){
  number = parseInt(number)
  let arr = [];
  // for(let i = 0; i < number; i++){
  //   arr.push(`response number ${i}`);
  // }
  // // res.send(arr);
  // Axios.get(`https://api.random.org/json-rpc/1/invok/${process.env.RAND_KEY}/${number}/-90/90`)
  //   .then(response => {
  //     res.status(200).json(response);
  //   })
  //   .catch(error => {
  //     res.status(500).json(error);
  //   })

  // return arr;
}

server.get('/weather/:number', (req, res) => {
  let {number} = req.params;
  // let array = 
  // makeCalls(number);
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
      // console.log(response.data);
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
          console.log(lat_arr);
          console.log(lon_arr);
          let weather_arr = [];
          let i = 0;
          getWeatherData();
          async function getWeatherData(){
            console.log("in func");
            for(let i = 0; i < number; i++){
              console.log(i);
              Axios({
                method: 'get',
                url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat_arr[i]}&lon=${lon_arr[i]}&appid=${process.env.API_WEATHER_KEY}`
              }) 
                .then(aresponse => {
                  // i++; 
                  console.log("res", aresponse.data);
                  weather_arr.push(aresponse);
                  // console.log("comp loop", i, weather_arr.length);
                  // if(weather_arr.length == number){
                  //   // console.log("arrr", weather_arr);
                  //   console.log("w len", weather_arr.length);
                  //   res.status(200).json(weather_arr);
                  //   // console.log("hm");
                  // }
                       
                  })
                  .catch(error => {
                    res.status(500).json(`weather: ${error}`);
                  })
            }
            let results = await Promise.all(weather_arr);
            console.log("reses", results);
            res.status(200).json(results);
          }

          // console.log("arrr", weather_arr);
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