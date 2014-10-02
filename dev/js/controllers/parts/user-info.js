'use strict';

BauVoiceApp.controller('UserInfoCtrl', ['$rootScope', '$scope', 'localStorage', 'locationService', 'globalData', function ($rootScope, $scope, localStorage, locationService, globalData) {

  $scope.global = globalData;

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

  localStorage.getUserInfo(function (results) {
    if (results.status) {
      $scope.userInfo.name = results.data.user.name;
      $scope.userInfo.location = results.data.city.name;
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
  };
/*
  $rootScope.$on('swipeMainPage', function() {
    $scope.userInfo.isConfigMenuShow = !$scope.userInfo.isConfigMenuShow;
  });
*/

}]);
