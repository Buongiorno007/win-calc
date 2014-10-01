/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, removeClassWithDelay, addClassWithDelay */

'use strict';

BauVoiceApp.controller('CartMenuCtrl', ['$scope',  'constructService', 'globalData', function ($scope, constructService, globalData) {

  $scope.global = globalData;

  $scope.price = $scope.global.cartPrice;
  $scope.currency = $scope.global.currency;

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
    activeInstalmentSwitcher: false,
    deliveryDate: '',
    newDeliveryDate: '',
    datePriceLess: false,
    datePriceMore: false,
    ratePriceLess: 100,
    ratePriceMore: 100,
    deliveryPriceLess: '',
    deliveryPriceMore: '',
    DELAY_START: STEP,
    typing: 'on'
  };

  // Calendar

  var currentDate = new Date(),
      valuesDate,
      idDate,
      today;

  valuesDate = [ currentDate.getDate(), currentDate.getMonth() + 1 ];
  for(idDate in valuesDate) {
    valuesDate[ idDate ] = valuesDate[ idDate ].toString().replace( /^([0-9])$/, '0$1' );
  }
  today = valuesDate[ 0 ]+'.'+valuesDate[ 1 ]+'.'+currentDate.getFullYear();

  $scope.cartMenuData.deliveryDate = today;
  $scope.cartMenuData.newDeliveryDate = $scope.cartMenuData.deliveryDate;

  $scope.checkDifferentDate = function(lastday, newday) {
    var lastDateArr, newDateArr, lastDate, newDate, qtyDays;

    lastDateArr = lastday.split(".");
    newDateArr = newday.split(".");
    lastDate = new Date(lastDateArr[ 2 ], lastDateArr[ 1 ]-1, lastDateArr[0]);
    newDate = new Date(newDateArr[ 2 ], newDateArr[ 1 ]-1, newDateArr[0]);
    qtyDays = Math.floor((newDate - lastDate)/(1000*60*60*24));
    //console.log(' different ' + qtyDays);
    if(qtyDays > 0 && qtyDays < 10) {
      $scope.cartMenuData.deliveryPriceLess = $scope.cartMenuData.ratePriceLess * qtyDays;
      $scope.cartMenuData.datePriceLess = true;
      $scope.cartMenuData.datePriceMore = false;
      $scope.cartMenuData.isOldPrice = true;
    } else if (qtyDays > 10 && qtyDays < 30) {
      $scope.cartMenuData.deliveryPriceMore = $scope.cartMenuData.ratePriceMore * qtyDays;
      $scope.cartMenuData.datePriceMore = true;
      $scope.cartMenuData.datePriceLess = false;
      $scope.cartMenuData.isOldPrice = true;
    } else {
      $scope.cartMenuData.datePriceLess = false;
      $scope.cartMenuData.datePriceMore = false;
      $scope.cartMenuData.isOldPrice = false;
    }
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