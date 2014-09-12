/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, showElementWithDelay, addClassWithDelay, removeClassWithDelay */

'use strict';

BauVoiceApp.controller('RoomSelectorCtrl', ['$scope', '$location', 'globalData', function ($scope, $location, globalData) {

  $scope.global = globalData;

  $scope.roomData = {
    selectedRoom: false
  };

  var $roomInfoContainer = $('.room-info-container'),
      $selectRoomsBTN = $roomInfoContainer.find('.select-rooms'),
      $climateCoeff = $roomInfoContainer.find('.climate'),
      $heatTransfCoeff = $roomInfoContainer.find('.heat-transfer'),
      $heatExchangeCoeff = $roomInfoContainer.find('.heat-exchange'),
      newClimateCoeff,
      newHeatTransfCoeff,
      newHeatExchangeCoeff,
      $roomsDialog = $('.rooms-selector-dialog'),
      $roomsDialogClose = $roomsDialog.find('.close-dialog'),
      $roomBox = $roomsDialog.find('.room-box'),
      $roomIMG = $roomBox.find('.room-img'),

      showRoomDialogClass = 'show-dialog',
      hideRoomDialogClass = 'hide-dialog',
      roomCurrent = 3,

      DELAY_SHOW_ROOM_DIALOG = 10 * STEP,
      STEP_SHOW_ROOM = STEP,
      FINISH_SHOW_ROOM;

  // Show/Close Room Selector Dialog
  /*$selectRoomsBTN.click(function () {
    if ($roomsDialog.hasClass(showRoomDialogClass)) {
      $roomsDialog.removeClass(showRoomDialogClass).addClass(hideRoomDialogClass);
      addClassWithDelay($roomsDialog, unvisibleClass, 5 * STEP);
    } else if ($roomsDialog.hasClass(hideRoomDialogClass)) {
      $roomsDialog.removeClass(hideRoomDialogClass).removeClass(unvisibleClass).addClass(showRoomDialogClass);
    } else {


      $roomsDialog.removeClass(unvisibleClass).addClass(showRoomDialogClass);
      for (var room = 0; room < $roomIMG.length; room++) {
        var DELAY_SHOW_ROOM = DELAY_SHOW_ROOM_DIALOG + STEP_SHOW_ROOM * room;
        FINISH_SHOW_ROOM = DELAY_SHOW_ROOM;
        showElementWithDelay($roomIMG.eq(room), DELAY_SHOW_ROOM);


      }
      var DELAY_ROOM_CURRENT = FINISH_SHOW_ROOM + 5 * STEP;
      addClassWithDelay($roomBox[roomCurrent], selectClass, DELAY_ROOM_CURRENT);
    }
  });

  $roomsDialogClose.click(function () {
    $roomsDialog.removeClass(showRoomDialogClass).addClass(hideRoomDialogClass);
    addClassWithDelay($roomsDialog, unvisibleClass, 5 * STEP);
  });
   */
  // Room Select
  $roomBox.click(function () {
    $roomBox.each(function () {
      $(this).removeClass(selectClass);
    });
    $(this).addClass(selectClass);

    newClimateCoeff = $(this).data('climate');
    newHeatTransfCoeff = $(this).data('heat-transfer');
    newHeatExchangeCoeff = $(this).data('heat-exchange');

    $climateCoeff.text(newClimateCoeff);
    $heatTransfCoeff.text(newHeatTransfCoeff);
    $heatExchangeCoeff.text(newHeatExchangeCoeff);
  });


  // Room Select
  $scope.selectRoom = function(id, coeff) {
    if($scope.roomData.selectedRoom === id) {
      $scope.moomData.selectedRoom = false;
    } else {
      $scope.roomData.selectedRoom = id;
    }
  };


  $scope.gotoDoorPage = function() {
    $scope.global.doorConstructionPage = true;
    $location.path('/construction');
  };

  // Close Room Selector Dialog
  $scope.closeRoomSelectorDialog = function() {
    $scope.global.showRoomSelectorDialog = false;
  };
}]);