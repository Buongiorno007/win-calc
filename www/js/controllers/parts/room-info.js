
// controllers/parts/room-info.js

/* globals STEP, typingTextWithDelay, showElementWithDelay, playSound */

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
  $scope.showRoomSelectorDialog = function(event) {
    if($scope.global.showRoomSelectorDialog === true) {
      $scope.global.showRoomSelectorDialog = false;
    } else {
      $scope.global.showRoomSelectorDialog = true;
      $scope.global.isRoomsDialog = true;
    }
    playSound('fly');
  };

  //----- Show Comments
  $scope.swipeShowComment = function(event) {
    playSound('swip');
    $scope.global.isShowCommentBlock = true;
  };
  $scope.swipeHideComment = function(event) {
    playSound('swip');
    $scope.global.isShowCommentBlock = false;
  };

}]);


//event.srcEvent.stopPropagation();
//event.preventDefault();
//$event.stopImmediatePropagation();

/*

 hm-pinch="pinch($event)" hm-rotate="rotate($event)"

 $scope.rotate = function(event) {
 $scope.rotation = event.gesture.rotation % 360;
 event.gesture.preventDefault();
 }
 $scope.pinch = function(event) {
 $scope.scaleFactor = event.gesture.scale;
 event.gesture.preventDefault();
 }

 */
