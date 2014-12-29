
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
    //activeInstalment: 'default',
    //------- Calendar
    maxDeliveryDate: new Date(),
    minDeliveryDate: new Date(),
    activeInstalmentSwitcher: false,
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
      $scope.global.order.deliveryPrice = $scope.cartMenuData.ratePriceLess * qtyDays;
      $scope.global.order.isDatePriceLess = true;
      $scope.global.order.isDatePriceMore = false;
      $scope.global.order.isOldPrice = true;
    } else if (qtyDays && qtyDays < 0) {
      $scope.global.order.deliveryPrice = $scope.cartMenuData.ratePriceMore * Math.abs(qtyDays);
      $scope.global.order.isDatePriceMore = true;
      $scope.global.order.isDatePriceLess = false;
      $scope.global.order.isOldPrice = true;
    } else {
      $scope.global.order.deliveryPrice = false;
      $scope.global.order.isDatePriceLess = false;
      $scope.global.order.isDatePriceMore = false;
      $scope.global.order.isOldPrice = false;
    }
    $scope.global.order.newDeliveryDate = newday;
    $scope.global.calculateTotalOrderPrice();
  };


  constructService.getFloorPrice(function (results) {
    if (results.status) {
      $scope.cartMenuData.floorData = angular.copy(results.data.floors);
    } else {
      console.log(results);
    }
  });

  constructService.getAssemblingPrice(function (results) {
    if (results.status) {
      $scope.cartMenuData.assemblingData = angular.copy(results.data.assembling);
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

  $scope.selectFloorPrice = function(floorName, floorPrice) {
    if($scope.global.order.selectedFloor !== floorName) {
      $scope.global.order.selectedFloor = floorName;
      $scope.global.order.selectedFloorPrice = floorPrice;
      $scope.global.calculateTotalOrderPrice();
    }
  };

  $scope.selectAssembling = function(assembName, assembPrice) {
    if($scope.global.order.selectedAssembling !== assembName) {
      $scope.global.order.selectedAssembling = assembName;
      $scope.global.order.selectedAssemblingPrice = assembPrice;
      $scope.global.calculateTotalOrderPrice();
    }
  };

  $scope.selectInstalment = function(instalmentId) {
    if(instalmentId !== undefined && $scope.global.order.isInstalment !== instalmentId) {
      $scope.global.order.isInstalment = instalmentId;
      $scope.global.order.selectedInstalmentPeriod = $scope.cartMenuData.instalmentsData[instalmentId].period;
      $scope.global.order.selectedInstalmentPercent = $scope.cartMenuData.instalmentsData[instalmentId].percent;
      $scope.calculateInstalmentPrice($scope.global.order.orderPriceTOTAL, $scope.global.order.orderPriceTOTALPrimary);
    } else if(!instalmentId || instalmentId === undefined){
      $scope.global.order.isInstalment = 'false';
      $scope.global.order.selectedInstalmentPeriod = 0;
      $scope.global.order.selectedInstalmentPercent = 0;
      $scope.cartMenuData.activeMenuItem = false;
    }
  };


  //------ show Call Master Dialog
  $scope.showCallMasterDialog = function() {
    $scope.global.showMasterDialog = true;
  };

  //------ show Order/Credit Dialog
  $scope.showCallOrderDialog = function() {
    if($scope.global.order.isInstalment !== 'false') {
      $scope.global.showCreditDialog = true;
    } else {
      $scope.global.showOrderDialog = true;
    }
  };



  //-------- Calculate Total Order Price
  $scope.global.calculateTotalOrderPrice = function() {

    var floorPrice = parseFloat($scope.global.order.selectedFloorPrice),
        assemblingPrice = parseFloat($scope.global.order.selectedAssemblingPrice);

    $scope.global.order.orderPriceTOTAL = 0;
    //----- add product prices
    $scope.global.order.orderPriceTOTAL += $scope.global.order.productsPriceTOTAL;

    //----- add floor price
    if( $.isNumeric(floorPrice) ) {
      $scope.global.order.orderPriceTOTAL += floorPrice;
    }
    //----- add assembling price
    if( $.isNumeric(assemblingPrice) ) {
      $scope.global.order.orderPriceTOTAL += assemblingPrice;
    }
    //----- save primary total price
    $scope.global.order.orderPriceTOTALPrimary = $scope.global.order.orderPriceTOTAL;
    //----- add delivery price
    if($scope.global.order.deliveryPrice) {
      if($scope.global.order.isDatePriceMore) {
        $scope.global.order.orderPriceTOTAL += $scope.global.order.deliveryPrice;
      } else if($scope.global.order.isDatePriceLess) {
        $scope.global.order.orderPriceTOTAL -= $scope.global.order.deliveryPrice;
      }
    } else {
      $scope.global.order.orderPriceTOTAL = $scope.global.order.orderPriceTOTALPrimary;
    }

    $scope.global.order.orderPriceTOTAL = parseFloat($scope.global.order.orderPriceTOTAL.toFixed(2));
    //------ get price with instalment
    $scope.calculateInstalmentPrice($scope.global.order.orderPriceTOTAL, $scope.global.order.orderPriceTOTALPrimary);
  };

  $scope.calculateInstalmentPrice = function(price, pricePrimary) {
    if($scope.global.order.isInstalment !== 'false') {
      $scope.global.order.paymentFirst = parseFloat((price * $scope.global.order.selectedInstalmentPercent / 100).toFixed(2));
      $scope.global.order.paymentMonthly = parseFloat(((price - $scope.global.order.paymentFirst) / $scope.global.order.selectedInstalmentPeriod).toFixed(2));
      if(pricePrimary) {
        $scope.global.order.paymentFirstPrimary = parseFloat((pricePrimary * $scope.global.order.selectedInstalmentPercent / 100).toFixed(2));
        $scope.global.order.paymentMonthlyPrimary = parseFloat(((pricePrimary - $scope.global.order.paymentFirstPrimary) / $scope.global.order.selectedInstalmentPeriod).toFixed(2));
      }
    }
  };


}]);