'use strict';

// factory for calling EXP-CORE data feed
app.factory('dataFactory', ['$http', 'config', 'url',
  function ($http, config, url) {

    var factory = {};
    factory.getScalaWeatherFeed = function () {
      return $http({
        url: url + '/' + config.feed_configuration.path + '/' + config.feed_configuration.search_id,
        method: 'GET',
        crossDomain: true
      }).success(function (data, status) {
        var returnObject = {};
        returnObject.data = data;
        returnObject.status = status;
        return returnObject;
      }).error(function (status) {
        var returnObject = {};
        returnObject.data = {error: 'could not retrieve scala facebook data feed '};
        returnObject.status = status;
        return status;
      });
    };

    return factory;

  }
]);
