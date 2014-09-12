/* globals STEP, typingTextWithDelay, showElementWithDelay */

'use strict';

BauVoiceApp.controller('RoomInfoCtrl', ['$scope', 'locationService', 'constructService', 'globalData', function ($scope, locationService, constructService, globalData) {
    var $roomInfo = $('.room-info-container'),
        $coeffTitle = $roomInfo.find('.coeff-title'),
        $selectRoomsBTN = $roomInfo.find('.select-rooms'),
        DELAY_SHOW_COEFF_TITLE = 20 * STEP;

  typingTextWithDelay($coeffTitle, DELAY_SHOW_COEFF_TITLE);
  showElementWithDelay($selectRoomsBTN, DELAY_SHOW_COEFF_TITLE);

  $scope.global = globalData;
  $scope.roomInfo = {};

  // Show/Close Room Selector Dialog
  $scope.showRoomSelectorDialog = function() {
    if($scope.global.showRoomSelectorDialog === false) {
      $scope.global.showRoomSelectorDialog = true;
    } else {
      $scope.global.showRoomSelectorDialog = false;
    }
  };


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