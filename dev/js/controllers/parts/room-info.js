/* globals STEP, typingTextWithDelay, showElementWithDelay */

'use strict';

BauVoiceApp.controller('RoomInfoCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.roomInfo = {
    DELAY_SHOW_COEFF: 20 * STEP,
    DELAY_SHOW_ALLROOMS_BTN: 15 * STEP,
    typing: 'on'
  };

  // Show/Close Room Selector Dialog
  $scope.showRoomSelectorDialog = function() {
    if($scope.global.showRoomSelectorDialog === true) {
      $scope.global.showRoomSelectorDialog = false;
    } else {
      $scope.global.showRoomSelectorDialog = true;
      $scope.global.isRoomsDialog = true;
    }
  };


  constructService.getRoomInfo(function (results) {
    if (results.status) {
      $scope.roomInfo.roomArr = results.data.roomName;
    } else {
      console.log(results);
    }
  });

  constructService.getCoefs(function (results) {
    if (results.status) {
      $scope.roomInfo.coefsArr = [

      ];
      for(var c = 0; c < results.data.coefs.length; c++) {
        var coefsObj = {
          thermalResistance: {
            required: results.data.coefs[c].thermalResistance.required,
            actual: results.data.coefs[c].thermalResistance.actual
          },
          airCirculation: {
            required: results.data.coefs[c].airCirculation.required,
            actual: results.data.coefs[c].airCirculation.actual
          }
        };
        $scope.roomInfo.coefsArr.push(coefsObj);
      }
 /*
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
 */
    } else {
      console.log(results);
    }
  });
}]);