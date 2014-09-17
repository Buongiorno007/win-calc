/* globals STEP, activeClass, typingTextByChar, showElementWithDelay, addClassWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('NavMenuCtrl', ['$scope', '$location', 'localStorage', 'globalData', function ($scope, $location, localStorage, globalData) {

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

  localStorage.getOrdersCart(function (results) {
    if (results.status) {
      $scope.global.ordersInCart = results.data.ordersInCart;
    } else {
      console.log(results);
    }
  });

  $scope.gotoLocationPage = function () {
    $location.path('/location');
  };

  $scope.gotoSettingsPage = function () {
    $location.path('/settings');
  };

  $scope.gotoHistoryPage = function () {
    $location.path('/history');
  };
  $scope.gotoCartPage = function () {
    $location.path('/cart');
  };

  $scope.getCurrentGeolocation = function () {

  };

  $scope.setCurrentCity = function (city) {

  };

  $scope.gotoAddElementsPanel = function() {
    $scope.global.showNavMenu = false;
    $scope.global.showConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showAddElements = true;
  };

  $scope.showNewProject = function() {
    $scope.navMenu.activeMenuItem = false;
    $scope.global.showNavMenu = false;
    $scope.global.showConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showTemplatePanel = true;
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