/* globals STEP, typingTextByChar, showElementWithDelay, addClassWithDelay, removeClassWithDelay, typingElementWithDelay */

(function ($) {
    'use strict';

    var $navmenuList = $('.nav-menu-header .items-list'),
        $navmenuItem = $navmenuList.find('.item'),
        $navmenuDivider = $('.nav-menu-header .divider'),
        DELAY_SHOW_NAV_MENU = STEP,
        DELAY_SHOW_NAV_LISTS = DELAY_SHOW_NAV_MENU + 2*STEP;


    function animateNavMenuLists() {
        var movingClass = 'move',
            STEP_NAV_LIST = 500,
            STEP_NAV_ICON = 200;

        for(var ul = 0; ul < $navmenuList.length; ul++) {
            var DELAY_SHOW_NAV_LIST = (DELAY_SHOW_NAV_LISTS + STEP_NAV_LIST * ul),
                DELAY_SHOW_NAV_CONTENT = DELAY_SHOW_NAV_LIST + STEP_NAV_LIST * 2,
                DELAY_SHOW_NAV_TITLE = DELAY_SHOW_NAV_CONTENT + STEP_NAV_ICON * 4,
                DELAY_SHOW_NAV_BADGE = DELAY_SHOW_NAV_TITLE + STEP_NAV_LIST * 5,
                $navmenuContent = $($navmenuList[ul]).find('.item-content'),
                $navmenuItemIcon = $($navmenuList[ul]).find('.icon-splash'),
                $navmenuItemTitle = $($navmenuList[ul]).find('.title'),
                $navmenuItemBadge = $($navmenuList[ul]).find('.badge');

            showElementWithDelay($navmenuList[ul], DELAY_SHOW_NAV_LIST);
            addClassWithDelay($navmenuList[ul], movingClass, DELAY_SHOW_NAV_LIST);
            removeClassWithDelay($navmenuContent, 'hidden', DELAY_SHOW_NAV_CONTENT);

            for(var icon = 0; icon < $navmenuItemIcon.length; icon++) {
                var DELAY_SHOW_NAV_ICON = DELAY_SHOW_NAV_CONTENT + STEP_NAV_ICON * icon;
                showElementWithDelay($navmenuItemIcon[icon], DELAY_SHOW_NAV_ICON);
            }

            typingElementWithDelay($navmenuItemTitle, DELAY_SHOW_NAV_TITLE);

            if($navmenuItemBadge.length) {
                showElementWithDelay($navmenuItemBadge, DELAY_SHOW_NAV_BADGE);
            }
        }
    }

    typingElementWithDelay($navmenuDivider, DELAY_SHOW_NAV_LISTS * 5);
    animateNavMenuLists();

// menu click
    $navmenuItem.click(function () {
        var activeClass = 'active';

        $navmenuItem.each(function () {
            $(this).removeClass(activeClass);
        });

        $(this).addClass(activeClass);
    });

})(jQuery);
