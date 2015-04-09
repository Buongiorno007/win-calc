
// controllers/location.js

/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('LocationCtrl', ['$scope', 'localDB', 'localStorage', function ($scope, localDB, localStorage) {

  $scope.global = localStorage;
  var generalLocations = [];
  $scope.locations = [];

  //----- current user location
  $scope.userNewLocation = angular.copy($scope.global.currentGeoLocation.fullLocation);

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
    } else {
      console.log(results);
    }
  });

  //-------- Select City
  $scope.selectCity = function(locationId) {
    for(var j = 0; j < $scope.locations.length; j++) {
      if($scope.locations[j].cityId === locationId) {
        $scope.userNewLocation = $scope.locations[j].fullLocation;
        //----- if user settings changing
        if($scope.global.isOpenSettingsPage) {
          $scope.global.userInfo.fullLocation = $scope.userNewLocation;
          $scope.global.userInfo.city_id = locationId;
          for(var i = 0; i < generalLocations.length; i++) {
            if (generalLocations[i].cityId === locationId) {
              $scope.global.userInfo.cityName = generalLocations[i].cityName;
              $scope.global.userInfo.regionName = generalLocations[i].regionName;
              $scope.global.userInfo.countryName = generalLocations[i].countryName;
              $scope.global.userInfo.climaticZone = generalLocations[i].climaticZone;
              $scope.global.userInfo.heatTransfer = generalLocations[i].heatTransfer;
            }
          }
          //----- save changes in Global DB
          localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"city_id": locationId}, {"id": $scope.global.userInfo.id});
        //-------- if current geolocation changing
        } else {
          for(var c = 0; c < generalLocations.length; c++) {
            if (generalLocations[c].cityId === locationId) {
              //----- build new currentGeoLocation
              $scope.global.currentGeoLocation = angular.copy(generalLocations[c]);
              $scope.global.currentGeoLocation.fullLocation = $scope.userNewLocation;
            }
          }
        }
        $scope.global.startProgramm = false;
        closeLocationPage();
      }
    }

  };
  //-------- close Location Page
  $scope.cancelLocationPage = function() {
    closeLocationPage()
  };

  function closeLocationPage() {
    if($scope.global.isOpenSettingsPage) {
      $scope.global.gotoSettingsPage();
    } else {
      $scope.global.showNavMenu = true;
      $scope.global.isConfigMenu = false;
      $scope.global.showPanels = {};
      $scope.global.gotoMainPage();
    }
  }

}]);
