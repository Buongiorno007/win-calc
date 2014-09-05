/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, removeClassWithDelay, addClassWithDelay */

'use strict';

BauVoiceApp.controller('CartMenuCtrl', ['$scope',  'constructService', 'globalData', function ($scope, constructService, globalData) {
  var $cartMenu = $('.cart-menu'),
      $itemMenu = $cartMenu.find('.item'),
      $dropdownMenu = $cartMenu.find('.dropdown-cart-menu'),
      $dropDeliveryMenu = $cartMenu.find('.drop-delivery'),
      $dropAssemblingMenu = $cartMenu.find('.drop-assembling'),
      $dropInstalmentMenu = $cartMenu.find('.drop-instalment'),
      $dropDeliveryItem = $dropDeliveryMenu.find('.dropdown-item'),
      $dropAssemblingItem = $dropAssemblingMenu.find('.dropdown-item'),
      $dropInstalmentItem = $dropInstalmentMenu.find('.dropdown-item'),
      $checkSwitcher = $cartMenu.find('.check-switcher'),
      $priceBlock = $cartMenu.find('.price-block'),
      $oldPriceTab = $('.old-price-tab'),
      $calendar = $cartMenu.find('.calendar-box'),
      $measureBTN  = $cartMenu.find('.measure-btn');

  // Calendar
  $calendar.pickmeup({
    flat	: true
  });

  $scope.global = globalData;


  $scope.cartMenuData = {
    activeMenuItem: false,
    selectedFloor: 'самовывоз',
    selectedFloorPrice: '',
    selectedAssembling: 'стандартный',
    selectedAssemblingPrice: '+300',
    selectedInstalmentPeriodDefault: 'без рассрочки',
    selectedInstalmentPercentDefault: '',
    selectedInstalmentPeriod: 'без рассрочки',
    selectedInstalmentPercent: '',
    activeInstalmentSwitcher: false
  };

  constructService.getFloorPrice(function (results) {
    if (results.status) {
      $scope.floorPrice = results.data.floors;
    } else {
      console.log(results);
    }
  });

  constructService.getAssemblingPrice(function (results) {
    if (results.status) {
      $scope.assemblingPrice = results.data.assembling;
    } else {
      console.log(results);
    }
  });

  constructService.getInstalment(function (results) {
    if (results.status) {
      $scope.instalmentPercent = results.data.instalment;
    } else {
      console.log(results);
    }
  });


  //Select menu item

  $scope.selectMenuItem = function(id) {
    if($scope.cartMenuData.activeMenuItem === id) {
      $scope.cartMenuData.activeMenuItem = false;
    } else {
      $scope.cartMenuData.activeMenuItem = id;
    }
  };


  // Select dropdown menu item

  $scope.selectFloorPrice = function(floor, price) {
    $scope.cartMenuData.selectedFloor = floor;
    $scope.cartMenuData.selectedFloorPrice = price;
  };

  $scope.selectAssembling = function(name, price) {
    $scope.cartMenuData.selectedAssembling = name;
    $scope.cartMenuData.selectedAssemblingPrice = price;
  };

  $scope.selectInstalment = function(period, percent) {
    $scope.cartMenuData.selectedInstalmentPeriod = period;
    $scope.cartMenuData.selectedInstalmentPercent = percent;
    $scope.cartMenuData.activeInstalmentSwitcher = true;
  };

  $scope.turnOffInstalment = function() {
    $scope.cartMenuData.activeInstalmentSwitcher = false;
    $scope.cartMenuData.selectedInstalmentPeriod = $scope.cartMenuData.selectedInstalmentPeriodDefault;
    $scope.cartMenuData.selectedInstalmentPercent = $scope.cartMenuData.selectedInstalmentPercentDefault;
    $scope.cartMenuData.activeMenuItem = false;
  };



  // show Call Master Dialog
  $scope.showCallMasterDialog = function() {
    $scope.global.showMasterDialog = true;
  };

  // show Order/Credit Dialog
  $scope.showCallOrderDialog = function() {
    if($scope.cartMenuData.activeInstalmentSwitcher) {
      $scope.global.showCreditDialog = true;
    } else {
      $scope.global.showOrderDialog = true;
    }
  };
}]);