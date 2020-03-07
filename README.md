This server returns weather data for a chosen number of randomly selected gps coordinates
To Start This Server:

1) clone the repository
2) run 'npm install'
3) create a .env file
  4b) acquire an API key from random.org, put this in your env file as API_RAND_KEY=yourkeyhere
  4c) acquire an API key from openweathermap.org, put this in your env file as API_WEATHER_KEY=yourkeyhere
4) run 'node index.js'

The server should now be up and running.
Request can be made by downloading and running [this front end] (https://github.com/BlakeAnd/ag-eagle-eng-test-fe)
or,
by running the Back End server and typing /number_of_points_you_want_returned at the end of the url
