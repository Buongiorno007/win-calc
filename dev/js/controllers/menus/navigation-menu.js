/* globals BauVoiceApp, STEP, typingTextByChar, showElementWithDelay, addClassWithDelay, removeClassWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('NavMenuCtrl', ['$scope', function ($scope) {
  var $navMenuHeader = $('.nav-menu-header'),
      $navmenuList = $navMenuHeader.find('.items-list'),
      $navmenuItem = $navmenuList.find('.item'),
      $navmenuDivider = $navMenuHeader.find('.divider'),
      $newCalcBTN = $('.nav-menu-footer .new-calc'),

      DELAY_SHOW_NAV_MENU = STEP,
      DELAY_SHOW_NAV_LISTS = DELAY_SHOW_NAV_MENU + 2 * STEP,
      DELAY_SHOW_NEWCALC_BNT = DELAY_SHOW_NAV_LISTS * 20;


  function animateNavMenuLists() {
    var movingClass = 'move',
        STEP_NAV_LIST = 500,
        STEP_NAV_ICON = 200,

        $navmenuContent,
        $navmenuItemIcon,
        $navmenuItemTitle,
        $navmenuItemBadge,

        DELAY_SHOW_NAV_LIST,
        DELAY_SHOW_NAV_CONTENT,
        DELAY_SHOW_NAV_TITLE,
        DELAY_SHOW_NAV_BADGE,
        DELAY_SHOW_NAV_ICON,
        ul, icon;

    for (ul = 0; ul < $navmenuList.length; ul++) {
      DELAY_SHOW_NAV_LIST = (DELAY_SHOW_NAV_LISTS + STEP_NAV_LIST * ul),
      DELAY_SHOW_NAV_CONTENT = DELAY_SHOW_NAV_LIST + STEP_NAV_LIST * 2,
      DELAY_SHOW_NAV_TITLE = DELAY_SHOW_NAV_CONTENT + STEP_NAV_ICON * 4,
      DELAY_SHOW_NAV_BADGE = DELAY_SHOW_NAV_TITLE + STEP_NAV_LIST * 5,

      $navmenuContent = $navmenuList.eq(ul).find('.item-content');
      $navmenuItemIcon = $navmenuList.eq(ul).find('.icon-splash');
      $navmenuItemTitle = $navmenuList.eq(ul).find('.title');
      $navmenuItemBadge = $navmenuList.eq(ul).find('.badge');

      addClassWithDelay($navmenuList.eq(ul), movingClass, DELAY_SHOW_NAV_CONTENT);
//      showElementWithDelay($navmenuList.eq(ul), DELAY_SHOW_NAV_LIST);
      removeClassWithDelay($navmenuContent, 'hidden', DELAY_SHOW_NAV_CONTENT);

      for (icon = 0; icon < $navmenuItemIcon.length; icon++) {
        DELAY_SHOW_NAV_ICON = DELAY_SHOW_NAV_CONTENT + STEP_NAV_ICON * icon;
        showElementWithDelay($navmenuItemIcon.eq(icon), DELAY_SHOW_NAV_ICON);
      }

      typingTextWithDelay($navmenuItemTitle, DELAY_SHOW_NAV_TITLE);

      if ($navmenuItemBadge.length) {
        showElementWithDelay($navmenuItemBadge, DELAY_SHOW_NAV_BADGE);
      }
    }
  }

  typingTextWithDelay($navmenuDivider, DELAY_SHOW_NAV_LISTS * 5);
  animateNavMenuLists();
  showElementWithDelay($newCalcBTN, DELAY_SHOW_NEWCALC_BNT);

  // menu click
  $navmenuItem.click(function () {
    var activeClass = 'active';

    $navmenuItem.each(function () {
      $(this).removeClass(activeClass);
    });

    $(this).addClass(activeClass);
  });
}]);