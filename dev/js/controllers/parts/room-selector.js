/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('RoomSelectorCtrl', ['$scope', 'localStorage', function ($scope, localStorage) {

  $scope.global = localStorage;

  $scope.roomData = {
    selectedRoom: $scope.global.currentRoomId,
    DELAY_SHOW_ROOM1: 5*STEP,
    DELAY_SHOW_ROOM2: 6*STEP,
    DELAY_SHOW_ROOM3: 7*STEP,
    DELAY_SHOW_ROOM4: 8*STEP,
    DELAY_SHOW_ROOM5: 9*STEP,
    DELAY_SHOW_ROOM6: 10*STEP
  };

  // Room Select
  $scope.selectRoom = function(id) {
    if($scope.roomData.selectedRoom === id) {
      $scope.roomData.selectedRoom = false;
    } else {
      $scope.roomData.selectedRoom = id;
      $scope.global.currentRoomId = id;
    }
    if(id === 6) {
      $scope.global.isConstructDoor = true;
      $scope.createNewProduct();
    } else {
      $scope.global.isConstructDoor = false;
      $scope.createNewProduct();
    }
  };

  //------- create new project after select room
  $scope.createNewProduct = function() {
    $scope.global.showRoomSelectorDialog = false;
    $scope.global.createNewProject();
  };

  // Close Room Selector Dialog
  $scope.closeRoomSelectorDialog = function() {
    $scope.global.showRoomSelectorDialog = false;
  };
}]);