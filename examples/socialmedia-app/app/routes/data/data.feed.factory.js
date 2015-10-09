'use strict';

app.factory('feedFactory', ['$http', 'config',
  function ($http, config) {
    var factory = {};

    factory.getScalaSocialMediaFeed = function () {

      var feedUrl = '/' + config.feed_configuration.path + '/' + config.feed_configuration.uuid + '/data';
      var params = {
        crossDomain: true
      };

      // get the data from the scala feed connector
      return scala.api.get(feedUrl, params)
        .catch(function () {
          throw new Error('could not retrieve scala facebook data feed');
        });

    };

    return factory;
  }
]);
