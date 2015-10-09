app.service('errorService', function () {
  var tempErrorMessage = {};
  var tempErrorCause = {};

  // save the error message
  this.saveMessage = function (message) {
    tempErrorMessage = message;
    return message;
  };

  this.saveCause = function (cause) {
    tempErrorCause = cause;
    return cause;
  };

  // receive the error message
  this.errorMessage = function(){
    return tempErrorMessage;
  };

  this.cause = function(){
    return tempErrorCause;
  };
});
