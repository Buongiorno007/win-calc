/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartMenuCtrl', ['$scope',  'constructService', 'localStorage', 'localDB', function ($scope, constructService, localStorage, localDB) {

  $scope.global = localStorage;

  $scope.cartMenuData = {
    floorData: [],
    assemblingData: [],
    instalmentsData: [],
    activeMenuItem: false,
    activeFloor: 0,
    activeAssembling: 0,
    activeInstalment: 'default',
    //------- Calendar
    currentDate: new Date(),
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

  var floorSource, fl, assemblingSource, ass;



  //------- Calendar

  var valuesDate,
      idDate,
      today,
      daysBeforeDelivery = 15,
      minDays = 2,
      maxDays = 30;

  //------ set min delivery day
  $scope.cartMenuData.minDeliveryDate.setDate( $scope.cartMenuData.currentDate.getDate() + minDays);
  //------ set max delivery day
  $scope.cartMenuData.maxDeliveryDate.setDate( $scope.cartMenuData.currentDate.getDate() + maxDays);
  //------ set delivery day
  $scope.cartMenuData.currentDate.setDate( $scope.cartMenuData.currentDate.getDate() + daysBeforeDelivery);

  valuesDate = [ $scope.cartMenuData.currentDate.getDate(), $scope.cartMenuData.currentDate.getMonth() + 1 ];
  for(idDate in valuesDate) {
    valuesDate[ idDate ] = valuesDate[ idDate ].toString().replace( /^([0-9])$/, '0$1' );
  }
  today = valuesDate[ 0 ] + '.' + valuesDate[ 1 ] + '.' + $scope.cartMenuData.currentDate.getFullYear();
  $scope.global.deliveryDate = today;
  $scope.global.newDeliveryDate = $scope.global.deliveryDate;

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
    $scope.global.newDeliveryDate = newday;
    $scope.global.calculateTotalOrderPrice();
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
      $scope.global.selectedFloor = $scope.cartMenuData.floorData[0].name;
      $scope.global.selectedFloorPrice = $scope.cartMenuData.floorData[0].price;
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
      $scope.global.selectedAssembling = $scope.cartMenuData.assemblingData[0].name;
      $scope.global.selectedAssemblingPrice = $scope.cartMenuData.assemblingData[0].price;
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
      $scope.global.selectedFloor = $scope.cartMenuData.floorData[floorId].name;
      $scope.global.selectedFloorPrice = $scope.cartMenuData.floorData[floorId].price;
      $scope.global.calculateTotalOrderPrice();
    }
  };

  $scope.selectAssembling = function(assemblingId) {
    if($scope.cartMenuData.activeAssembling !== assemblingId) {
      $scope.cartMenuData.activeAssembling = assemblingId;
      $scope.global.selectedAssembling = $scope.cartMenuData.assemblingData[assemblingId].name;
      $scope.global.selectedAssemblingPrice = $scope.cartMenuData.assemblingData[assemblingId].price;
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

    var floorPrice = parseFloat(floorSource[$scope.cartMenuData.activeFloor].price),
        assemblingPrice = parseFloat(assemblingSource[$scope.cartMenuData.activeAssembling].price);
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

  //-------- save Order into Local DB
  $scope.global.insertOrderInLocalDB = function(newOptions, orderType) {

    $scope.orderData = {
      "orderId": $scope.global.orderNumber,
      "orderType": orderType,
      "productsQty": $scope.global.productCounter,
      "floor": $scope.global.selectedFloor,
      "floorPrice": $scope.global.selectedFloorPrice,
      "assembling": $scope.global.selectedAssembling,
      "assemblingPrice": $scope.global.selectedAssemblingPrice,
      "deliveryDatePrimary": $scope.global.deliveryDate,
      "deliveryDate": $scope.global.newDeliveryDate ,
      "instalmentPeriod": $scope.global.selectedInstalmentPeriod,
      "instalmentPercent": $scope.global.selectedInstalmentPercent,
      "totalPrice": $scope.global.orderTotalPrice,
      "totalPricePrimary": $scope.global.orderTotalPricePrimary,
      "totalPriceFirst":  $scope.global.paymentFirst,
      "totalPriceMonthly": $scope.global.paymentMonthly,
      "totalPriceFirstPrimary": $scope.global.paymentFirstPrimary,
      "totalPriceMonthlyPrimary": $scope.global.paymentMonthlyPrimary,
      "name": '',
      "location": '',
      "address": '',
      "mail": '',
      "phone": '',
      "phone2": '',
      "itn": 0,
      "instalment": '',
      "starttime": '',
      "endtime": '',
      "target": ''
    };

    //------- merge objects for save in local db
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

    console.log($scope.orderData);
    localDB.insertDB($scope.global.ordersTableBD, $scope.orderData);

    //--------- Close cart dialog, go to main page and create new project
    $scope.global.createNewProject();
  };



}]);