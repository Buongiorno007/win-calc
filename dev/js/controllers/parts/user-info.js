'use strict';

BauVoiceApp.controller('UserInfoCtrl', ['$rootScope', '$scope', 'locationService', 'globalData', function ($rootScope, $scope, locationService, globalData) {

  $scope.global = globalData;

  $scope.userInfo = {
    DELAY_SHOW_USER_INFO: 2000,
    //isConfigMenuShow: false,
    name: 'John Appleseed',
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

  locationService.getCity(function (results) {
    if (results.status) {
      $scope.userInfo.location = results.data.city.name;
      $scope.global.userGeoLocation = results.data.city.name;
    } else {
      console.log(results);
    }
  });

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
