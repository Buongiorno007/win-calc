/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('LocationCtrl', ['$scope', 'localDB', 'constructService', 'localStorage', function ($scope, localDB, constructService, localStorage) {

  $scope.global = localStorage;
  $scope.location = {
    userDefaultLocation: ''
  };

  $scope.location.userDefaultLocation += $scope.global.userInfo.cityName + ', ' + $scope.global.userInfo.regionName + ', ' + $scope.global.userInfo.countryName;

  //--------- get all cities
  localDB.selectAllDBGlobal($scope.global.citiesTableDBGlobal, function (results) {
    if (results.status) {
      //console.log(results.data);
      var locations = [],
          cities = results.data;

      for(var c = 0; c < cities.length; c++) {
        var location = {};
        location.cityId = cities[c].id;
        location.fullLocation = cities[c].name;
        console.log(location.cityId);
        //------ find region
        localDB.selectDBGlobal($scope.global.regionsTableDBGlobal, {'id': cities[c].region_id }, function (results) {
          if (results.status) {
            console.log(results.data[0].name);
            location.fullLocation += ', '+results.data[0].name + ', ';
            console.log(location.fullLocation);
/*
            //------ find country
            localDB.selectDBGlobal($scope.global.countriesTableDBGlobal, {'id': results.data[0].country_id }, function (results) {
              if (results.status) {
                //console.log()
                location.fullLocation += results.data[0].name;
                locations.push(location);
                location.length = 0;
                console.log(locations);
                console.log(location);
              } else {
                console.log(results);
              }
            });
*/


          } else {
            console.log(results);
          }
        });

      }
      //$scope.global.userInfo = angular.copy(results.data[0]);

 /*
      //------ find user city in global DB
      localDB.selectDBGlobal($scope.global.citiesTableDBGlobal, {'id': $scope.global.userInfo.city_id }, function (results) {
        if (results.status) {
          $scope.global.userInfo.cityName = results.data[0].name;

        } else {
          console.log(results);
        }
      });
 */

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
/*
  // Search Location
  $scope.filteredCity = [];
  var regex, checkCity, indexCity, cityObj;

  // Create regExpresion
  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  $scope.checkChanges = function() {
    console.log($scope.location.currCity);
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
*/
  // Select City
  $scope.selectCity = function() {
    $scope.global.gotoSettingsPage();
  };

}]);