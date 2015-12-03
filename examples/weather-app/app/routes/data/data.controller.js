'use strict';

app.controller('dataController', ['$scope', '$interval', 'dataFactory', 'config', 'lodash', function ($scope, $interval, dataFactory, config, lodash) {
  $scope.dataFeed = {};
  $scope.themeSelect = 'default';

  // format the weather feed data
  var formatData = function (tempFeed) {
    var dataFeed = {};
    dataFeed.city = tempFeed.details.location;

    dataFeed.forecast = [];

    lodash.forEach(tempFeed.items, function (item) {

      if (item.type === 'forecast') {
        var forecast = {};
        forecast.date = item.date;
        forecast.date_format = config.date_format;
        forecast.icon = 'app/assets/icons/' + config.icon_set + '/' + item.raw.icon + '.svg';
        if (config.temperature !== 'f') {
          forecast.minmax = '&nbsp;' + item.raw.low.celsius + '&#176;C' + '/' + item.raw.high.celsius + '&#176;C';
        } else {
          forecast.minmax = '&nbsp;' + item.raw.low.fahrenheit + '&#176;F' + '/' + item.raw.high.fahrenheit + '&#176;F';
        }

        dataFeed.forecast.push(forecast);
      } else if (item.type === 'observation') {
        dataFeed.current_icon = 'app/assets/icons/' + config.icon_set + '/' + item.raw.icon + '.svg';

        if (config.temperature !== 'f') {
          dataFeed.current_temp = item.raw.temp_c + '&#176;C';
          setTheme(item.raw.temp_c, 'temperature_range_c');
        } else {
          dataFeed.current_temp = item.raw.temp_f + '&#176;F';
          setTheme(item.raw.temp_f, 'temperature_range_f');
        }

        dataFeed.current_hum = item.raw.relative_humidity;

        if (config.measurements !== 'imperial') {
          dataFeed.current_wind = item.raw.wind_kph + ' km/h';
        } else {
          dataFeed.current_wind = item.raw.wind_mph + ' mph';
        }

        dataFeed.current_wind_dir = item.raw.wind_dir;
      }

    });
    return dataFeed;
  };

  // Set theme on temperature
  var setTheme = function (temperature, property) {
    var lowerValue = -90;

    lodash.forEach(config[property], function (item) {

      if ((parseInt(temperature) > lowerValue) && (parseInt(temperature) <= parseInt(item.upper_value))) {
        $scope.themeSelect = item.theme;
        lowerValue = item.upper_value;
      }

    });

  };

  // get weather data from factory
  var callData = function () {
    return dataFactory.getScalaWeatherFeed()
      .then(function (result) {

          // adding async data to life cycle
          $scope.$evalAsync(function(){
            if ((typeof result !== 'undefined')) {
              $scope.dataFeed = formatData(result);
            } else {
              throw new Error('no data received');
            }
          });

      }
    );
  };

  // run initial data fetch and then do a automated polling every X seconds
  callData().then(function () {
      //run interval
      var intervalValue = parseInt(config.refresh_rate_seconds) * 1000;
      $interval(function () {
        callData();
      }, intervalValue);
    }
  );

}]);

