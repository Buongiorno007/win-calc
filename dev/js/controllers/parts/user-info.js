/* globals BauVoiceApp, STEP, playSound */
'use strict';

BauVoiceApp.controller('UserInfoCtrl', ['$scope', 'globalDB', 'localDB', 'localStorage', function ($scope, globalDB, localDB, localStorage) {

  $scope.global = localStorage;

  $scope.userInfo = {
    DELAY_SHOW_USER_INFO: 2000,
    typing: 'on',
    checked: false
  };
/*
  $scope.changeTyping = function () {
    if ($scope.userInfo.checked) {
      $scope.userInfo.typing = 'off';
    } else {
      $scope.userInfo.typing = 'on';
    }
  };

  $scope.swipeMainPage = function() {
    //$rootScope.$broadcast('swipeMainPage', true);
    $scope.global.showNavMenu = !$scope.global.showNavMenu;
    $scope.global.isConfigMenu = true;
    if(!$scope.global.isOpenedHistoryPage) {
      $scope.global.startProgramm = false;
    }
  };
 */
  $scope.swipeLeft = function($event) {
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    if(!$scope.global.isOpenedHistoryPage) {
      $scope.global.startProgramm = false;
    }
    playSound('swip');
  };

  $scope.swipeRight = function($event) {
    $scope.global.showNavMenu = true;
    $scope.global.isConfigMenu = false;
    playSound('swip');
  };

/*
  $rootScope.$on('swipeMainPage', function() {
    $scope.userInfo.isConfigMenuShow = !$scope.userInfo.isConfigMenuShow;
  });
*/

}]);
