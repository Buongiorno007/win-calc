/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('ProfileCtrl', ['$scope', function ($scope) {
  var $profileContainer = $('.profile-container'),
      $profileBlock = $profileContainer.find('.profile-block'),
      $profileBox = $profileContainer.find('.profile-box'),
      $profileTitle = $profileContainer.find('.title'),

      DELAY_SHOW_PROFILES = 5 * STEP,
      prof, DELAY_SHOW_PROF;

  typingTextWithDelay($profileTitle, DELAY_SHOW_PROFILES);

  for (prof = 0; prof < $profileBox.length; prof++) {
    DELAY_SHOW_PROF = DELAY_SHOW_PROFILES + prof * 200;
    showElementWithDelay($profileBox.eq(prof), DELAY_SHOW_PROF);
  }


  // Select profile
  $profileBox.click(function () {
    $profileBlock.each(function () {
      $(this).removeClass(selectClass);
    });
    $profileBox.each(function () {
      $(this).removeClass(selectClass);
    });
    $(this).closest('.profile-block').addClass(selectClass);
    $(this).addClass(selectClass);
  });
}]);
