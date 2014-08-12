/* globals STEP, typingTextWithDelay, showElementWithDelay */

'use strict';

BauVoiceApp.controller('RoomInfoCtrl', ['$scope', 'locationService', 'constructService', function ($scope, locationService, constructService) {
    var $roomInfo = $('.room-info-container'),
        $coeffTitle = $roomInfo.find('.coeff-title'),
        $selectRoomsBTN = $roomInfo.find('.select-rooms'),
        DELAY_SHOW_COEFF_TITLE = 20 * STEP;

  typingTextWithDelay($coeffTitle, DELAY_SHOW_COEFF_TITLE);
  showElementWithDelay($selectRoomsBTN, DELAY_SHOW_COEFF_TITLE);

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