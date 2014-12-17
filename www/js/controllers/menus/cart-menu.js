
// controllers/menus/cart-menu.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartMenuCtrl', ['$scope',  'constructService', 'localStorage', 'localDB', function ($scope, constructService, localStorage, localDB) {

  $scope.global = localStorage;

  $scope.cartMenuData = {
    floorData: [],
    assemblingData: [],
    instalmentsData: [],
    activeMenuItem: false,
    activeFloor: 'free',
    activeAssembling: 'free',
    activeInstalment: 'default',
    //------- Calendar
    maxDeliveryDate: new Date(),
    minDeliveryDate: new Date(),

    activeInstalmentSwitcher: false,
    deliveryDate: '',
    newDeliveryDate: '',
    datePriceLess: false,
    datePriceMore: false,
    ratePriceLess: 100,
    ratePriceMore: 100,
    DELAY_START: STEP,
    typing: 'on'
  };

  //------- Calendar

  var minDays = 2,
      maxDays = 30;

  //------ set min delivery day
  $scope.cartMenuData.minDeliveryDate.setDate( $scope.global.currentDate.getDate() + minDays);
  //------ set max delivery day
  $scope.cartMenuData.maxDeliveryDate.setDate( $scope.global.currentDate.getDate() + maxDays);
  //------ change date
  $scope.checkDifferentDate = function(lastday, newday) {
    var lastDateArr, newDateArr, lastDate, newDate, qtyDays;

    lastDateArr = lastday.split(".");
    newDateArr = newday.split(".");
    lastDate = new Date(lastDateArr[ 2 ], lastDateArr[ 1 ]-1, lastDateArr[0]);
    newDate = new Date(newDateArr[ 2 ], newDateArr[ 1 ]-1, newDateArr[0]);
    qtyDays = Math.floor((newDate - lastDate)/(1000*60*60*24));

    if(qtyDays && qtyDays > 0) {
      $scope.global.deliveryPrice = $scope.cartMenuData.ratePriceLess * qtyDays;
      $scope.cartMenuData.datePriceLess = true;
      $scope.cartMenuData.datePriceMore = false;
      $scope.cartMenuData.isOldPrice = true;
    } else if (qtyDays && qtyDays < 0) {
      $scope.global.deliveryPrice = $scope.cartMenuData.ratePriceMore * Math.abs(qtyDays);
      $scope.cartMenuData.datePriceMore = true;
      $scope.cartMenuData.datePriceLess = false;
      $scope.cartMenuData.isOldPrice = true;
    } else {
      $scope.global.deliveryPrice = false;
      $scope.cartMenuData.datePriceLess = false;
      $scope.cartMenuData.datePriceMore = false;
      $scope.cartMenuData.isOldPrice = false;
    }
    //$scope.global.newDeliveryDate = newday;
    $scope.global.order.deliveryDate = newday;
    $scope.global.calculateTotalOrderPrice();
  };


  constructService.getFloorPrice(function (results) {
    if (results.status) {
      $scope.cartMenuData.floorData = angular.copy(results.data.floors);
      $scope.global.selectedFloor = 'free';
      $scope.global.selectedFloorPrice = 0;
    } else {
      console.log(results);
    }
  });

  constructService.getAssemblingPrice(function (results) {
    if (results.status) {
      $scope.cartMenuData.assemblingData = angular.copy(results.data.assembling);
      $scope.global.selectedAssembling = 'free';
      $scope.global.selectedAssemblingPrice = 0;
    } else {
      console.log(results);
    }
  });

  constructService.getInstalment(function (results) {
    if (results.status) {
      $scope.cartMenuData.instalmentsData = results.data.instalment;
    } else {
      console.log(results);
    }
  });




  //----- Select menu item

  $scope.selectMenuItem = function(id) {
    if($scope.cartMenuData.activeMenuItem === id) {
      $scope.cartMenuData.activeMenuItem = false;
    } else {
      $scope.cartMenuData.activeMenuItem = id;
    }
  };

  //------- Select dropdown menu item

  $scope.selectFloorPrice = function(floorId) {
    if($scope.cartMenuData.activeFloor !== floorId) {
      $scope.cartMenuData.activeFloor = floorId;
      if(floorId === 'free') {
        $scope.global.selectedFloor = 'free';
        $scope.global.selectedFloorPrice = 0;
      } else {
        $scope.global.selectedFloor = $scope.cartMenuData.floorData[floorId].name;
        $scope.global.selectedFloorPrice = $scope.cartMenuData.floorData[floorId].price;
      }
      $scope.global.calculateTotalOrderPrice();
    }
  };

  $scope.selectAssembling = function(assemblingId) {
    if($scope.cartMenuData.activeAssembling !== assemblingId) {
      $scope.cartMenuData.activeAssembling = assemblingId;
      if(assemblingId === 'free') {
        $scope.global.selectedAssembling = 'free';
        $scope.global.selectedAssemblingPrice = 0;
      } else {
        $scope.global.selectedAssembling = $scope.cartMenuData.assemblingData[assemblingId].name;
        $scope.global.selectedAssemblingPrice = $scope.cartMenuData.assemblingData[assemblingId].price;
      }
      $scope.global.calculateTotalOrderPrice();
    }
  };

  $scope.selectInstalment = function(instalmentId) {
    if($scope.cartMenuData.activeInstalment !== instalmentId) {
      $scope.cartMenuData.activeInstalment = instalmentId;
      $scope.global.selectedInstalmentPeriod = $scope.cartMenuData.instalmentsData[instalmentId].period;
      $scope.global.selectedInstalmentPercent = $scope.cartMenuData.instalmentsData[instalmentId].percent;
      $scope.cartMenuData.activeInstalmentSwitcher = true;
      $scope.calculateInstalmentPrice($scope.global.orderTotalPrice, $scope.global.orderTotalPricePrimary);
    }
  };

  $scope.turnOffInstalment = function() {
    $scope.cartMenuData.activeInstalmentSwitcher = false;
    $scope.cartMenuData.activeInstalment = 'default';
    $scope.cartMenuData.activeMenuItem = false;
  };



  //------ show Call Master Dialog
  $scope.showCallMasterDialog = function() {
    $scope.global.showMasterDialog = true;
  };

  //------ show Order/Credit Dialog
  $scope.showCallOrderDialog = function() {
    if($scope.cartMenuData.activeInstalmentSwitcher) {
      $scope.global.showCreditDialog = true;
    } else {
      $scope.global.showOrderDialog = true;
    }
  };



  //-------- Calculate Total Order Price
  $scope.global.calculateTotalOrderPrice = function() {

    var floorPrice = parseFloat($scope.global.selectedFloorPrice),
        assemblingPrice = parseFloat($scope.global.selectedAssemblingPrice);
    $scope.global.orderTotalPrice = 0;
    //----- add product prices
    $scope.global.orderTotalPrice += $scope.global.orderPrice;
    //----- add floor price
    if( $.isNumeric(floorPrice) ) {
      $scope.global.orderTotalPrice += floorPrice;
    }
    //----- add assembling price
    if( $.isNumeric(assemblingPrice) ) {
      $scope.global.orderTotalPrice += assemblingPrice;
    }
    //----- save primary total price
    $scope.global.orderTotalPricePrimary = $scope.global.orderTotalPrice;
    //----- add delivery price
    if($scope.global.deliveryPrice) {
      if($scope.cartMenuData.datePriceMore) {
        $scope.global.orderTotalPrice += $scope.global.deliveryPrice;
      } else if($scope.cartMenuData.datePriceLess) {
        $scope.global.orderTotalPrice -= $scope.global.deliveryPrice;
      }
    } else {
      $scope.global.orderTotalPrice = $scope.global.orderTotalPricePrimary;
    }

    $scope.global.orderTotalPrice = parseFloat($scope.global.orderTotalPrice.toFixed(2));
    //------ get price with instalment
    $scope.calculateInstalmentPrice($scope.global.orderTotalPrice, $scope.global.orderTotalPricePrimary);
  };

  $scope.calculateInstalmentPrice = function(price, pricePrimary) {
    if($scope.cartMenuData.activeInstalmentSwitcher) {
      $scope.global.paymentFirst = parseFloat((price * $scope.global.selectedInstalmentPercent / 100).toFixed(2));
      $scope.global.paymentMonthly = parseFloat(((price - $scope.global.paymentFirst) / $scope.global.selectedInstalmentPeriod).toFixed(2));
      if(pricePrimary) {
        $scope.global.paymentFirstPrimary = parseFloat((pricePrimary * $scope.global.selectedInstalmentPercent / 100).toFixed(2));
        $scope.global.paymentMonthlyPrimary = parseFloat(((pricePrimary - $scope.global.paymentFirstPrimary) / $scope.global.selectedInstalmentPeriod).toFixed(2));
      }
    }
  };





}]);
