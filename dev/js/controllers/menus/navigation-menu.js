(function(){
  'use strict';

  /**
   * @ngInject
   */

  angular
    .module('MainModule')
    .controller('NavMenuCtrl', navigationMenuCtrl);

  function navigationMenuCtrl($scope, $http, $location, $translate, $timeout, $filter, $cordovaGeolocation, globalConstants, globalDB, localDB, NavMenuServ, localStorage, UserStor) {

console.log('START NAV MENU!!!!!!');
    console.log('START Time!!!!!!', new Date());
    var thisCtrl = this;
    $scope.global = localStorage.storage;
    $scope.userInfo = UserStor.userInfo;

    //thisCtrl.config
    $scope.navMenu = {
      DELAY_SHOW_STEP: 0.2,
      DELAY_SHOW_NAV_LIST: 5 * globalConstants.STEP,
      DELAY_SHOW_NAVICON: 10 * globalConstants.STEP,
      DELAY_TYPE_NAVTITLE: 10 * globalConstants.STEP,
      DELAY_TYPE_DIVIDER: 10 * globalConstants.STEP,
      DELAY_SHOW_ORDERS: 35 * globalConstants.STEP,
      DELAY_SHOW_NEWCALC_BTN: 35 * globalConstants.STEP,
      typing: 'on'
    };


    //------ clicking


    //============ methods ================//


    //------- Select menu item
    $scope.selectMenuItem = function(id) {
      $scope.navMenu.activeMenuItem = ($scope.navMenu.activeMenuItem === id) ? false : id;
    };

    //------- Select menu item with time out
    $scope.selectMenuItemTimeOut = function(id) {
      $scope.navMenu.activeMenuItem = id;
      $timeout(function() {
        $scope.navMenu.activeMenuItem = false;
      }, 200);
    };



    //-------- links of nav-menu items
    $scope.global.gotoMainPage = function () {
      $scope.global.isHistoryPage = false;
      $location.path('/main');
    };

    $scope.gotoCurrentProduct = function () {
      $scope.navMenu.activeMenuItem = false;
      $scope.global.startProgramm = false;
      $scope.global.isReturnFromDiffPage = true;
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
      //---- если идем в историю через корзину, заказ сохраняем в черновик
      /*if($scope.global.isOpenedCartPage) {
        $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
        $scope.global.isCreatedNewProject = false;
        $scope.global.isCreatedNewProduct = false;
      }*/
      $location.path('/history');
    };

    $scope.global.gotoCartPage = function () {
      $scope.global.showNavMenu = false;
      $location.path('/cart');
    };

    $scope.getCurrentGeolocation = function () {
      //------ Data from GPS device
      //navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
      $cordovaGeolocation.getCurrentPosition().then(successLocation, errorLocation);
      function successLocation(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&language=ru').
          success(function(data, status, headers, config) {
            //----- save previous current location
            //$scope.global.prevGeoLocation = angular.copy($scope.global.currentGeoLocation);

            var deviceLocation = data.results[0].formatted_address.split(', ');
            UserStor.userInfo.currCityId = 156; //TODO должны тянуть с базы согласно новому городу, но город гугл дает на украинском языке, в базе на русском
            UserStor.userInfo.currCityName = deviceLocation[deviceLocation.length-3];
            UserStor.userInfo.currRegionName = deviceLocation[deviceLocation.length-2];
            UserStor.userInfo.currCountryName = deviceLocation[deviceLocation.length-1];
            UserStor.userInfo.currClimaticZone = 7; //TODO
            UserStor.userInfo.currHeatTransfer = 0.99; //TODO
            UserStor.userInfo.currFullLocation = deviceLocation[deviceLocation.length-3] + ', ' + deviceLocation[deviceLocation.length-2] + ', ' + deviceLocation[deviceLocation.length-1];

            //console.log(data.results[0]);
          }).
          error(function(data, status, headers, config) {
            alert(status);
          });
      }
      function errorLocation(error) {
        alert(error.message);
      }
    };



    $scope.gotoAddElementsPanel = function() {
      if($scope.global.product.isAddElementsONLY) {
        $scope.global.startProgramm = false;
        $scope.global.isCreatedNewProject = false;
        $scope.global.createNewProduct();
      } else {
        //------- create new empty product
        $scope.global.product = angular.copy($scope.global.productSource);
        $scope.global.product.isAddElementsONLY = true;
        $scope.global.showNavMenu = false;
        $scope.global.isConfigMenu = true;
        $scope.global.showPanels = {};
        $scope.global.showPanels.showAddElementsPanel = true;
        $scope.global.isAddElementsPanel = true;
      }
    };

    $scope.gotoLinkMoreInfo = function() {
      //----- for android
      //navigator.app.loadUrl('http://axorindustry.com', { openExternal:true });
      //----- for ios
      var ref = window.open('http://axorindustry.com', '_system');
      ref.close();
    };

    $scope.switchVoiceHelper = function() {
      $scope.global.isVoiceHelper = !$scope.global.isVoiceHelper;
      if($scope.global.isVoiceHelper) {
        //------- set Language for Voice Helper
        $scope.global.voiceHelperLanguage = NavMenuServ.setLanguageVoiceHelper();
        playTTS($filter('translate')('construction.VOICE_SWITCH_ON'), $scope.global.voiceHelperLanguage);
      }
    };





    //----------- Create new Project
    $scope.clickNewProject = function() {

      //------ если старт и на главной странице, не сохраняет в черновики
      if($scope.global.startProgramm && !$scope.global.isOpenedHistoryPage && !$scope.global.isOpenedCartPage) {
        console.log('start Btn');
        $scope.global.startProgramm = false;
        $scope.global.prepareMainPage();

      //------- если после старта пошли в историю
      } else if($scope.global.startProgramm && $scope.global.isOpenedHistoryPage && !$scope.global.isOpenedCartPage) {
        console.log('start Btn from history');
        $scope.global.startProgramm = false;
        $scope.global.prepareMainPage();
        //------- create new empty product
        $scope.global.product = angular.copy($scope.global.productDefault);
        //------- create new empty order
        $scope.global.order = angular.copy($scope.global.orderSource);
        $location.path('/main');

      //------- создание нового проекта с сохранением в черновик предыдущего незаконченного
      } else if(!$scope.global.startProgramm && !$scope.global.isOrderFinished) {
        //------- если находимся на главной странице или в истории
        console.log('draft from history');
        if(!$scope.global.isOpenedCartPage) {
          //------ сохраняем черновик продукта в LocalDB
          console.log('draft from main page');
          $scope.global.inputProductInOrder();
          $scope.global.order.orderPriceTOTAL = $scope.global.product.productPriceTOTAL;
        }
        //------ сохраняем черновик заказа в LocalDB
        $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
        //------ create new order
        $scope.global.isReturnFromDiffPage = false;
        $scope.global.isChangedTemplate = false;
        $scope.global.isCreatedNewProject = true;
        $scope.global.isCreatedNewProduct = true;
        $scope.global.prepareMainPage();
        if($scope.global.isOpenedCartPage || $scope.global.isOpenedHistoryPage) {
          //------- create new empty product
          $scope.global.product = angular.copy($scope.global.productDefault);
          //------- create new empty order
          $scope.global.order = angular.copy($scope.global.orderSource);
          $location.path('/main');
        } else {
          $scope.global.createNewProject();
        }

      //------- создание нового проекта после сохранения заказа в истории
      } else if(!$scope.global.startProgramm && $scope.global.isOrderFinished) {
        console.log('order finish and new order!!!!');
        //------ create new order
        $scope.global.isReturnFromDiffPage = false;
        $scope.global.isChangedTemplate = false;
        $scope.global.isCreatedNewProject = true;
        $scope.global.isCreatedNewProduct = true;
        $scope.global.isOrderFinished = false;
        $scope.global.prepareMainPage();
        //------- create new empty product
        $scope.global.product = angular.copy($scope.global.productDefault);
        //------- create new empty order
        $scope.global.order = angular.copy($scope.global.orderSource);
        $location.path('/main');
      }

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
      $scope.global.order.productsPriceTOTAL = parseFloat($scope.global.order.productsPriceTOTAL.toFixed(2));
      $scope.global.order.paymentFirst = parseFloat($scope.global.order.paymentFirst.toFixed(2));
      $scope.global.order.paymentMonthly = parseFloat($scope.global.order.paymentMonthly.toFixed(2));
      $scope.global.order.paymentFirstPrimary = parseFloat($scope.global.order.paymentFirstPrimary.toFixed(2));
      $scope.global.order.paymentMonthlyPrimary = parseFloat($scope.global.order.paymentMonthlyPrimary.toFixed(2));
      $scope.global.order.orderPriceTOTAL = parseFloat($scope.global.order.orderPriceTOTAL.toFixed(2));
      $scope.global.order.orderPriceTOTALPrimary = parseFloat($scope.global.order.orderPriceTOTALPrimary.toFixed(2));
      angular.extend($scope.global.order, newOptions);
      //------- save order in orders LocalStorage
      if(!$scope.global.orderEditNumber || $scope.global.orderEditNumber < 0) {
        $scope.global.orders.push($scope.global.order);
      }
      //console.log(JSON.stringify($scope.global.order));
      //------- save order in LocalDB
      orderData = angular.copy($scope.global.order);
      delete orderData.products;

      //console.log('$scope.global.order.orderStyle === ', $scope.global.order);
      localDB.insertDB(localDB.ordersTableBD, orderData);
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

    //-------- delete order from LocalDB
    $scope.global.deleteOrderFromLocalDB = function(orderNum) {
      localDB.deleteDB(localDB.ordersTableBD, {'orderId': orderNum});
      localDB.deleteDB(localDB.productsTableBD, {'orderId': orderNum});
      localDB.deleteDB(localDB.addElementsTableBD, {'orderId': orderNum});
    };

    console.log('$scope.global.isOpenedHistoryPage!!!!!!!!!!!', $scope.global.isOpenedHistoryPage);

  }
})();