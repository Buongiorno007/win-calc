/* globals BauVoiceApp, STEP, typingElementWithDelay */

'use strict';

BauVoiceApp.controller('RoomInfoCtrl', ['$scope', function ($scope) {
  var $coeffTitle = $('.coeff-container .coeff-title'),
      DELAY_SHOW_COEFF_TITLE = 20 * STEP;

  typingElementWithDelay($coeffTitle, DELAY_SHOW_COEFF_TITLE);
}]);
