'use strict';

app.controller('errorController', ['$scope', '$sce', 'lodash', '$interval', '$location', 'errorService', function ($scope, $sce, lodash, $interval, $location, errorService) {

  // global variables
  var intervalPromise;
  var intervalValue = 60000;
  $scope.showError = true;

  $scope.toggleError = function () {
    if ($scope.showError) {
      $scope.showError = false;
    } else {
      $scope.showError = true;
    }
  };

  // check if data page is working
  $scope.start = function () {

    // stop any loop that is already running
    $scope.stop();

    //run interval
    intervalPromise = $interval(function () {

      // route to data page
      $location.path('/socialmedia/data');

    }, intervalValue);

  };

  // stops the interval
  $scope.stop = function () {

    // stop the interval
    $interval.cancel(intervalPromise);

  };

  // if scope is destroyed stop interval
  $scope.$on('$destroy', function () {

    // stopping interval
    $scope.stop();

  });

  // adding error messages to the scope
  $scope.errorObject = {};
  $scope.errorObject.message = errorService.errorMessage();
  $scope.errorObject.cause = errorService.cause();

  // start checking if data page is ok
  $scope.start();

}]);
