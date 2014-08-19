/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, movePanelClass, typingTextByChar, showElementWithDelay, removeClassWithDelay, addClassWithDelay, initTemplateContainer, initProfileContainer, initGlassContainer, initHardwareContainer, initLaminationContainer, initAuxContainer */

'use strict';

BauVoiceApp.controller('ConfigMenuCtrl', ['$scope', 'localStorage', 'constructService', function ($scope, localStorage, constructService) {
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
        $configItemValue = $configItem.find('.value');

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
  }, DELAY_FILL_CONFIG_LIST);

  showElementWithDelay($configItemIcon, DELAY_SHOW_CONFIG_ITEM_ICON);

  $configItem.click(function () {
    //var activeClass = 'active',
     var panel = $(this).data('panel');

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

  function switchConfigPanels(itemSelected, onlyHide) {
    var itemGroup = '.config-panel',
        checkOpenItem = $(itemGroup).hasClass(activeClass),
        DELAY = 500,
        item,
        $itemCurr;

    if (checkOpenItem && !onlyHide) {
      for (item = 0; item < $(itemGroup).length; item++) {
        $itemCurr = $(itemGroup).eq(item);

        if ($itemCurr.hasClass(activeClass)) {
          $itemCurr.removeClass(movePanelClass);
          removeClassWithDelay($itemCurr, activeClass, DELAY);
          hideConfigPanelContent(DELAY);
          addClassWithDelay(itemSelected, activeClass, DELAY);
          addClassWithDelay(itemSelected, movePanelClass, DELAY+STEP);
        }
      }
    } else if (checkOpenItem && onlyHide) {
      $(itemSelected).removeClass(movePanelClass);
      removeClassWithDelay(itemSelected, activeClass, DELAY);
      hideConfigPanelContent(DELAY);
    } else {
      $(itemSelected).addClass(activeClass);
      addClassWithDelay(itemSelected, movePanelClass, STEP);
    }
  }

/*
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
*/
  function hideConfigPanelContent(delay) {
    setTimeout(function () {
      $('.config-panel').find('.visible').removeClass('visible');
      //typingIndex = false;
    }, delay);
  }

  $scope.configMenu = {};

  constructService.getConstructThumb(function (results) {
    if (results.status) {
      $scope.configMenu.constructThumb = results.data.url;
    } else {
      console.log(results);
    }
  });

  constructService.getConstructSize(function (results) {
    if (results.status) {
      $scope.configMenu.construction = {
        width: results.data.width,
        height: results.data.height
      };
    } else {
      console.log(results);
    }
  });

  constructService.getProfileSystem(function (results) {
    if (results.status) {
      $scope.configMenu.profileName = results.data.name;
    } else {
      console.log(results);
    }
  });

  constructService.getGlass(function (results) {
    if (results.status) {
      $scope.configMenu.glassName = results.data.name;
    } else {
      console.log(results);
    }
  });

  constructService.getWindowHardware(function (results) {
    if (results.status) {
      $scope.configMenu.windowHardware = results.data.name;
    } else {
      console.log(results);
    }
  });

  constructService.getLamination(function (results) {
    if (results.status) {
      $scope.configMenu.lamination = {
        outer: results.data.outer.name,
        inner: results.data.inner.name
      };
    } else {
      console.log(results);
    }
  });

  constructService.getAdditionalElements(function (results) {
    if (results.status) {
      $scope.configMenu.additionalElments = results.data.elements;
    } else {
      console.log(results);
    }
  });

  constructService.getPrice(function (results) {
    if (results.status) {
      $scope.configMenu.price = results.data.price;
      $scope.configMenu.currency = results.data.currency.name;
    } else {
      console.log(results);
    }
  });

  $scope.setCurrencySymbol = function (currency) {
    var currencySymbol = '';

    if (currency === 'uah') {
      currencySymbol = '₴';
    }

    return currencySymbol;
  };

  localStorage.getOrdersCart(function (results) {
    if (results.status) {
      $scope.configMenu.ordersInCart = results.data.ordersInCart;
    } else {
      console.log(results);
    }
  });

  $scope.changePrice = function (price) {
    $scope.configMenu.price = price;
  };
}]);