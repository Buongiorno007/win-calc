/* globals BauVoiceApp, STEP, showElementWithDelay, typingElementWithDelay */

'use strict';

BauVoiceApp.controller('GlassCtrl', ['$scope', function ($scope) {
  var $glassContainer = $('.glass-container'),
      $glassBlock = $glassContainer.find('.glass-block'),
      //$glassFooterInner = $glassContainer.find('.footer-inner'),
      $glassBox = $glassContainer.find('.box'),
      $glassTitle = $glassContainer.find('.title'),

      selectedClass = 'selected',

      DELAY_SHOW_PROFILES = 5 * STEP,
      g, DELAY_SHOW_PROF;

  typingElementWithDelay($glassTitle, DELAY_SHOW_PROFILES);

  for (g = 0; g < $glassBox.length; g++) {
    DELAY_SHOW_PROF = DELAY_SHOW_PROFILES + g * (STEP * 3);
    showElementWithDelay($glassBox[g], 'block', DELAY_SHOW_PROF);
  }

  // Select glass
  $glassBox.click(function () {
    $glassBlock.each(function () {
      $(this).removeClass(selectedClass);
    });
    $glassBox.each(function () {
      $(this).removeClass(selectedClass);
    });
    $(this).closest('.glass-block').addClass(selectedClass);
    $(this).addClass(selectedClass);
  });

//  // Define width for footer-inner depends on children qty
//  $glassFooterInner.each(function () {
//    defineWidthContaner($(this));
//  });
//
//
//  function defineWidthContaner(container) {
//    var parent = container,
//        $children = parent.children(),
//        childWidthWithMargin = $children.outerWidth(true),
//        parentWidth = childWidthWithMargin * $children.length;
//
//    parent.css('min-width', parentWidth);
//  }
}]);