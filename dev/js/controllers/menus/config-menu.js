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


/*
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
*/


  //------ Check Product Edit
  $scope.global.checkIsEditProduct = function () {
    if ($scope.global.productEditNumber) {

      //------ Download Add Elements from localDB
      localDB.selectDB($scope.global.visorsTableBD, {'productId': $scope.global.productEditNumber}, function (results) {
        if (results.status) {
          $scope.global.chosenAddElements.selectedVisors = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });
      localDB.selectDB($scope.global.windowSillsTableBD, {'productId': $scope.global.productEditNumber}, function (results) {
        if (results.status) {
          $scope.global.chosenAddElements.selectedWindowSill = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      //------ Download Product Data from localDB
      localDB.selectDB($scope.global.orderTableBD, {'productId': $scope.global.productEditNumber}, function (results) {
        if (results.status) {
          var tempProduct = angular.copy(results.data);
          $scope.global.product.constructThumb = '#';
          $scope.global.product.constructionWidth = tempProduct[0].productWidth;
          $scope.global.product.constructionHeight = tempProduct[0].productHeight;
          $scope.global.product.profileName = tempProduct[0].profileName;
          $scope.global.product.glassName = tempProduct[0].glassName;
          $scope.global.product.hardwareName = tempProduct[0].hardwareName;
          $scope.global.product.laminationOuter = tempProduct[0].laminationNameOut;
          $scope.global.product.laminationInner = tempProduct[0].laminationNameIn;
          $scope.global.product.productPrice = tempProduct[0].productPrice;
          $scope.global.product.productQty = tempProduct[0].productQty;
          //console.log($scope.global.product);


          // change add element quantity as to product quantity
          for (var prop in $scope.global.chosenAddElements) {
            if (!$scope.global.chosenAddElements.hasOwnProperty(prop)) {
              continue;
            } else {
              if($scope.global.chosenAddElements[prop].length > 0) {
                for(var elem = 0; elem < $scope.global.chosenAddElements[prop].length; elem++) {
                  $scope.global.chosenAddElements[prop][elem].elementQty *= $scope.global.product.productQty;
                }
              }
            }
          }

        } else {
          console.log(results);
        }
      });

    } else {

      constructService.getConstructThumb(function (results) {
        if (results.status) {
          $scope.global.product.constructThumb = results.data.url;
        } else {
          console.log(results);
        }
      });

      constructService.getConstructSize(function (results) {
        if (results.status) {
          $scope.global.product.constructionWidth = results.data.width;
          $scope.global.product.constructionHeight = results.data.height;
        } else {
          console.log(results);
        }
      });

      constructService.getProfileSystem(function (results) {
        if (results.status) {
          $scope.global.product.profileName = results.data.name;
        } else {
          console.log(results);
        }
      });

      constructService.getGlass(function (results) {
        if (results.status) {
          $scope.global.product.glassName = results.data.name;
        } else {
          console.log(results);
        }
      });

      constructService.getWindowHardware(function (results) {
        if (results.status) {
          $scope.global.product.hardwareName = results.data.name;
        } else {
          console.log(results);
        }
      });

      constructService.getLamination(function (results) {
        if (results.status) {
          $scope.global.product.laminationOuter = results.data.outer.name;
          $scope.global.product.laminationInner = results.data.inner.name;
        } else {
          console.log(results);
        }
      });

      // Clear All AddElements in localStorage
      for (var prop in $scope.global.chosenAddElements) {
        if (!$scope.global.chosenAddElements.hasOwnProperty(prop)) {
          continue;
        } else {
          $scope.global.chosenAddElements[prop].length = 0;
        }
      }


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

          $scope.global.product.productPrice = results.data.price;

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
    }
  };

  $scope.global.checkIsEditProduct();

  //------- Select menu item

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

  // Close all panels
  function clearShowPanelsObj() {
    for (var item in $scope.global.showPanels) {
      delete $scope.global.showPanels[item];
    }
  }







  // Save Product in Order and enter in Cart
  $scope.inputOrderInCart = function() {
/*
    localDB.deleteTable($scope.global.orderTableBD);
    localDB.deleteTable($scope.global.visorsTableBD);
    localDB.deleteTable($scope.global.windowSillsTableBD);
*/
    var productData,
        addElementsData,
        addElementsObj = $scope.global.chosenAddElements;

    if($scope.global.ordersInCart) {
      ++$scope.global.ordersInCart;
    } else {
      $scope.global.ordersInCart = 1;
    }
    ++$scope.global.productCounter;

    productData = {
      "productId": $scope.global.productCounter,
      "productWidth": $scope.global.constructionSize.width,
      "productHeight": $scope.global.constructionSize.height,
      "profileName": $scope.global.profileName,
      "glassName": $scope.global.glassName,
      "hardwareName": $scope.global.hardwareName,
      "laminationNameOut": $scope.global.lamination.outer,
      "laminationNameIn": $scope.global.lamination.inner,
      "productPrice": $scope.global.productPrice,
      "productQty": 1
    };

    localDB.insertDB($scope.global.orderTableBD, productData);

    for(var prop in addElementsObj) {
      if (!addElementsObj.hasOwnProperty(prop)) {
        continue;
      }
      for (var elem = 0; elem < addElementsObj[prop].length; elem++) {

        switch (prop) {
          case 'selectedVisors':
            addElementsData = {
              "productId": $scope.global.productCounter,
              "elementId": addElementsObj[prop][elem].elementId,
              "elementType": addElementsObj[prop][elem].elementType,
              "elementName": addElementsObj[prop][elem].elementName,
              "elementQty": addElementsObj[prop][elem].elementQty,
              "elementWidth": addElementsObj[prop][elem].elementWidth,
              "elementPrice": addElementsObj[prop][elem].elementPrice
            };
            localDB.insertDB($scope.global.visorsTableBD, addElementsData);
            break;

          case 'selectedWindowSill':
            addElementsData = {
              "productId": $scope.global.productCounter,
              "elementId": addElementsObj[prop][elem].elementId,
              "elementType": addElementsObj[prop][elem].elementType,
              "elementName": addElementsObj[prop][elem].elementName,
              "elementQty": addElementsObj[prop][elem].elementQty,
              "elementWidth": addElementsObj[prop][elem].elementWidth,
              "elementColor": addElementsObj[prop][elem].elementColor,
              "elementPrice": addElementsObj[prop][elem].elementPrice
            };
            localDB.insertDB($scope.global.windowSillsTableBD, addElementsData);
            break;

        }
      }
    }


///*
    $timeout(function(){
      $scope.global.gotoCartPage();
    }, 2*STEP);
//*/
  }

}]);