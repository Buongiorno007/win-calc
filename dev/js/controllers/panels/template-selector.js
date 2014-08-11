/* globals BauVoiceApp, STEP, showElementWithDelay, typingElementWithDelay */

'use strict';

BauVoiceApp.controller('TemplateSelectorCtrl', ['$scope', function ($scope) {
  var $templateContainer = $('.template-container'),
      $templateTitle = $templateContainer.find('.template-title'),
      $templateDescr = $templateContainer.find('.template-discr'),
      $tempEditBTN = $templateContainer.find('.template-edit'),
      $tempDefaultBTN = $templateContainer.find('.template-default'),
      $tempOtherIMG = $templateContainer.find('.other-template-img'),
      selectedClass = 'selected',

      DELAY_SHOW_CONTENT = 5 * STEP;

  showElementWithDelay($templateTitle, DELAY_SHOW_CONTENT);
  typingElementWithDelay($templateDescr, DELAY_SHOW_CONTENT);
  showElementWithDelay($tempEditBTN, 2 * DELAY_SHOW_CONTENT);
  showElementWithDelay($tempDefaultBTN, 2 * DELAY_SHOW_CONTENT);
  showElementWithDelay($tempOtherIMG, 2 * DELAY_SHOW_CONTENT);

  // click on Buttons
  $templateTitle.click(function () {
    $(this).toggleClass(selectedClass);
  });
}]);