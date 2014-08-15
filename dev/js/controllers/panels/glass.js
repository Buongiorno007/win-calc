/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('GlassCtrl', ['$scope', function ($scope) {
  var $glassContainer = $('.glass-container'),
      $glassBlock = $glassContainer.find('.glass-block'),
      //$glassFooterInner = $glassContainer.find('.footer-inner'),
      $glassBox = $glassContainer.find('.box'),
      $glassTitle = $glassContainer.find('.title'),

      DELAY_SHOW_PROFILES = 5 * STEP,
      g, DELAY_SHOW_PROF;

  typingTextWithDelay($glassTitle, DELAY_SHOW_PROFILES);

  for (g = 0; g < $glassBox.length; g++) {
    DELAY_SHOW_PROF = DELAY_SHOW_PROFILES + g * (STEP * 3);
    showElementWithDelay($($glassBox[g]), DELAY_SHOW_PROF);
  }

  // Select glass
  $glassBox.click(function () {
    $glassBlock.each(function () {
      $(this).removeClass(selectClass);
    });
    $glassBox.each(function () {
      $(this).removeClass(selectClass);
    });
    $(this).closest('.glass-block').addClass(selectClass);
    $(this).addClass(selectClass);
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
