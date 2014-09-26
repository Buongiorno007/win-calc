/* globals STEP, activeClass, typingTextByChar, showElementWithDelay, addClassWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('NavMenuCtrl', ['$scope', '$location', 'localStorage', 'globalData', '$cookieStore', function ($scope, $location, localStorage, globalData, $cookieStore) {

  $scope.global = globalData;

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

  if($cookieStore.get('totalProjectsQty')) {
    $scope.global.ordersInCart = $cookieStore.get('totalProjectsQty');
  } else {
    localStorage.getOrdersCart(function (results) {
      if (results.status) {
        $scope.global.ordersInCart = results.data.ordersInCart;
      } else {
        console.log(results);
      }
    });
  }

  $scope.gotoMainPage = function () {
    $location.path('/main');
  };

  $scope.gotoLocationPage = function () {
    $location.path('/location');
  };

  $scope.gotoSettingsPage = function () {
    $location.path('/settings');
  };

  $scope.gotoHistoryPage = function () {
    $location.path('/history');
  };
  $scope.global.gotoCartPage = function () {
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

  $scope.createNewProject = function() {
    $scope.navMenu.activeMenuItem = false;
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showTemplatePanel = true;
    $scope.global.isTemplatePanel = true;
  };

  //Select menu item
  $scope.selectMenuItem = function(id) {
    if($scope.navMenu.activeMenuItem === id) {
      $scope.navMenu.activeMenuItem = false;
    } else {
      $scope.navMenu.activeMenuItem = id;
    }
  };

}]);