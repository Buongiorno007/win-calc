/* globals BauVoiceApp, STEP, showElementWithDelay, typingElementWithDelay */

'use strict';

BauVoiceApp.controller('LaminationCtrl', ['$scope', function ($scope) {
  var lamBlockClass = '.lamination-block',
      lamImgClass = '.lamination-img',
      lamLabelClass = '.lamination-label',
      selectedClass = 'selected',

      $lamContainer = $('.lamination-container'),
      $lamWhiteBox = $lamContainer.find('.lam-white-box'),
      $lamOptionBox = $lamContainer.find('.lam-option-box'),
      $lamTitle = $lamContainer.find('.lamination-title'),
      $lamWhiteLabel = $lamContainer.find('.for-white'),
      $lamImg = $lamContainer.find(lamImgClass),
      $lamBoxLabel, $lamImgParent, w, l,

      DELAY_SHOW_WHITE_BOX,
      DELAY_SHOW_IMG_BOX,
      DELAY_SHOW_LAMINATION = 5 * STEP;

  typingElementWithDelay($lamTitle, DELAY_SHOW_LAMINATION);
  typingElementWithDelay($lamWhiteLabel, DELAY_SHOW_LAMINATION);

  for (w = 0; w < $lamWhiteBox.length; w++) {
    DELAY_SHOW_WHITE_BOX = DELAY_SHOW_LAMINATION + w * 2 * STEP;
    showElementWithDelay($lamWhiteBox[w], 'block', DELAY_SHOW_WHITE_BOX);
  }

  for (l = 0; l < $lamOptionBox.length; l++) {
    DELAY_SHOW_IMG_BOX = DELAY_SHOW_LAMINATION + l * 2 * STEP;
    $lamBoxLabel = $($lamOptionBox[l]).find(lamLabelClass);
    showElementWithDelay($lamOptionBox[l],  'block', DELAY_SHOW_IMG_BOX);
    typingElementWithDelay($lamBoxLabel, DELAY_SHOW_IMG_BOX);
  }

  // Select lamination
  $lamImg.click(function () {
    $lamImgParent = $(this).closest(lamBlockClass);
    $lamImgParent.find(lamImgClass).each(function () {
      $(this).removeClass(selectedClass);
    });
    $(this).addClass(selectedClass);
  });
}]);