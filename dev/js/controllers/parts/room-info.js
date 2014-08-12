/* globals STEP, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('RoomInfoCtrl', ['$scope', 'locationService', 'constructService', function ($scope, locationService, constructService) {
  var $coeffTitle = $('.coeff-container .coeff-title'),
      DELAY_SHOW_COEFF_TITLE = 20 * STEP;

  typingTextWithDelay($coeffTitle, DELAY_SHOW_COEFF_TITLE);

  $scope.roomInfo = {};

  locationService.getCity(function (results) {
    if (results.status) {
      $scope.roomInfo.zone = results.data.zone.id;
    } else {
      console.log(results);
    }
  });

  constructService.getRoomInfo(function (results) {
    if (results.status) {
      $scope.roomInfo.room = results.data.name;
    } else {
      console.log(results);
    }
  });

  constructService.getCoefs(function (results) {
    if (results.status) {
      $scope.roomInfo.coefs = {
        thermalResistance: {
          required: results.data.coefs.thermalResistance.required,
            actual: results.data.coefs.thermalResistance.actual
        },
        airCirculation: {
          required: results.data.coefs.airCirculation.required,
            actual: results.data.coefs.airCirculation.actual
        }
      };
    } else {
      console.log(results);
    }
  });
}]);