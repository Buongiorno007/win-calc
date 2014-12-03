/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('LocationCtrl', ['$scope', 'localDB', 'localStorage', function ($scope, localDB, localStorage) {

  $scope.global = localStorage;
  var generalLocations = [];
  $scope.locations = [];

  //----- default user location
  $scope.userDefaultLocation = '' + $scope.global.userInfo.cityName + ', ' + $scope.global.userInfo.regionName + ', ' + $scope.global.userInfo.countryName;

  //--------- get all cities
  localDB.selectAllDBGlobal($scope.global.regionsTableDBGlobal, function (results) {
    if (results.status) {
      $scope.regions = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });
  localDB.selectAllDBGlobal($scope.global.countriesTableDBGlobal, function (results) {
    if (results.status) {
      $scope.countries = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });
  localDB.selectAllDBGlobal($scope.global.citiesTableDBGlobal, function (results) {
    if (results.status) {
      $scope.cities = angular.copy(results.data);

      for(var c = 0; c < $scope.cities.length; c++) {
        var location = {};
        location.cityId = $scope.cities[c].id;
        location.cityName = $scope.cities[c].name;
        for(var r = 0; r <  $scope.regions.length; r++) {
          if($scope.cities[c].region_id === $scope.regions[r].id) {
            location.regionName = $scope.regions[r].name;
            location.climaticZone = $scope.regions[r].climatic_zone;
            location.heatTransfer = $scope.regions[r].heat_transfer;
            for(var s = 0; s < $scope.countries.length; s++) {
              if($scope.regions[r].country_id === $scope.countries[s].id) {
                location.countryName = $scope.countries[s].name;
                generalLocations.push(location);
              }
            }
          }
        }
      }

      //-------- build locations object for searching
      for(var i = 0; i < generalLocations.length; i++) {
        var tempObj = {
          cityId: generalLocations[i].cityId,
          climaticZone: generalLocations[i].climaticZone,
          heatTransfer: generalLocations[i].heatTransfer,
          fullLocation: '' + generalLocations[i].cityName + ', ' + generalLocations[i].regionName + ', ' + generalLocations[i].countryName,
        };
        $scope.locations.push(tempObj);
      }
      console.log($scope.locations);
    } else {
      console.log(results);
    }
  });

  //-------- Select City
  $scope.selectCity = function(locationId) {
    console.log(locationId);
    for(var j = 0; j < $scope.locations.length; j++) {
      if($scope.locations[j].cityId === locationId) {
        $scope.userDefaultLocation = $scope.locations[j].fullLocation;
      }
    }
  };

}]);