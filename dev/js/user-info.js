/* globals STEP, showElementWithDelay, typingTextByChar, typingElementWithDelay */

(function ($) {
    'use strict';
    var $navmenuBTN = $('.user-info-container .nav-menu-btn'),
        $userLocation = $('.user-info-container .city-location'),
        $userName = $('.user-info-container .user-name'),
        $userIconLocation = $('.user-info-container .icon-cityLocation'),
        DELAY_SHOW_USER_INFO = 20 * STEP;

    showElementWithDelay($userIconLocation, DELAY_SHOW_USER_INFO);
    typingElementWithDelay($userLocation, DELAY_SHOW_USER_INFO);
    typingElementWithDelay($userName, DELAY_SHOW_USER_INFO);

    // Click on button to show nav-menu
    $navmenuBTN.click(function(){
        $(this).toggleClass('rotate');
    });
})(jQuery);