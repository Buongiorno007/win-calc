/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('RoomSelectorCtrl', ['$scope', 'globalData', function ($scope, globalData) {

  $scope.global = globalData;

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
  };

  // Open Door Page
  $scope.createNewDoor = function() {
    $scope.global.doorConstructionPage = true;
    $scope.global.showRoomSelectorDialog = false;
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showTemplatePanel = true;
    $scope.global.isTemplatePanel = true;
  };


  // Close Room Selector Dialog
  $scope.closeRoomSelectorDialog = function() {
    $scope.global.showRoomSelectorDialog = false;
  };
}]);