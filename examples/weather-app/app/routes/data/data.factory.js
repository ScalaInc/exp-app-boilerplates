'use strict';

// factory for calling EXP-CORE data feed
app.factory('dataFactory', ['$http', 'config',
  function ($http, config) {

    var factory = {};
    factory.getScalaWeatherFeed = function () {

      var feedUrl = '/api/connectors/feeds/' + config.feed_configuration.uuid + '/data';
      var options = {
        crossDomain: true
      };

      // get the data from the scala feed connector
      return scala.api.get(feedUrl, options)
        .catch(function () {
          throw new Error('could not retrieve scala facebook data feed');
        });

    };

    return factory;

  }
]);
