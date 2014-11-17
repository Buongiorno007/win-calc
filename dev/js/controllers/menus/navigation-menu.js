/* globals STEP, activeClass, typingTextByChar, showElementWithDelay, addClassWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('NavMenuCtrl', ['$scope', '$location', 'globalDB', 'constructService', 'localDB', 'localStorage', function ($scope, $location, globalDB, constructService, localDB, localStorage) {

  $scope.global = localStorage;

  $scope.navMenu = {
    DELAY_SHOW_NAV_LIST: 5 * STEP,
    DELAY_SHOW_STEP: 0.2,
    DELAY_SHOW_NAVICON: 10 * STEP,
    DELAY_TYPE_NAVTITLE: 10 * STEP,
    DELAY_TYPE_DIVIDER: 10 * STEP,
    DELAY_SHOW_ORDERS: 35 * STEP,
    DELAY_SHOW_NEWCALC_BTN: 35 * STEP,
    typing: 'on'
  };
  //console.log('start');
  //console.log('navmenu - ' + $scope.global.isCreatedNewProject);
  //console.log('navmenu orderNumber - ' + $scope.global.orderNumber);

  // Check Products in Order
  $scope.checkingForNewOrder = function() {
    if ($scope.global.isCreatedNewProject) {
      //----------- create order number for new project
      $scope.global.orderNumber = Math.floor((Math.random() * 100000));
      $scope.global.isCreatedNewProject = false;
      $scope.global.productCounter = false;
      //console.log('navmenu NEW - ' + $scope.global.isCreatedNewProject);
      //console.log('navmenu NEW orderNumber - ' + $scope.global.orderNumber);
    } else {
      //console.log('navmenu OLD - ' + $scope.global.orderNumber);
      localDB.selectDB($scope.global.productsTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
        if (results.status) {
          $scope.global.productCounter = results.data.length;
        } else {
          console.log(results);
        }
      });
    }
  };

  $scope.checkingForNewOrder();


  $scope.global.gotoMainPage = function () {
    $scope.global.isHistoryPage = false;
    $location.path('/main');
  };

  $scope.global.gotoLocationPage = function () {
    $location.path('/location');
  };

  $scope.gotoSettingsPage = function () {
    $location.path('/settings');
  };

  $scope.gotoHistoryPage = function () {
    $location.path('/history');
  };
  $scope.global.gotoCartPage = function () {
    $scope.global.showNavMenu = false;
    $location.path('/cart');
  };

  $scope.getCurrentGeolocation = function () {

  };

  $scope.setCurrentCity = function (city) {

  };

  $scope.gotoAddElementsPanel = function() {
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showAddElementsPanel = true;
    $scope.global.isAddElementsPanel = true;
  };

  //---------- clearing for create new Product
  $scope.global.createNewProduct = function() {
    $scope.global.productEditNumber = false;
    $scope.global.templateSource = null;
    delete $scope.global.templateSource;
    //$scope.global.templateDefault = null;
    //delete $scope.global.templateDefault;
    //$scope.global.product = {};
    $scope.global.objXFormedPrice = angular.copy($scope.global.objXFormedPriceSource);

    if(!$scope.global.isOpenedCartPage) {
      $scope.global.productInit();
    }
    $scope.global.isOpenedCartPage = false;
    $scope.navMenu.activeMenuItem = false;
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showTemplatePanel = true;
    $scope.global.isTemplatePanel = true;
    $location.path('/main');
  };

  //----------- Create new Project
  $scope.global.createNewProject = function() {
    //------ если не были в корзине, сохраняем проект в черновик
    if(!$scope.global.isOpenedCartPage) {
      $scope.global.inputProductInOrder();
    }
    //------ если не вызывались окна оформления заказа
    if(!$scope.global.isCreatedNewProject && !$scope.global.isSavedOrderInHistory) {
      $scope.global.orderTotalPrice = $scope.global.product.productPrice;
      $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
    }

    $scope.global.isCreatedNewProject = true;
    //console.log('press button');
    $scope.checkingForNewOrder();
    $scope.global.createNewProduct();
  };

  //Select menu item
  $scope.selectMenuItem = function(id) {
    if($scope.navMenu.activeMenuItem === id) {
      $scope.navMenu.activeMenuItem = false;
    } else {
      $scope.navMenu.activeMenuItem = id;
    }
  };


  //-------- save Order into Local DB
  $scope.global.insertOrderInLocalDB = function(newOptions, orderType, orderStyle) {

    $scope.orderData = {
      "orderId": $scope.global.orderNumber,
      "orderType": orderType,
      "orderStyle": orderStyle,
      "productsQty": $scope.global.productCounter,
      "floor": $scope.global.selectedFloor,
      "floorPrice": $scope.global.selectedFloorPrice,
      "assembling": $scope.global.selectedAssembling,
      "assemblingPrice": $scope.global.selectedAssemblingPrice,
      "deliveryDatePrimary": $scope.global.deliveryDate,
      "deliveryDate": $scope.global.newDeliveryDate ,
      "instalmentPeriod": $scope.global.selectedInstalmentPeriod,
      "instalmentPercent": $scope.global.selectedInstalmentPercent,
      "totalPrice": $scope.global.orderTotalPrice,
      "totalPricePrimary": $scope.global.orderTotalPricePrimary,
      "totalPriceFirst":  $scope.global.paymentFirst,
      "totalPriceMonthly": $scope.global.paymentMonthly,
      "totalPriceFirstPrimary": $scope.global.paymentFirstPrimary,
      "totalPriceMonthlyPrimary": $scope.global.paymentMonthlyPrimary,
      "name": '',
      "location": '',
      "address": '',
      "mail": '',
      "phone": '',
      "phone2": '',
      "itn": 0,
      "instalment": '',
      "starttime": '',
      "endtime": '',
      "target": ''
    };
/*
    //------- merge objects for save in local db
    if(newOptions.length > 0) {
      for(var opt in newOptions) {
        if (!newOptions.hasOwnProperty(opt)) {
          continue;
        } else {
          for(var d in $scope.orderData) {
            if (!newOptions.hasOwnProperty(d)) {
              continue;
            } else {
              if(d === opt) {
                $scope.orderData[d] = newOptions[opt];
              }
            }
          }
        }
      }
    }
*/
    angular.extend($scope.orderData, newOptions);
    //console.log(newOptions);
    //console.log($scope.orderData);
    localDB.insertDB($scope.global.ordersTableBD, $scope.orderData);

  };

}]);