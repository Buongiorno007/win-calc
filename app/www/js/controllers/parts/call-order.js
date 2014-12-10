
// controllers/parts/call-order.js

'use strict';

BauVoiceApp.controller('CallOrderCtrl', ['$scope', 'constructService', 'localStorage', '$location', function ($scope, constructService, localStorage, $location) {

  $scope.global = localStorage;
  $scope.orderStyle = 'order';
  $scope.user = {};

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


  // Close Call Master Dialog
  $scope.hideCallOrderDialog = function() {
    $scope.submitted = false;
    $scope.user = {};
    $scope.showTipCity = false;
    $scope.currentCity = false;
    $scope.global.showOrderDialog = false;
  };

  // Send Form Data
  $scope.submitForm = function (form) {
    // Trigger validation flag.
    $scope.submitted = true;

    if (form.$valid) {
      $scope.global.insertOrderInLocalDB($scope.user, $scope.global.fullOrderType, $scope.orderStyle);
      //--------- Close cart dialog, go to history
      $scope.hideCallOrderDialog();
      $location.path('/history');
    }
  };

}]);
