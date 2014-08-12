/* globals BauVoiceApp, STEP, showElementWithDelay, addClassWithDelay, removeClassWithDelay */

'use strict';

BauVoiceApp.controller('RoomSelectorCtrl', ['$scope', function ($scope) {
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

      unvisibleClass = 'unvisible',
      showRoomDialogClass = 'show-dialog',
      hideRoomDialogClass = 'hide-dialog',
      selectedRoomClass = 'selected',
      roomCurrent = 3,

      DELAY_SHOW_ROOM_DIALOG = 10 * STEP,
      STEP_SHOW_ROOM = STEP,
      FINISH_SHOW_ROOM;

  // Show/Close Room Selector Dialog
  $selectRoomsBTN.click(function () {
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
      addClassWithDelay($roomBox[roomCurrent], selectedRoomClass, DELAY_ROOM_CURRENT);
    }
  });

  $roomsDialogClose.click(function () {
    $roomsDialog.removeClass(showRoomDialogClass).addClass(hideRoomDialogClass);
    addClassWithDelay($roomsDialog, unvisibleClass, 5 * STEP);
  });

  // Room Select
  $roomBox.click(function () {
    $roomBox.each(function () {
      $(this).removeClass(selectedRoomClass);
    });
    $(this).addClass(selectedRoomClass);

    newClimateCoeff = $(this).data('climate');
    newHeatTransfCoeff = $(this).data('heat-transfer');
    newHeatExchangeCoeff = $(this).data('heat-exchange');

    $climateCoeff.text(newClimateCoeff);
    $heatTransfCoeff.text(newHeatTransfCoeff);
    $heatExchangeCoeff.text(newHeatExchangeCoeff);
  });
}]);