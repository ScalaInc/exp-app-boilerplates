app.factory('$exceptionHandler', ['errorService','$injector', function(errorService, $injector) {

  var $location;

  return function(exception, cause) {

    // store information in service
    errorService.saveMessage(exception.message);
    errorService.saveCause(cause);

    // route to error page
    $location = $location || $injector.get('$location');
    $location.path('/socialmedia/error');

  };

}]);
