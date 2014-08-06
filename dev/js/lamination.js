/* globals STEP, showElementWithDelay, typingElementWithDelay */

(function ($) {
  'use strict';
  var
      $lamImgOutside = $('.outside .lamination-img'),
      $lamImgInside = $('.inside .lamination-img'),
      $lamWhiteBox = $('.lamination-container .lam-white-box'),
      $lamOptionBox = $('.lamination-container .lam-option-box'),
      $lamTitle = $('.lamination-container .lamination-title'),
      $lamWhiteLabel = $('.lamination-container .for-white'),

      selectedClass = 'selected',

      DELAY_SHOW_LAMINATION = 10 * STEP;

  typingElementWithDelay($lamTitle, DELAY_SHOW_LAMINATION);
  typingElementWithDelay($lamWhiteLabel, DELAY_SHOW_LAMINATION);

  for(var w = 0; w < $lamWhiteBox.length; w++) {
    console.log($lamWhiteBox.length);
    var DELAY_SHOW_WHITE_BOX = DELAY_SHOW_LAMINATION + w * 200;
    showElementWithDelay($lamWhiteBox[w], DELAY_SHOW_WHITE_BOX);
  }

  for(var l = 0; l < $lamOptionBox.length; l++) {
    var DELAY_SHOW_IMG_BOX = DELAY_SHOW_LAMINATION + l * 200,
        $lamBoxLabel = $($lamOptionBox[l]).children().last();
    showElementWithDelay($lamOptionBox[l], DELAY_SHOW_IMG_BOX);
    typingElementWithDelay($lamBoxLabel, DELAY_SHOW_IMG_BOX);
  }

  // Select lamination outside
  $lamImgOutside.click(function(){
    $lamImgOutside.each(function () {
      $(this).removeClass(selectedClass);
    });
    $(this).addClass(selectedClass);
  });

  // Select lamination inside
  $lamImgInside.click(function(){
    $lamImgInside.each(function () {
      $(this).removeClass(selectedClass);
    });
    $(this).addClass(selectedClass);
  });

})(jQuery);


