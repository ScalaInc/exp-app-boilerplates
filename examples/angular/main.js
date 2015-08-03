window.addEventListener('scala', function () {
  console.log('SDK is loaded!');
});


var app = angular.module('App', []);

app.controller('MainCtrl', function ($scope) {
  $scope.title = 'Welcome to the EXP Angular Boilerplate!';
});

