'use strict';

// define the facebook app and include libraries
var app = angular.module('socialMediaApp', ['ngRoute', 'ngMaterial', 'ngLodash', 'angular-loading-bar', 'ngAnimate', 'angular-wurfl-image-tailor']);

// define the routes
app.config(function ($routeProvider) {
  $routeProvider
    .when('/socialmedia/data',
    {
      controller: 'dataController',
      templateUrl: 'app/routes/data/data.html'
    })
    .when('/socialmedia/error',
    {
      controller: 'errorController',
      templateUrl: 'app/routes/error/error.html'
    })
    .otherwise(
    {
      redirectTo: '/socialmedia/data'
    });
});

// get app configuration information from EXP-CORE
(
  function () {
    window.addEventListener('scala', function () {
      // Get EXP-CORE config
      app.value('config', scala.app.config);
      // bootstrapping application
      angular.bootstrap(document.body, [app.name], {});
    });
  }()
);
