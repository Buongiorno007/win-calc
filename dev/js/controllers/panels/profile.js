/* globals BauVoiceApp, STEP, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('ProfileCtrl', ['$scope', function ($scope) {
  var $profileContainer = $('.profile-container'),
      $profileBlock = $profileContainer.find('.profile-block'),
      $profileBox = $profileContainer.find('.profile-box'),
      $profileTitle = $profileContainer.find('.title'),

      selectedClass = 'selected',

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
      $(this).removeClass(selectedClass);
    });
    $profileBox.each(function () {
      $(this).removeClass(selectedClass);
    });
    $(this).closest('.profile-block').addClass(selectedClass);
    $(this).addClass(selectedClass);
  });
}]);
