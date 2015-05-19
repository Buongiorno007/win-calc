
// controllers/parts/room-selector.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('RoomSelectorCtrl', roomSelectorCtrl);

  function roomSelectorCtrl($scope, localStorage, globalConstants) {
    $scope.global = localStorage.storage;

    $scope.roomData = {
      DELAY_SHOW_ROOM1: 5 * globalConstants.STEP,
      DELAY_SHOW_ROOM2: 6 * globalConstants.STEP,
      DELAY_SHOW_ROOM3: 7 * globalConstants.STEP,
      DELAY_SHOW_ROOM4: 8 * globalConstants.STEP,
      DELAY_SHOW_ROOM5: 9 * globalConstants.STEP,
      DELAY_SHOW_ROOM6: 10 * globalConstants.STEP
    };


    // Room Select
    $scope.selectRoom = function(id) {
      $scope.global.product.selectedRoomId = id;
      $scope.closeRoomSelectorDialog();
      $scope.global.prepareMainPage();
      $scope.global.startProgramm = false;
    };

    // Close Room Selector Dialog
    $scope.closeRoomSelectorDialog = function() {
      $scope.global.showRoomSelectorDialog = false;
      //playSound('fly');
    };

  }
})();
