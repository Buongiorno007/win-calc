/* globals STEP, showElementWithDelay, typingElementWithDelay */

// TODO: Код идентичен glass.js
(function ($) {
  'use strict';
  var $profileContainer = $('.profile-container'),
      $profileBlock = $profileContainer.find('.profile-block'),
      $profileBox = $profileContainer.find('.profile-box'),
      $profileHead = $profileContainer.find('.title'),

      selectProfileClass = 'selected',

      DELAY_SHOW_PROFILES = 20 * STEP,
      DELAY_SHOW_PROF,
      prof;

  typingElementWithDelay($profileHead, DELAY_SHOW_PROFILES);

  for (prof = 0; prof < $profileBox.length; prof++) {
    DELAY_SHOW_PROF = DELAY_SHOW_PROFILES + prof * (STEP * 2);
    showElementWithDelay($profileBox[prof], DELAY_SHOW_PROF);
  }


  // Select profile
  $profileBox.click(function () {
    $profileBlock.each(function () {
      $(this).removeClass(selectProfileClass);
    });
    $profileBox.each(function () {
      $(this).removeClass(selectProfileClass);
    });
    $(this).closest('.profile-block').addClass(selectProfileClass);
    $(this).addClass(selectProfileClass);
  });

})(jQuery);