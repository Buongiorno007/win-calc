
// controllers/parts/room-selector.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('RoomSelectorCtrl', ['$scope', '$location', 'localStorage', function ($scope, $location, localStorage) {

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
    $scope.roomData.selectedRoom = id;
    $scope.global.currentRoomId = id;
    $scope.global.templateIndex = 0;
    //----- if select Door
    if(id === 6) {
      $scope.global.isConstructWind = false;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = false;
      $scope.global.isConstructDoor = true;
      //------- change template and price relate to Door
      $scope.global.templateSource = $scope.global.templatesDoorSource[$scope.global.templateIndex];
      $scope.global.templateDefault = $scope.global.templatesDoorList[$scope.global.templateIndex];
      $scope.global.product.constructThumb = $scope.global.templatesDoorThumbList[$scope.global.templateIndex];
      $scope.global.createObjXFormedPrice($scope.global.templateDefault, $scope.global.profileIndex, $scope.global.product.profileId);
      $location.path('/construction');
    } else if(id === 3) {
      //------- if select Balcony
      $scope.global.isConstructWind = false;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = true;
      $scope.global.isConstructDoor = false;
      //------- change template and price relate to Balcony
      $scope.global.templateSource = $scope.global.templatesBalconySource[$scope.global.templateIndex];
      $scope.global.templateDefault = $scope.global.templatesBalconyList[$scope.global.templateIndex];
      $scope.global.product.constructThumb = $scope.global.templatesBalconyThumbList[$scope.global.templateIndex];
      $scope.global.createObjXFormedPrice($scope.global.templateDefault, $scope.global.profileIndex, $scope.global.product.profileId);
    } else {
      $scope.global.isConstructWind = true;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = false;
      $scope.global.isConstructDoor = false;
      //------- change template and price relate to Window
      $scope.global.templateSource = $scope.global.templatesWindSource[$scope.global.templateIndex];
      $scope.global.templateDefault = $scope.global.templatesWindList[$scope.global.templateIndex];
      $scope.global.product.constructThumb = $scope.global.templatesWindThumbList[$scope.global.templateIndex];
      $scope.global.createObjXFormedPrice($scope.global.templateDefault, $scope.global.profileIndex, $scope.global.product.profileId);
    }
    $scope.closeRoomSelectorDialog();
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
