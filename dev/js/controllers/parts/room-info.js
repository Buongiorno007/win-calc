/* globals BauVoiceApp, STEP, typingTextWithDelay, showElementWithDelay */

'use strict';

BauVoiceApp.controller('RoomInfoCtrl', ['$scope', function ($scope) {
  var $roomInfo = $('.room-info-container'),
      $coeffTitle = $roomInfo.find('.coeff-title'),
      $selectRoomsBTN = $roomInfo.find('.select-rooms'),
      DELAY_SHOW_COEFF_TITLE = 20 * STEP;

  typingTextWithDelay($coeffTitle, DELAY_SHOW_COEFF_TITLE);
  showElementWithDelay($selectRoomsBTN, DELAY_SHOW_COEFF_TITLE);
}]);
