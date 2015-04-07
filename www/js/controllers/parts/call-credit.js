
// controllers/parts/call-credit.js

'use strict';

BauVoiceApp.controller('CallCreditCtrl', ['$scope', 'constructService', 'localStorage', '$location', 'localDB', function ($scope, constructService, localStorage, $location, localDB) {

  $scope.global = localStorage;
  $scope.orderStyle = 'credit';
  $scope.user = $scope.global.createUserXOrder();
  //$scope.user.instalment = 54513123;

  // Search Location
  $scope.showTipCity = false;
  $scope.currentCity = false;
  $scope.filteredCity = [];
  var regex, checkCity, indexCity, cityObj;

  constructService.getLocations(function (results) {
    if (results.status) {
      $scope.cities = results.data.locations;
    } else {
      console.log(results);
    }
  });

  // Create regExpresion
  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  $scope.checkChanges = function() {
    $scope.filteredCity.length = 0;
    $scope.currentCity = false;
    if($scope.user.location && $scope.user.location.length > 0) {
      regex = new RegExp('^' + escapeRegExp($scope.user.location), 'i');
      for(indexCity = 0; indexCity < $scope.cities.length; indexCity++){
        checkCity = regex.test($scope.cities[indexCity].city);
        if(checkCity) {
          cityObj = {};
          cityObj.city = $scope.cities[indexCity].city;
          cityObj.current = $scope.cities[indexCity].current;
          $scope.filteredCity.push(cityObj);
        }
      }
    }
    if($scope.filteredCity.length > 0) {
      $scope.showTipCity = true;
    } else {
      $scope.showTipCity = false;
    }
  };

  // Select City
  $scope.selectCity = function(city, curr) {
    $scope.user.location = city;
    $scope.showTipCity = false;
    if(curr) {
      $scope.currentCity = true;
    }
  };


  // Close Credit Dialog
  $scope.hideCallCreditDialog = function() {
    $scope.submitted = false;
    $scope.user = $scope.global.createUserXOrder();
    $scope.showTipCity = false;
    $scope.currentCity = false;
    $scope.global.showCreditDialog = false;
  };

  // Send Form Data
  $scope.submitForm = function (form) {
    // Trigger validation flag.
    $scope.submitted = true;

    if (form.$valid) {
      if($scope.global.orderEditNumber > 0) {

        //----- delete old order in localDB
        localDB.deleteDB($scope.global.ordersTableBD, {'orderId': $scope.global.orderEditNumber});
        //$scope.global.deleteOrderFromLocalDB($scope.global.orderEditNumber);
        /*
        for(var prod = 0; prod < $scope.global.order.products.length; prod++) {
          $scope.global.insertProductInLocalDB($scope.global.orderEditNumber, $scope.global.order.products[prod].productId, $scope.global.order.products[prod]);
        }
        */
      }
      $scope.global.insertOrderInLocalDB($scope.user, $scope.global.fullOrderType, $scope.orderStyle);
      //--------- Close cart dialog, go to history
      $scope.hideCallCreditDialog();
      $scope.global.orderEditNumber = false;
      $scope.global.isCreatedNewProject = false;
      $scope.global.isCreatedNewProduct = false;
      $scope.global.isOrderFinished = true;
      $location.path('/history');
    }
  };

}]);
