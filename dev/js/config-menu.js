/* globals STEP, typingTextByChar, createPrice, showElementWithDelay, removeClassWithDelay, addClassWithDelay */

(function ($) {
  'use strict';

  var $configList = $('.config-menu .items-list'),
      $configItem = $configList.find('.item'),
      $configItemIcon = $configItem.find('.icon'),


      DELAY_SHOW_CONFIG_LIST = STEP,
      DELAY_FILL_CONFIG_LIST = DELAY_SHOW_CONFIG_LIST + 4 * STEP,
      DELAY_SHOW_CONFIG_ITEM_ICON = DELAY_FILL_CONFIG_LIST + 5 * STEP;

  showElementWithDelay($configList, DELAY_SHOW_CONFIG_LIST);

  setTimeout(function () {
    var $configItemTitle = $configItem.find('.title'),
        $configItemName = $configItem.find('.name'),
        $configItemValue = $configItem.find('.value'),
        $price = $('#price'),
        $currency = $('#currency');

    $configItemTitle.each(function () {
      typingTextByChar($(this));
    });

    $configItemName.each(function () {
      // элементы с классом name могут иметь класс aside, который выводится позже
      if (!$(this).hasClass('aside')) {
        typingTextByChar($(this));
      }
    });

    $configItemValue.each(function () {
      var $configItemNameAside = $(this).next('.name.aside');

      if ($configItemNameAside.length) {
        typingTextByChar($(this), $configItemNameAside);
      } else {
        typingTextByChar($(this));
      }
    });

    createPrice($price);
    // TODO: Валюта должна быть включена в функцию создания цены
    $currency.show();
  }, DELAY_FILL_CONFIG_LIST);

  showElementWithDelay($configItemIcon, DELAY_SHOW_CONFIG_ITEM_ICON);

  $configItem.click(function () {
    var activeClass = 'active',
        panel = $(this).data('panel');



    if (!$(this).hasClass(activeClass)) {
      $configItem.each(function () {
        $(this).removeClass(activeClass);
      });
      $(this).addClass(activeClass);
      switchConfigPanels('.config-panel', '.'+panel, 'show', 'hide', 500);
    }


    function switchConfigPanels(itemGroup, itemSelected, classShow, classHide, delay) {
      var checkOpenItem = $(itemGroup).hasClass(classShow),
          item,
          $itemCurr;

      if (checkOpenItem) {
        for (item = 0; item < $(itemGroup).length; item++) {
          $itemCurr = $(itemGroup).eq(item);
          if ($itemCurr.hasClass(classShow)) {
            $itemCurr.addClass(classHide).removeClass(classShow);
            removeClassWithDelay($itemCurr, classHide, delay);
            addClassWithDelay($(itemSelected), classShow, delay);
          }
        }
      } else {
        $(itemSelected).addClass(classShow);
      }
    }
      /*
      function testAnim(x) {
        $('#animationSandbox').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(this).removeClass();
      });
      */

  });
})(jQuery);