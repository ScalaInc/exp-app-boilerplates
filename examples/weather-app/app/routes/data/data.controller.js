'use strict';

app.controller('dataController', ['$scope', '$interval', 'dataFactory', 'config', 'lodash', '$sce', 'windDirection', function ($scope, $interval, dataFactory, config, lodash, $sce, windDirection) {
  $scope.dataFeed = {};
  $scope.themeSelect = 'default';

  // format the weather feed data
  var formatData = function (tempFeed) {
    var dataFeed = {};
    dataFeed.city = (tempFeed.search.city + '(' + tempFeed.search.country + ')').toUpperCase();
    dataFeed.current_icon = 'app/assets/icons/' + config.icon_set + '/' + tempFeed.current_condition.icon + '.svg';

    if ((config.temperature === 'c') || (config.temperature !== 'f')) {
      dataFeed.current_temp = tempFeed.current_condition.temperature_c + '&#176;C';
      setTheme(tempFeed.current_condition.temperature_c, 'temperature_range_c');
    } else {
      dataFeed.current_temp = tempFeed.current_condition.temperature_f + '&#176;F';
      setTheme(tempFeed.current_condition.temperature_f, 'temperature_range_f');
    }

    dataFeed.current_hum = tempFeed.current_condition.humidity;

    if ((config.measurements === 'metric') || (config.measurements !== 'imperial')) {
      dataFeed.current_wind = tempFeed.current_condition.wind_kph + 'km/h';
    } else {
      dataFeed.current_wind = tempFeed.current_condition.wind_mph + 'mi/h';
    }

    dataFeed.current_wind_dir = getWindDirection(tempFeed.current_condition.wind_degrees);
    dataFeed.forecast = [];

    lodash.forEach(tempFeed.forecast, function (forecast_item) {
      var forecast = {};
      forecast.date = forecast_item.date;
      forecast.date_format = config.date_format;
      forecast.icon = 'app/assets/icons/' + config.icon_set + '/' + forecast_item.icon + '.svg';
      if ((config.temperature === 'c') || (config.temperature !== 'f')) {
        forecast.minmax = '&nbsp;' + forecast_item.temperature.low_c + '&#176;C' + '/' + forecast_item.temperature.high_c + '&#176;C';
      } else {
        forecast.minmax = '&nbsp;' + forecast_item.temperature.low_f + '&#176;F' + '/' + forecast_item.temperature.high_f + '&#176;F';
      }

      dataFeed.forecast.push(forecast);
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

  // get the wind direction description on the degrees
  var getWindDirection = function (degrees) {
    var windName = '';

    if (typeof degrees !== 'undefined') {

      lodash.forEach(windDirection.direction_list, function (item) {

        if ((Number(degrees) >= Number(item.start)) && (Number(degrees) <= Number(item.end))) {
          windName = item.name;
        }

      });

    } else {
      windName = '';
    }

    return windName;
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

