/* globals STEP, activeClass, typingTextByChar, showElementWithDelay, addClassWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('NavMenuCtrl', ['$scope', '$http', '$location', 'globalDB', 'constructService', 'localDB', 'localStorage', '$translate', '$timeout', '$filter', function ($scope, $http, $location, globalDB, constructService, localDB, localStorage, $translate, $timeout, $filter) {

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


  //--------- get user data and location for first time

  if($scope.global.startProgramm) {
    localDB.selectAllDBGlobal($scope.global.usersTableDBGlobal, function (results) {
      if (results.status) {
        $scope.global.userInfo = angular.copy(results.data[0]);
        //------ find user city in global DB
        localDB.selectDBGlobal($scope.global.citiesTableDBGlobal, {'id': $scope.global.userInfo.city_id }, function (results) {
          if (results.status) {
            $scope.global.userInfo.cityName = results.data[0].name;
            //------ find user region in global DB
            localDB.selectDBGlobal($scope.global.regionsTableDBGlobal, {'id': results.data[0].region_id }, function (results) {
              if (results.status) {
                $scope.global.userInfo.regionName = results.data[0].name;
                $scope.global.userInfo.climaticZone = results.data[0].climatic_zone;
                $scope.global.userInfo.heatTransfer = results.data[0].heat_transfer;
                //------ find user country in global DB
                localDB.selectDBGlobal($scope.global.countriesTableDBGlobal, {'id': results.data[0].country_id }, function (results) {
                  if (results.status) {
                    $scope.global.userInfo.countryName = results.data[0].name;
                    $scope.global.userInfo.fullLocation = '' + $scope.global.userInfo.cityName + ', ' + $scope.global.userInfo.regionName + ', ' + $scope.global.userInfo.countryName;

                    //------ set current GeoLocation
                    $scope.global.currentGeoLocation = {
                      cityId: angular.copy($scope.global.userInfo.city_id),
                      cityName: angular.copy($scope.global.userInfo.cityName),
                      regionName: angular.copy($scope.global.userInfo.regionName),
                      countryName: angular.copy($scope.global.userInfo.countryName),
                      climaticZone: angular.copy($scope.global.userInfo.climaticZone),
                      heatTransfer: angular.copy($scope.global.userInfo.heatTransfer),
                      fullLocation: angular.copy($scope.global.userInfo.fullLocation)
                    };
                    $scope.setUserLanguage($scope.global.userInfo.countryName);
                    //console.log('userInfo',$scope.global.userInfo);
                  } else {
                    console.log(results);
                  }
                });

              } else {
                console.log(results);
              }
            });
          } else {
            console.log(results);
          }
        });
      } else {
        console.log(results);
      }
    });
    //$scope.global.firstGetUserData = false;
  }

  //---------- define language relate to user data
  $scope.setUserLanguage = function(country) {
    switch(country) {
      case 'Украина':
        $scope.global.userInfo.langName = $scope.global.languages[0].name;
        $scope.global.userInfo.langLabel = $scope.global.languages[0].label;
        $translate.use($scope.global.languages[0].label);
        break;
      case 'Россия':
        $scope.global.userInfo.langName = $scope.global.languages[1].name;
        $scope.global.userInfo.langLabel = $scope.global.languages[1].label;
        $translate.use($scope.global.languages[1].label);
        break;
    }
    console.log('nav-menu === ',$scope.global.userInfo.langLabel);
    $scope.global.setLanguageVoiceHelper($scope.global.userInfo.langLabel);
  };

  $scope.global.setLanguageVoiceHelper = function(langLabel) {
    $scope.global.voiceHelperLanguage = 'ru_RU';
    /*
    switch (langLabel) {
      //case 'ua': $scope.global.voiceHelperLanguage = 'ukr-UKR';
      case 'ua': $scope.global.voiceHelperLanguage = 'ru_RU';
        break;
      case 'ru': $scope.global.voiceHelperLanguage = 'ru_RU';
        break;
      case 'en': $scope.global.voiceHelperLanguage = 'en_US';
        break;
      case 'en': $scope.global.voiceHelperLanguage = 'de_DE';
        break;
      case 'ro': $scope.global.voiceHelperLanguage = 'ro_RO';
        break;
    }
    */
  };

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

  $scope.switchVoiceHelper = function() {
    $scope.global.isVoiceHelper = !$scope.global.isVoiceHelper;
    if($scope.global.isVoiceHelper) {
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
    $scope.global.orders.push($scope.global.order);

    //------- save order in LocalDB
    orderData = angular.copy($scope.global.order);
    delete orderData.products;

    //console.log('$scope.global.order.orderStyle === ', $scope.global.order);
    localDB.insertDB($scope.global.ordersTableBD, orderData);
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
    localDB.deleteDB($scope.global.ordersTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.productsTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.gridsTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.visorsTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.spillwaysTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.outSlopesTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.louversTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.inSlopesTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.connectorsTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.fansTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.windowSillsTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.handlesTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.othersTableBD, {'orderId': orderNum});
  };

  console.log('$scope.global.isOpenedHistoryPage!!!!!!!!!!!', $scope.global.isOpenedHistoryPage);

}]);