/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartMenuCtrl', ['$scope',  'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.cartMenuData = {
    floorData: [],
    assemblingData: [],
    instalmentsData: [],
    activeMenuItem: false,
    activeFloor: 0,
    activeAssembling: 0,
    activeInstalment: 'default',


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

  var floorSource, fl, assemblingSource, ass;



  //------- Calendar

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
      floorSource = results.data.floors;
      for(fl = 0; fl < floorSource.length; fl++) {
        var tempFloor = {};
        tempFloor.name = floorSource[fl].name;
        if($.isNumeric(parseFloat(floorSource[fl].price))) {
          tempFloor.price = '+' + floorSource[fl].price + ' ' + $scope.global.currency;
        } else {
          tempFloor.price = ' ';
        }
        $scope.cartMenuData.floorData.push(tempFloor);
      }
      $scope.cartMenuData.selectedFloor = $scope.cartMenuData.floorData[0].name;
      $scope.cartMenuData.selectedFloorPrice = $scope.cartMenuData.floorData[0].price;
    } else {
      console.log(results);
    }
  });

  constructService.getAssemblingPrice(function (results) {
    if (results.status) {
      assemblingSource = results.data.assembling;
      for(ass = 0; ass < assemblingSource.length; ass++) {
        var tempAssembling = {};
        tempAssembling.name = assemblingSource[ass].name;
        if($.isNumeric(parseFloat(assemblingSource[ass].price))) {
          tempAssembling.price = '+' + assemblingSource[ass].price + ' ' + $scope.global.currency;
        } else {
          tempAssembling.price = assemblingSource[ass].price;
        }
        $scope.cartMenuData.assemblingData.push(tempAssembling);
      }
      $scope.cartMenuData.selectedAssembling = $scope.cartMenuData.assemblingData[0].name;
      $scope.cartMenuData.selectedAssemblingPrice = $scope.cartMenuData.assemblingData[0].price;
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
      $scope.cartMenuData.selectedFloor = $scope.cartMenuData.floorData[floorId].name;
      $scope.cartMenuData.selectedFloorPrice = $scope.cartMenuData.floorData[floorId].price;
      calculateTotalOrderPrice();
    }
  };

  $scope.selectAssembling = function(assemblingId) {
    if($scope.cartMenuData.activeAssembling !== assemblingId) {
      $scope.cartMenuData.activeAssembling = assemblingId;
      $scope.cartMenuData.selectedAssembling = $scope.cartMenuData.assemblingData[assemblingId].name;
      $scope.cartMenuData.selectedAssemblingPrice = $scope.cartMenuData.assemblingData[assemblingId].price;
      calculateTotalOrderPrice();
    }
  };

  $scope.selectInstalment = function(instalmentId) {
    if($scope.cartMenuData.activeInstalment !== instalmentId) {
      $scope.cartMenuData.activeInstalment = instalmentId;
      $scope.cartMenuData.selectedInstalmentPeriod = $scope.cartMenuData.instalmentsData[instalmentId].period;
      $scope.cartMenuData.selectedInstalmentPercent = $scope.cartMenuData.instalmentsData[instalmentId].percent;
      $scope.cartMenuData.activeInstalmentSwitcher = true;
    }
  };

  $scope.turnOffInstalment = function() {
    $scope.cartMenuData.activeInstalmentSwitcher = false;
    $scope.cartMenuData.activeInstalment = 'default';
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

  // Calculate Total Order Price
  function calculateTotalOrderPrice() {
    $scope.global.orderTotalPrice = 0;
    $scope.global.orderTotalPrice += $scope.global.orderPrice;

    var floorPrice = parseFloat(floorSource[$scope.cartMenuData.activeFloor].price),
        assemblingPrice = parseFloat(assemblingSource[$scope.cartMenuData.activeAssembling].price);

    if( $.isNumeric(floorPrice) ) {
      $scope.global.orderTotalPrice += floorPrice;
    }
    if( $.isNumeric(assemblingPrice) ) {
      $scope.global.orderTotalPrice += assemblingPrice;
    }
  }

}]);