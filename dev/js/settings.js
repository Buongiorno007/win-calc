/* globals STEP, typingTextByChar, showElementWithDelay, typingElementWithDelay, showElementWithDelay */

(function ($) {
  'use strict';
  var $setPage = $('.setting-page'),
      $setList = $setPage.find('.setting-list'),
      $setTitle = $setPage.find('.setting-title'),
      $setListDivider = $setPage.find('.divider'),
      $setListLabel = $setPage.find('.setting-item-label'),
      $setListData = $setPage.find('.setting-item-data'),
      $setListChang = $setPage.find('.setting-item-change'),
      $setPhoneBTN = $setPage.find('.phone-btn'),

      DELAY_SHOW_TXT = 10 * STEP;

  typingTextByChar($setTitle);
  showElementWithDelay($setList, DELAY_SHOW_TXT);
  typingElementWithDelay($setListDivider, DELAY_SHOW_TXT);
  typingElementWithDelay($setListLabel, DELAY_SHOW_TXT);
  typingElementWithDelay($setListData, 2*DELAY_SHOW_TXT);

  showElementWithDelay($setListChang, 2*DELAY_SHOW_TXT);
  showElementWithDelay($setPhoneBTN, 2*DELAY_SHOW_TXT);

})(jQuery);



