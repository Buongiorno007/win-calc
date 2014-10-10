/* globals BauVoiceApp, STEP, typingTextByChar */

'use strict';

BauVoiceApp.controller('ConfigMenuCtrl', ['$scope', 'globalDB', 'localDB', 'localStorage', 'constructService', '$timeout', function ($scope, globalDB, localDB, localStorage, constructService,  $timeout) {

  $scope.global = localStorage;

  $scope.configMenu = {
    DELAY_START: STEP,
    DELAY_SHOW_CONFIG_LIST: 5 * STEP,
    DELAY_SHOW_FOOTER: 5 * STEP,
    DELAY_TYPE_ITEM_TITLE: 10 * STEP,
    typing: 'on'
  };

  $scope.dubleTyping = function() {
    $timeout(function() {
      var $configItemValue = $('.config-menu .value');
      $configItemValue.each(function () {
        var $configItemNameAside = $(this).next('.name.aside');
        if ($configItemNameAside.length) {
          typingTextByChar($(this), $configItemNameAside);
        }
      });
    },  $scope.configMenu.DELAY_TYPE_ITEM_TITLE);
  };


  constructService.getConstructThumb(function (results) {
    if (results.status) {
      $scope.global.constructThumb = results.data.url;
    } else {
      console.log(results);
    }
  });

  constructService.getConstructSize(function (results) {
    if (results.status) {
      $scope.global.constructionSize = {
        width: results.data.width,
        height: results.data.height
      };
    } else {
      console.log(results);
    }
  });

  constructService.getProfileSystem(function (results) {
    if (results.status) {
      $scope.global.profileName = results.data.name;
    } else {
      console.log(results);
    }
  });

  constructService.getGlass(function (results) {
    if (results.status) {
      $scope.global.glassName = results.data.name;
    } else {
      console.log(results);
    }
  });

  constructService.getWindowHardware(function (results) {
    if (results.status) {
      $scope.global.hardwareName = results.data.name;
    } else {
      console.log(results);
    }
  });

  constructService.getLamination(function (results) {
    if (results.status) {
      $scope.global.lamination = {
        outer: results.data.outer.name,
        inner: results.data.inner.name
      };
    } else {
      console.log(results);
    }
  });
/*
  constructService.getAdditionalElements(function (results) {
    if (results.status) {
      $scope.configMenu.additionalElments = results.data.elements;
    } else {
      console.log(results);
    }
  });
*/
  constructService.getPrice(function (results) {
    if (results.status) {
      //$scope.configMenu.price = results.data.price;
      //$scope.configMenu.currency = results.data.currency.name;

      $scope.global.productPrice = results.data.price;

      var currencySymbol = '';
      if (results.data.currency.name === 'uah') {
        currencySymbol = '₴';
      }
      $scope.currency = currencySymbol;
      $scope.global.currency = currencySymbol;
    } else {
      console.log(results);
    }
  });
/*
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
 */
  //Select menu item
  $scope.selectTemplatePanel = function() {
    if($scope.global.showPanels.showTemplatePanel) {
      $scope.global.showPanels.showTemplatePanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showTemplatePanel = true;
      $scope.global.isTemplatePanel = true;
    }
  };
  $scope.selectProfilePanel = function() {
    if($scope.global.showPanels.showProfilePanel) {
      $scope.global.showPanels.showProfilePanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showProfilePanel = true;
      $scope.global.isProfilePanel = true;
    }
  };
  $scope.selectGlassPanel = function() {
    if($scope.global.showPanels.showGlassPanel) {
      $scope.global.showPanels.showGlassPanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showGlassPanel = true;
      $scope.global.isGlassPanel = true;
    }
  };
  $scope.selectHardwarePanel = function() {
    if($scope.global.showPanels.showHardwarePanel) {
      $scope.global.showPanels.showHardwarePanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showHardwarePanel = true;
      $scope.global.isHardwarePanel = true;
    }
  };
  $scope.selectLaminationPanel = function() {
    if($scope.global.showPanels.showLaminationPanel) {
      $scope.global.showPanels.showLaminationPanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showLaminationPanel = true;
      $scope.global.isLaminationPanel = true;
    }
  };
  $scope.selectAddElementsPanel = function() {
    if($scope.global.showPanels.showAddElementsPanel) {
      $scope.global.showPanels.showAddElementsPanel = false;
      $scope.global.isAddElementListView = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showAddElementsPanel = true;
      $scope.global.isAddElementsPanel = true;
    }
  };

  function clearShowPanelsObj() {
    for (var item in $scope.global.showPanels) {
      delete $scope.global.showPanels[item];
    }
  }
  /*
  $scope.changePrice = function (price) {
    $scope.price = price;
  };
  */


  // Save Product in Order and enter in Cart
  $scope.inputOrderInCart = function() {

    //localDB.deleteTable();

    var productQtyValue,
        productData,
        addElementsObj = $scope.global.chosenAddElements,
        addElementsString;

    if($scope.global.ordersInCart) {
      productQtyValue = ++$scope.global.ordersInCart;
    } else {
      productQtyValue = 1;
    }
/*
    if(addElementsObj) {
      for(var prop in addElementsObj) {
        if (!addElementsObj.hasOwnProperty(prop)) continue
        for (var element = 0; element < addElementsObj.prop.length; prop++) {
          addElementsString += addElementsObj.prop[element].toString();
        }
      }
      console.log($scope.global.chosenAddElements);
      console.log(addElementsString);
    } else {
      addElementsString = false;
    }
*/
    productData = {
      "productName": 'window',
      "productWidth": $scope.global.constructionSize.width,
      "productHeight": $scope.global.constructionSize.height,
      "profileName": $scope.global.profileName,
      "glassName": $scope.global.glassName,
      "hardwareName": $scope.global.hardwareName,
      "laminationNameOut": $scope.global.lamination.outer,
      "laminationNameIn": $scope.global.lamination.inner,
      //"addElements": addElementsString,
      "productQty": 1
    };

    localDB.insert(productData);

    $timeout(function(){
      $scope.global.gotoCartPage();
    }, 2*STEP);
  }

}]);