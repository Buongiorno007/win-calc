/* globals STEP, activeClass, typingTextByChar, showElementWithDelay, addClassWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('NavMenuCtrl', ['$scope', '$http', '$location', 'globalDB', 'constructService', 'localDB', 'localStorage', '$timeout', function ($scope, $http, $location, globalDB, constructService, localDB, localStorage, $timeout) {

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

/*
  // Check Products in Order
  $scope.checkingForNewOrder = function() {
    if ($scope.global.isCreatedNewProject) {
      //----------- create order number for new project
      $scope.global.order.orderId = Math.floor((Math.random() * 100000));
      //$scope.global.isCreatedNewProject = false;
      $scope.global.productCounter = false;
      //console.log('navmenu NEW - ' + $scope.global.isCreatedNewProject);
      //console.log('navmenu NEW orderNumber - ' + $scope.global.order.orderIdorder.orderId);
    } else {
      //console.log('navmenu OLD - ' + $scope.global.order.orderIdorder.orderId);
      localDB.selectDB($scope.global.productsTableBD, {'orderId': $scope.global.order.orderId}, function (results) {
        if (results.status) {
          $scope.global.productCounter = results.data.length;
        } else {
          console.log(results);
        }
      });
    }
  };
  //----- generate new order number or calculate products in order
  $scope.checkingForNewOrder();
*/

  //------- Select menu item
  $scope.selectMenuItem = function(id) {
    if($scope.navMenu.activeMenuItem === id) {
      $scope.navMenu.activeMenuItem = false;
    } else {
      $scope.navMenu.activeMenuItem = id;
    }
  };

  //------- Select menu item with time out
  $scope.selectMenuItemTimeOut = function(id) {
    $scope.navMenu.activeMenuItem = id;
    $timeout(function() {
      $scope.navMenu.activeMenuItem = false;
    }, 100);
  };

  //-------- links of nav-menu items
  $scope.global.gotoMainPage = function () {
    $scope.global.isHistoryPage = false;
    $location.path('/main');
  };

  $scope.gotoCurrentProduct = function () {
    $scope.navMenu.activeMenuItem = false;
    $scope.global.prepareMainPage();
    $location.path('/main');
  };

  $scope.global.gotoLocationPage = function () {
    $location.path('/location');
  };

  $scope.global.gotoSettingsPage = function() {
    $location.path('/settings');
  };

  $scope.gotoHistoryPage = function () {
    $scope.global.showNavMenu = false;
    if($scope.global.isOpenedCartPage) {
      $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
    }
    $location.path('/history');
  };

  $scope.global.gotoCartPage = function () {
    $scope.global.showNavMenu = false;
    $location.path('/cart');
  };

  $scope.getCurrentGeolocation = function () {
    //------ Data from GPS device
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
    function successLocation(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&language=ru').
        success(function(data, status, headers, config) {
          //----- save previous current location
          $scope.global.prevGeoLocation = angular.copy($scope.global.currentGeoLocation);

          var deviceLocation = data.results[0].formatted_address.split(', ');
          $scope.global.currentGeoLocation = {
            cityId: 156,
            cityName: deviceLocation[deviceLocation.length-3],
            regionName: deviceLocation[deviceLocation.length-2],
            countryName: deviceLocation[deviceLocation.length-1],
            climaticZone: 7,
            heatTransfer: 0.99,
            fullLocation: deviceLocation[deviceLocation.length-3] + ', ' + deviceLocation[deviceLocation.length-2] + ', ' + deviceLocation[deviceLocation.length-1]
          };
          console.log($scope.global.currentGeoLocation.cityName);
        }).
        error(function(data, status, headers, config) {
          alert(status);
        });
    }
    function errorLocation(error) {
      alert(error.message);
    }
  };
/*
  $scope.setCurrentGeoLocation = function () {
    var prevLocation = angular.copy( $scope.global.prevGeoLocation),
        currLocation = angular.copy($scope.global.currentGeoLocation);
    $scope.global.currentGeoLocation = prevLocation;
    $scope.global.prevGeoLocation = currLocation;
  };
*/
  $scope.gotoAddElementsPanel = function() {
    //------- create new empty product
    $scope.global.product = angular.copy($scope.global.productSource);
    $scope.global.isAddElementsONLY = true;
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showAddElementsPanel = true;
    $scope.global.isAddElementsPanel = true;
  };

  $scope.switchVoiceHelper = function() {
    $scope.global.isVoiceHelper = !$scope.global.isVoiceHelper;
    if($scope.global.isVoiceHelper) {
      playTTS("голосовой режим включен");
    }
  };





  //----------- Create new Project FIRST
  $scope.clickNewProjectFirst = function() {
    console.log('start');
    $scope.global.startProgramm = false;
    $scope.global.prepareMainPage();
  };

  //----------- Create new Project
  $scope.clickNewProject = function() {
    //------ сохраняем черновик продукта в LocalDB если создается новый заказ на главной странице
    console.log('draft in main page');
    $scope.global.inputProductInOrder();
    $scope.global.order.orderPriceTOTAL = $scope.global.product.productPriceTOTAL;
    //------ сохраняем черновик заказа в LocalDB
    $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
    //------ create new order
    $scope.global.isCreatedNewProject = true;
    $scope.global.prepareMainPage();
    $scope.global.createNewProject();
  };


  $scope.clickNewProjectCart = function() {
    console.log('draft in cart page');
    $scope.global.isOpenedCartPage = false;
    //------ сохраняем черновик заказа в LocalDB
    $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
    $scope.global.isCreatedNewProject = true;
    $scope.global.prepareMainPage();
    $location.path('/main');
  };

  $scope.global.prepareMainPage = function() {
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showTemplatePanel = true;
    $scope.global.isTemplatePanel = true;
  };







  //-------- save Order into Local DB
  $scope.global.insertOrderInLocalDB = function(newOptions, orderType, orderStyle) {
    var orderData = {};

    $scope.global.order.orderType = orderType;
    $scope.global.order.orderStyle = orderStyle;
    $scope.global.order.productsQty = $scope.global.order.products.length;
    angular.extend($scope.global.order, newOptions);
    //------- save order in orders LocalStorage
    $scope.global.orders.push($scope.global.order);

    //------- save order in LocalDB
    orderData = angular.copy($scope.global.order);
    delete orderData.products;

    //console.log('$scope.global.order.orderStyle === ', $scope.global.order);
    localDB.insertDB($scope.global.ordersTableBD, orderData);
    $scope.global.isCreatedNewProject = true;
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

  };

}]);