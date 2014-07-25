/* globals STEP, typingTextByChar, createPrice, showElementWithDelay */

(function ($) {
  'use strict';

  var $configList = $('.items-list'),
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
    var activeClass = 'active';

    $configItem.each(function () {
      $(this).removeClass(activeClass);
    });

    $(this).addClass(activeClass);
  });
})(jQuery);