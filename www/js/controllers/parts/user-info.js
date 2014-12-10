
// controllers/parts/user-info.js

'use strict';

BauVoiceApp.controller('UserInfoCtrl', ['$scope', 'globalDB', 'localDB', 'localStorage', function ($scope, globalDB, localDB, localStorage) {

  $scope.global = localStorage;

  $scope.userInfo = {
    DELAY_SHOW_USER_INFO: 2000,
    typing: 'on',
    checked: false
  };

  $scope.changeTyping = function () {
    if ($scope.userInfo.checked) {
      $scope.userInfo.typing = 'off';
    } else {
      $scope.userInfo.typing = 'on';
    }
  };

  //--------- get user data and location for first time

  if($scope.global.startProgramm) {
    localDB.selectAllDBGlobal($scope.global.usersTableDBGlobal, function (results) {
      if (results.status) {
        $scope.global.userInfo = angular.copy(results.data[0]);
        //------ find user city in global DB
        localDB.selectDBGlobal($scope.global.citiesTableDBGlobal, {'id': $scope.global.userInfo.city_id }, function (results) {
          if (results.status) {
            $scope.global.userInfo.cityName = results.data[0].name;
            //------ find user region in global DB
            localDB.selectDBGlobal($scope.global.regionsTableDBGlobal, {'id': results.data[0].region_id }, function (results) {
              if (results.status) {
                $scope.global.userInfo.regionName = results.data[0].name;
                $scope.global.userInfo.climaticZone = results.data[0].climatic_zone;
                $scope.global.userInfo.heatTransfer = results.data[0].heat_transfer;
                //------ find user country in global DB
                localDB.selectDBGlobal($scope.global.countriesTableDBGlobal, {'id': results.data[0].country_id }, function (results) {
                  if (results.status) {
                    $scope.global.userInfo.countryName = results.data[0].name;
                    $scope.global.userInfo.fullLocation = '' + $scope.global.userInfo.cityName + ', ' + $scope.global.userInfo.regionName + ', ' + $scope.global.userInfo.countryName;

                    //------ set current GeoLocation
                    $scope.global.currentGeoLocation = {
                      cityId: angular.copy($scope.global.userInfo.city_id),
                      cityName: angular.copy($scope.global.userInfo.cityName),
                      regionName: angular.copy($scope.global.userInfo.regionName),
                      countryName: angular.copy($scope.global.userInfo.countryName),
                      climaticZone: angular.copy($scope.global.userInfo.climaticZone),
                      heatTransfer: angular.copy($scope.global.userInfo.heatTransfer),
                      fullLocation: angular.copy($scope.global.userInfo.fullLocation)
                    };
                    //console.log($scope.global.userInfo);
                  } else {
                    console.log(results);
                  }
                });

              } else {
                console.log(results);
              }
            });
          } else {
            console.log(results);
          }
        });
      } else {
        console.log(results);
      }
    });
    //$scope.global.firstGetUserData = false;
  }


/*
  globalDB.getUserInfo(function (results) {
    if (results.status) {
      $scope.global.userName = results.data.user.name;
      $scope.global.userGeoLocationId = results.data.city.id;
      $scope.global.userGeoLocation = results.data.city.name;
      $scope.$apply();
    } else {
      console.log(results);
    }
  });
*/
  $scope.swipeMainPage = function() {
    //$rootScope.$broadcast('swipeMainPage', true);
    $scope.global.showNavMenu = !$scope.global.showNavMenu;
    $scope.global.isConfigMenu = true;
    $scope.global.startProgramm = false;
  };
/*
  $rootScope.$on('swipeMainPage', function() {
    $scope.userInfo.isConfigMenuShow = !$scope.userInfo.isConfigMenuShow;
  });
*/

}]);

