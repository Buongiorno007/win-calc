/* globals BauVoiceApp, STEP, typingIndex, typingTextByChar, createPrice, showElementWithDelay, removeClassWithDelay, addClassWithDelay, initTemplateContainer, initProfileContainer, initGlassContainer, initHardwareContainer, initLaminationContainer, initAuxContainer */

'use strict';

BauVoiceApp.controller('ConfigMenuCtrl', ['$scope', function ($scope) {
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
      switchConfigPanels('.' + panel, false);
    } else {
      $(this).removeClass(activeClass);
      switchConfigPanels('.' + panel, true);
    }
  });

  /*
   function testAnim(x) {
   $('#animationSandbox').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
   $(this).removeClass();
   });
   */

  function switchConfigPanels(itemSelected, onlyHide) {
    var itemGroup = '.config-panel',
        classShow = 'showConfigPanel',
        classHide = 'hideConfigPanel',
        checkOpenItem = $(itemGroup).hasClass(classShow),
        DELAY = 300,
        item,
        $itemCurr;

    if (checkOpenItem && !onlyHide) {
      for (item = 0; item < $(itemGroup).length; item++) {
        $itemCurr = $(itemGroup).eq(item);
        if ($itemCurr.hasClass(classShow)) {
          $itemCurr.addClass(classHide).removeClass(classShow);
          removeClassWithDelay($itemCurr, classHide, DELAY);
          addClassWithDelay(itemSelected, classShow, DELAY);
//          initConfigPanel(itemSelected);
        }
      }
    } else if (checkOpenItem && onlyHide) {
      $(itemSelected).addClass(classHide).removeClass(classShow);
      removeClassWithDelay(itemSelected, classHide, DELAY);
    } else {
      $(itemSelected).addClass(classShow);
//      initConfigPanel(itemSelected);
    }
  }

  function showConfigPanelContent(panelClass) {
    switch(panelClass) {
      case '.template-container':
        initTemplateContainer();
        break;
      case '.profile-container':
        initProfileContainer();
        break;
      case '.glass-container':
        initGlassContainer();
        break;
      case '.hardware-container':
        initHardwareContainer();
        break;
      case '.lamination-container':
        initLaminationContainer();
        break;
      case '.auxiliaries-container':
        initAuxContainer();
        break;
    }
  }

  function hideConfigPanelContent(delay) {
    setTimeout(function () {
      $('.config-panel').find('.visible').removeClass('visible');
      //typingIndex = false;
    }, delay);
  }
}]);