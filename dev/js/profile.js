/* globals STEP, showElementWithDelay, typingTextByChar, typingElementWithDelay */

(function ($) {
    'use strict';
    var $profileBlock = $('.profile-container .profile-block'),
        $profileBox = $('.profile-container .profile-box'),
        $profileHead = $('.profile-container .profile-header'),

        selectProfileClass = 'selected',

        DELAY_SHOW_PROFILES = 20 * STEP;

    typingElementWithDelay($profileHead, DELAY_SHOW_PROFILES);

    for(var prof = 0; prof < $profileBox.length; prof++) {
        var DELAY_SHOW_PROF = DELAY_SHOW_PROFILES + prof * 200;
        showElementWithDelay($profileBox[prof], DELAY_SHOW_PROF);
    }


    // Select profile
    $profileBox.click(function(){
        $profileBlock.each(function () {
            $(this).removeClass(selectProfileClass);
        });
        $profileBox.each(function () {
            $(this).removeClass(selectProfileClass);
        });
        $(this).parent().addClass(selectProfileClass);
        $(this).addClass(selectProfileClass);
    });

})(jQuery);