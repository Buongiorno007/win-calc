/* globals STEP, typingTextByChar, showElementWithDelay, typingElementWithDelay */

(function ($) {
  'use strict';
  var $pswPage = $('.password-page'),
      $pswTitle = $pswPage.find('.title'),
      $pswList = $pswPage.find('.list'),
      $pswLabel = $pswPage.find('.psw-label'),
      $pswData = $pswPage.find('.psw-data'),

      DELAY_SHOW_PSW = 10 * STEP;

  typingTextByChar($pswTitle);
  showElementWithDelay($pswList, 'block', DELAY_SHOW_PSW);
  typingElementWithDelay($pswLabel, DELAY_SHOW_PSW);
  typingElementWithDelay($pswData, DELAY_SHOW_PSW);

})(jQuery);