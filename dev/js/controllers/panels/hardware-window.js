/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HardwareWindowCtrl', ['$scope', function ($scope) {
  var $hardwareContainer = $('.hardware-container'),
      $hardwareBlock = $hardwareContainer.find('.hardware-block'),
      $hardwareBox = $hardwareContainer.find('.hardware-box'),
      $hardwareTitle = $hardwareContainer.find('.hardware-title'),

      DELAY_SHOW_HW_BOX = 5 * STEP,
      g, DELAY_SHOW_BOX;


    typingTextWithDelay($hardwareTitle, STEP);

    for (g = 0; g < $hardwareBox.length; g++) {
      DELAY_SHOW_BOX = DELAY_SHOW_HW_BOX + g * 2 * STEP;
      showElementWithDelay($($hardwareBox[g]), DELAY_SHOW_BOX);
    }

  // Select hardware
  $hardwareBox.click(function () {
    $hardwareBlock.each(function () {
      $(this).removeClass(selectClass);
    });
    $hardwareBox.each(function () {
      $(this).removeClass(selectClass);
    });
    $(this).parents($hardwareBlock).addClass(selectClass);
    $(this).addClass(selectClass);
  });
}]);
