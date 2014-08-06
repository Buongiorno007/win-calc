/* globals STEP, showElementWithDelay, typingElementWithDelay */

(function ($) {
  'use strict';
  var $glassContainer = $('.glass-container'),
      $glassBlock = $glassContainer.find('.glass-block'),
      $glassFooterInner = $glassContainer.find('.footer-inner'),
      $glassBox = $glassContainer.find('.box'),
      $glassTitle = $glassContainer.find('.title'),

      selectProfileClass = 'selected',

      DELAY_SHOW_PROFILES = 20 * STEP,
      DELAY_SHOW_PROF,
      g;

  typingElementWithDelay($glassTitle, DELAY_SHOW_PROFILES);

  for (g = 0; g < $glassBox.length; g++) {
    DELAY_SHOW_PROF = DELAY_SHOW_PROFILES + g * (STEP * 2);
    showElementWithDelay($glassBox[g], DELAY_SHOW_PROF);
  }

  // Select glass
  $glassBox.click(function () {
    $glassBlock.each(function () {
      $(this).removeClass(selectProfileClass);
    });
    $glassBox.each(function () {
      $(this).removeClass(selectProfileClass);
    });
    $(this).closest('.glass-block').addClass(selectProfileClass);
    $(this).addClass(selectProfileClass);
  });
  /*
  // Define width for footer-inner depends on children qty
  $glassFooterInner.each(function () {
    defineWidthContaner($(this));
  });


  function defineWidthContaner(container) {
    var parent = container,
        $children = parent.children(),
        childWidthWithMargin = $children.outerWidth(true),
        parentWidth = childWidthWithMargin * $children.length;

    parent.css('min-width', parentWidth);
  }
  */
})(jQuery);