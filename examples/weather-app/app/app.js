// define the weather app
var app = angular.module('weatherApp', ['ngRoute', 'ngMaterial', 'ngLodash', 'angular-loading-bar', 'ngAnimate', 'ngSanitize']);

// define the routes
app.config(function ($routeProvider) {
  $routeProvider
    .when('/weather/data',
    {
      controller: 'dataController',
      templateUrl: 'app/routes/data/data.html'
    })
    .otherwise(
    {
      redirectTo: '/weather/data'
    });
});

// themes depending on temperature
app.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('theme1')
    .primaryPalette('blue', {
      'default': '400',
      'hue-1': '400',
      'hue-2': '400',
      'hue-3': '400'
    }).backgroundPalette('blue', {
      'default': '400',
      'hue-1': '400',
      'hue-2': '400',
      'hue-3': '400'
    });
  $mdThemingProvider.theme('theme2')
    .primaryPalette('orange', {
      'default': '400',
      'hue-1': '400',
      'hue-2': '400',
      'hue-3': '400'
    }).backgroundPalette('orange', {
      'default': '400',
      'hue-1': '400',
      'hue-2': '400',
      'hue-3': '400'
    });
  $mdThemingProvider.theme('theme3')
    .primaryPalette('red', {
      'default': '400',
      'hue-1': '400',
      'hue-2': '400',
      'hue-3': '400'
    }).backgroundPalette('red', {
      'default': '400',
      'hue-1': '400',
      'hue-2': '400',
      'hue-3': '400'
    });
  $mdThemingProvider.definePalette('WhitePalette', {
    '50': 'ffffff',
    '100': 'ffffff',
    '200': 'ffffff',
    '300': 'ffffff',
    '400': 'ffffff',
    '500': 'ffffff',
    '600': 'ffffff',
    '700': 'ffffff',
    '800': 'ffffff',
    '900': 'ffffff',
    'A100': 'ffffff',
    'A200': 'ffffff',
    'A400': 'ffffff',
    'A700': 'ffffff',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
    'contrastLightColors': undefined
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('WhitePalette', {
      'default': '400',
      'hue-1': '400',
      'hue-2': '400',
      'hue-3': '400'
    }).backgroundPalette('WhitePalette', {
      'default': '400',
      'hue-1': '400',
      'hue-2': '400',
      'hue-3': '400'
    });
});

// get player SDK info
(
  function () {
    window.addEventListener('scala', function () {
      // Get config file
      app.value('config', scala.app.config);
      // Get EXP-CORE base URL
      app.value('url', scala.config.host);
      angular.bootstrap(document.body, [app.name], {});
    });
  }()
);
