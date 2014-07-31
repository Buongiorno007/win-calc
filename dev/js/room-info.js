/* globals STEP, typingTextByChar, typingElementWithDelay */

(function ($) {
    'use strict';
    var $coeffTitle = $('.coeff-container .coeff-title'),
        DELAY_SHOW_COEFF_TITLE = 20 * STEP;
    typingElementWithDelay($coeffTitle, DELAY_SHOW_COEFF_TITLE);

})(jQuery);