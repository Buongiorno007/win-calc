/* globals STEP, showElementWithDelay, typingTextByChar, typingElementWithDelay */

(function ($) {
  'use strict';
  var $glassBlock = $('.glass-container .glass-block'),
      $glassFooterInner = $('.glass-container .footer-inner'),
      $glassBox = $('.glass-container .glass-box'),
      $glassTitle = $('.glass-container .glass-title'),

      selectProfileClass = 'selected',

      DELAY_SHOW_PROFILES = 20 * STEP;

  typingElementWithDelay($glassTitle, DELAY_SHOW_PROFILES);

  for(var g = 0; g < $glassBox.length; g++) {
    var DELAY_SHOW_PROF = DELAY_SHOW_PROFILES + g * 200;
    showElementWithDelay($glassBox[g], DELAY_SHOW_PROF);
  }


  // Select glass
  $glassBox.click(function(){
    $glassBlock.each(function () {
      $(this).removeClass(selectProfileClass);
    });
    $glassBox.each(function () {
      $(this).removeClass(selectProfileClass);
    });
    $(this).parents($glassBlock).addClass(selectProfileClass);
    $(this).addClass(selectProfileClass);
  });

  // Define width for footer-inner depends on children qty
  $glassFooterInner.each(function() {
    defineWidthContaner($(this));
  })


  function defineWidthContaner(container) {
    var parent = container,
        $children = parent.children(),
        childWidthWithMargin = $children.outerWidth(true),
        parentWidth = childWidthWithMargin * $children.length;

    parent.css('min-width', parentWidth);
  }


})(jQuery);
