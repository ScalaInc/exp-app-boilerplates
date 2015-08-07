
angular.module('App', ['ngMaterial']).controller('Ctrl', function($scope) {
  window.addEventListener('scala', function () {

    $scope.refresh();

    scala.channels.system.listen({ name: 'deviceOnline' }, function (payload) {
      var exists = false;
      $scope.devices.forEach(function (device) {
        if (device.uuid === payload.deviceUuid) {
          exists = true;
          device.raw.status = true;
        }
      });
      $scope.$digest();
      if (!exists) {
        $scope.refresh();
      }
    });
    
    scala.channels.system.listen({ name: 'deviceOffline' }, function (payload) {
      $scope.devices.forEach(function (device) {
        if (device.uuid === payload.deviceUuid) {
          device.raw.status = false;
        }
      });
      $scope.$digest();
    });

  });

  $scope.refresh = function () {
    scala.api.getDevices({ limit: 1000 }).then(function (devices) {
      devices.reverse();
      $scope.devices = devices;
      $scope.$digest();
    });
  };
});


