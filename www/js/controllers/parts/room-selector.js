
// controllers/parts/room-selector.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('RoomSelectorCtrl', ['$scope', '$location', 'localStorage', function ($scope, $location, localStorage) {

  $scope.global = localStorage;

  $scope.roomData = {
    DELAY_SHOW_ROOM1: 5*STEP,
    DELAY_SHOW_ROOM2: 6*STEP,
    DELAY_SHOW_ROOM3: 7*STEP,
    DELAY_SHOW_ROOM4: 8*STEP,
    DELAY_SHOW_ROOM5: 9*STEP,
    DELAY_SHOW_ROOM6: 10*STEP
  };


  // Room Select
  $scope.selectRoom = function(id) {
    //$scope.roomData.selectedRoom = id;
    $scope.global.product.selectedRoomId = id;
    $scope.global.product.templateIndex = 0;
    //----- if select Door
    if(id === 6) {
      $scope.global.isConstructWind = false;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = false;
      $scope.global.isConstructDoor = true;
      //------ set new templates arrays
      $scope.global.getCurrentTemplates();
      //------- change template and price relate to Door
      $scope.global.product.templateSource = $scope.global.templatesDoorSource[$scope.global.product.templateIndex];
      $scope.global.product.templateDefault = $scope.global.templatesDoorList[$scope.global.product.templateIndex];
      $scope.global.product.templateIcon = $scope.global.templatesDoorIconList[$scope.global.product.templateIndex];
      $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId);
      //$location.path('/construction');
    } else if(id === 3) {
      //------- if select Balcony
      $scope.global.isConstructWind = false;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = true;
      $scope.global.isConstructDoor = false;
      //------ set new templates arrays
      $scope.global.getCurrentTemplates();
      //------- change template and price relate to Balcony
      $scope.global.product.templateSource = $scope.global.templatesBalconySource[$scope.global.product.templateIndex];
      $scope.global.product.templateDefault = $scope.global.templatesBalconyList[$scope.global.product.templateIndex];
      $scope.global.product.templateIcon = $scope.global.templatesBalconyIconList[$scope.global.product.templateIndex];
      $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId);
    } else {
      $scope.global.isConstructWind = true;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = false;
      $scope.global.isConstructDoor = false;
      //------ set new templates arrays
      $scope.global.getCurrentTemplates();
      //------- change template and price relate to Window
      $scope.global.product.templateSource = $scope.global.templatesWindSource[$scope.global.product.templateIndex];
      $scope.global.product.templateDefault = $scope.global.templatesWindList[$scope.global.product.templateIndex];
      $scope.global.product.templateIcon = $scope.global.templatesWindIconList[$scope.global.product.templateIndex];
      console.log();
      $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId);
    }
    $scope.closeRoomSelectorDialog();
  };

  // Close Room Selector Dialog
  $scope.closeRoomSelectorDialog = function() {
    $scope.global.showRoomSelectorDialog = false;
  };
}]);
