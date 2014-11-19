'use strict';

BauVoiceApp.controller('UserInfoCtrl', ['$scope', 'globalDB', 'localStorage', function ($scope, globalDB, localStorage) {

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
/*
  locationService.getCity(function (results) {
    if (results.status) {
      $scope.userInfo.location = results.data.city.name;
      $scope.global.userGeoLocation = results.data.city.name;
    } else {
      console.log(results);
    }
  });
*/
  $scope.swipeMainPage = function() {
    //$rootScope.$broadcast('swipeMainPage', true);
    $scope.global.showNavMenu = !$scope.global.showNavMenu;
    $scope.global.isConfigMenu = true;
    $scope.global.startFirstStep = false;
  };
/*
  $rootScope.$on('swipeMainPage', function() {
    $scope.userInfo.isConfigMenuShow = !$scope.userInfo.isConfigMenuShow;
  });
*/

}]);
