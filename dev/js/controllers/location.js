/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('LocationCtrl', ['$scope', 'globalDB', 'constructService', 'localStorage', function ($scope, globalDB, constructService, localStorage) {

  $scope.global = localStorage;
  $scope.location = {};

  globalDB.getUser(function (results) {
    if (results.status) {
      $scope.location.currCity = results.data.user.city;
    } else {
      console.log(results);
    }
  });

  constructService.getLocations(function (results) {
    if (results.status) {
      $scope.location.cities = results.data.locations;
    } else {
      console.log(results);
    }
  });

  // Search Location
  $scope.filteredCity = [];
  var regex, checkCity, indexCity, cityObj;

  // Create regExpresion
  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  $scope.checkChanges = function() {
    $scope.filteredCity.length = 0;
    if($scope.location.currCity && $scope.location.currCity.length > 0) {
      regex = new RegExp('^' + escapeRegExp($scope.location.currCity), 'i');
      for(indexCity = 0; indexCity < $scope.location.cities.length; indexCity++){
        checkCity = regex.test($scope.location.cities[indexCity].city);
        if(checkCity) {
          cityObj = {};
          cityObj.city = $scope.location.cities[indexCity].city;
          cityObj.current = $scope.location.cities[indexCity].current;
          $scope.filteredCity.push(cityObj);
        }
      }
    }
  };

  // Select City
  $scope.selectCity = function() {
    $scope.global.gotoMainPage();
  };

}]);