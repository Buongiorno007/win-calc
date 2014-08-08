/* globals STEP, showElementWithDelay, typingElementWithDelay */

function initTemplateContainer() {
  'use strict';
  var $tempContainer = $('.template-container'),
      $tempTitle = $tempContainer.find('.template-title'),
      $tempDiscr = $tempContainer.find('.template-discr'),
      $tempEditBTN = $tempContainer.find('.template-edit'),
      $tempDefaultBTN = $tempContainer.find('.template-default'),
      $tempOtherIMG = $tempContainer.find('.other-template-img'),
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
}
