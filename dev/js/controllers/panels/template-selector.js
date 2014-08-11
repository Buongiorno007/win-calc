/* globals BauVoiceApp, STEP, showElementWithDelay, typingElementWithDelay */

'use strict';

BauVoiceApp.controller('TemplateSelectorCtrl', ['$scope', function ($scope) {
  var $templateContainer = $('.template-container'),
      $tempTitle = $templateContainer.find('.template-title'),
      $tempDiscr = $templateContainer.find('.template-discr'),
      $tempEditBTN = $templateContainer.find('.template-edit'),
      $tempDefaultBTN = $templateContainer.find('.template-default'),
      $tempOtherIMG = $templateContainer.find('.other-template-img'),
      selectedClass = 'selected',

      DELAY_SHOW_CONTENT = 5 * STEP;

  showElementWithDelay($tempTitle, 'block', DELAY_SHOW_CONTENT);
  typingElementWithDelay($tempDiscr, DELAY_SHOW_CONTENT);
  showElementWithDelay($tempEditBTN, 'block', 2 * DELAY_SHOW_CONTENT);
  showElementWithDelay($tempDefaultBTN, 'block', 2 * DELAY_SHOW_CONTENT);
  showElementWithDelay($tempOtherIMG, 'block', 2 * DELAY_SHOW_CONTENT);

  // click on Buttons
  $tempTitle.click(function () {
    $(this).toggleClass(selectedClass);
  });
}]);