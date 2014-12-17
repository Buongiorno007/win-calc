/* globals STEP, typingTextWithDelay, showElementWithDelay */

'use strict';

BauVoiceApp.controller('RoomInfoCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.roomInfo = {
    DELAY_SHOW_COEFF: 20 * STEP,
    DELAY_SHOW_ALLROOMS_BTN: 15 * STEP,
    typing: 'on'
  };

//--------- download rooms info
  constructService.getRoomInfo(function (results) {
    if (results.status) {
      $scope.roomInfo.roomsData = angular.copy(results.data.roomInfo);
    } else {
      console.log(results);
    }
  });


  // Show/Close Room Selector Dialog
  $scope.showRoomSelectorDialog = function() {
    if($scope.global.showRoomSelectorDialog === true) {
      $scope.global.showRoomSelectorDialog = false;
    } else {
      $scope.global.showRoomSelectorDialog = true;
      $scope.global.isRoomsDialog = true;
    }
  };


}]);