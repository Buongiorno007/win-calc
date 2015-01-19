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
  $scope.showRoomSelectorDialog = function() {
    if($scope.global.showRoomSelectorDialog === true) {
      $scope.global.showRoomSelectorDialog = false;
    } else {
      $scope.global.showRoomSelectorDialog = true;
      $scope.global.isRoomsDialog = true;
    }
    playSound('fly');
  };

  //----- Show Comments
  $(".room-info-container").swipe( {
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
      playSound('swip');
      if(direction === 'up') {
        $scope.global.isShowCommentBlock = true;
      } else if(direction === 'down') {
        $scope.global.isShowCommentBlock = false;
      }
      $scope.$apply();
    },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
    threshold:0
  });


}]);