/* globals STEP, showElementWithDelay, typingElementWithDelay */

(function ($) {
  'use strict';
  var $hardwareBlock = $('.hardware-container .hardware-block'),
      $hardwareBox = $('.hardware-container .hardware-box'),
      $hardwareTitle = $('.hardware-container .hardware-title'),

      selectedClass = 'selected',

      DELAY_SHOW_PROFILES = 20 * STEP;

  typingElementWithDelay($hardwareTitle, STEP);

  for(var g = 0; g < $hardwareBox.length; g++) {
    var DELAY_SHOW_PROF = DELAY_SHOW_PROFILES + g * 200;
    showElementWithDelay($hardwareBox[g], DELAY_SHOW_PROF);
  }

  // Select hardware
  $hardwareBox.click(function(){
    $hardwareBlock.each(function () {
      $(this).removeClass(selectedClass);
    });
    $hardwareBox.each(function () {
      $(this).removeClass(selectedClass);
    });
    $(this).parents($hardwareBlock).addClass(selectedClass);
    $(this).addClass(selectedClass);
  });


})(jQuery);

