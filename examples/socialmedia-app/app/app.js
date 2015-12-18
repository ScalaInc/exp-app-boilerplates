'use strict';

// define the facebook app and include libraries
var app = angular.module('socialMediaApp', ['ngRoute', 'ngMaterial', 'ngLodash', 'angular-loading-bar', 'ngAnimate', 'angular-wurfl-image-tailor']);

// define the routes
app.config(function ($routeProvider) {
  $routeProvider
    .when('/socialmedia/main',
    {
      controller: 'mainController',
      templateUrl: 'app/routes/main/main.html'
    })
    .otherwise(
    {
      redirectTo: '/socialmedia/main'
    });
});

// get app configuration information from EXP-CORE
(
  function () {
    window.addEventListener('scala', function () {
      window.exp = scala;
      app.value('config', scala.app.config);
      // bootstrapping application
      var elem = document.querySelector('.grid');

      angular.bootstrap(document.body, [app.name], {});
    });
  }()
);
