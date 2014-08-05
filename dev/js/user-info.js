/* globals STEP, showElementWithDelay, typingElementWithDelay */

(function ($) {
  'use strict';
  var $navmenuBTN = $('.user-info-container .nav-menu-btn'),
      $userLocation = $('.user-info-container .user-location'),
      $userName = $('.user-info-container .user-name'),
      $userIconLocation = $('.user-info-container .icon-location'),

      $pageContainer = $('.page-container'),

      showNavMemuClass = 'show-navmenu',
      hideNavMenuClass = 'hide-navmenu',
      showLeftSideClass = 'swiped',

      DELAY_SHOW_USER_INFO = 20 * STEP;

  showElementWithDelay($userIconLocation, DELAY_SHOW_USER_INFO);
  typingElementWithDelay($userLocation, DELAY_SHOW_USER_INFO);
  typingElementWithDelay($userName, DELAY_SHOW_USER_INFO);

  // Click on button to show nav-menu
  $navmenuBTN.click(function () {

    $(this).removeClass('move-btn');
    if ($(this).hasClass(showNavMemuClass)) {
      $(this).removeClass(showNavMemuClass).addClass(hideNavMenuClass);
      $pageContainer.addClass(showLeftSideClass);
    } else {
      $(this).removeClass(hideNavMenuClass).addClass(showNavMemuClass);
      $pageContainer.removeClass(showLeftSideClass);
    }
  });

})(jQuery);