
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
      $scope.global.order.deliveryPrice = $scope.cartMenuData.ratePriceLess * qtyDays;
      $scope.cartMenuData.datePriceLess = true;
      $scope.cartMenuData.datePriceMore = false;
      $scope.cartMenuData.isOldPrice = true;
    } else if (qtyDays && qtyDays < 0) {
      $scope.global.order.deliveryPrice = $scope.cartMenuData.ratePriceMore * Math.abs(qtyDays);
      $scope.cartMenuData.datePriceMore = true;
      $scope.cartMenuData.datePriceLess = false;
      $scope.cartMenuData.isOldPrice = true;
    } else {
      $scope.global.order.deliveryPrice = false;
      $scope.cartMenuData.datePriceLess = false;
      $scope.cartMenuData.datePriceMore = false;
      $scope.cartMenuData.isOldPrice = false;
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

  $scope.selectFloorPrice = function(floorId) {
    if($scope.cartMenuData.activeFloor !== floorId) {
      $scope.cartMenuData.activeFloor = floorId;
      if(floorId === 'free') {
        $scope.global.order.selectedFloor = 'free';
        $scope.global.order.selectedFloorPrice = 0;
      } else {
        $scope.global.order.selectedFloor = $scope.cartMenuData.floorData[floorId].name;
        $scope.global.order.selectedFloorPrice = $scope.cartMenuData.floorData[floorId].price;
      }
      $scope.global.calculateTotalOrderPrice();
    }
  };

  $scope.selectAssembling = function(assemblingId) {
    if($scope.cartMenuData.activeAssembling !== assemblingId) {
      $scope.cartMenuData.activeAssembling = assemblingId;
      if(assemblingId === 'free') {
        $scope.global.order.selectedAssembling = 'free';
        $scope.global.order.selectedAssemblingPrice = 0;
      } else {
        $scope.global.order.selectedAssembling = $scope.cartMenuData.assemblingData[assemblingId].name;
        $scope.global.order.selectedAssemblingPrice = $scope.cartMenuData.assemblingData[assemblingId].price;
      }
      $scope.global.calculateTotalOrderPrice();
    }
  };

  $scope.selectInstalment = function(instalmentId) {
    if($scope.cartMenuData.activeInstalment !== instalmentId) {
      $scope.cartMenuData.activeInstalment = instalmentId;
      $scope.global.order.selectedInstalmentPeriod = $scope.cartMenuData.instalmentsData[instalmentId].period;
      $scope.global.order.selectedInstalmentPercent = $scope.cartMenuData.instalmentsData[instalmentId].percent;
      $scope.cartMenuData.activeInstalmentSwitcher = true;
      $scope.calculateInstalmentPrice($scope.global.order.orderPriceTOTAL, $scope.global.order.orderPriceTOTALPrimary);
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
      if($scope.cartMenuData.datePriceMore) {
        $scope.global.order.orderPriceTOTAL += $scope.global.order.deliveryPrice;
      } else if($scope.cartMenuData.datePriceLess) {
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
    if($scope.cartMenuData.activeInstalmentSwitcher) {
      $scope.global.order.paymentFirst = parseFloat((price * $scope.global.order.selectedInstalmentPercent / 100).toFixed(2));
      $scope.global.order.paymentMonthly = parseFloat(((price - $scope.global.order.paymentFirst) / $scope.global.order.selectedInstalmentPeriod).toFixed(2));
      if(pricePrimary) {
        $scope.global.order.paymentFirstPrimary = parseFloat((pricePrimary * $scope.global.order.selectedInstalmentPercent / 100).toFixed(2));
        $scope.global.order.paymentMonthlyPrimary = parseFloat(((pricePrimary - $scope.global.order.paymentFirstPrimary) / $scope.global.order.selectedInstalmentPeriod).toFixed(2));
      }
    }
  };


}]);
