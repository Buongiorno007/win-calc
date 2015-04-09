
// controllers/parts/user-info.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .controller('UserInfoCtrl', userInfoCtrl);

  userInfoCtrl.$inject = ['$scope', 'localStorage', 'globalConstants'];

  function userInfoCtrl($scope, localStorage, globalConstants) {

    $scope.global = localStorage;

    $scope.userInfo = {
      DELAY_SHOW_USER_INFO: 40 * globalConstants.STEP,
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
   */
    $scope.swipeMainPage = function(event) {
      //$rootScope.$broadcast('swipeMainPage', true);
      $scope.global.showNavMenu = !$scope.global.showNavMenu;
      $scope.global.isConfigMenu = true;
      if(!$scope.global.isOpenedHistoryPage) {
        $scope.global.startProgramm = false;
      }
      //playSound('swip');
    };

    $scope.swipeLeft = function(event) {
      if($scope.global.showNavMenu) {
        $scope.global.showNavMenu = false;
        $scope.global.isConfigMenu = true;
        if (!$scope.global.isOpenedHistoryPage) {
          $scope.global.startProgramm = false;
        }
        //playSound('swip');
      }
    };

    $scope.swipeRight = function(event) {
      if(!$scope.global.showNavMenu) {
        $scope.global.showNavMenu = true;
        $scope.global.isConfigMenu = false;
        //playSound('swip');
      }
    };

  /*
    $rootScope.$on('swipeMainPage', function() {
      $scope.userInfo.isConfigMenuShow = !$scope.userInfo.isConfigMenuShow;
    });
  */

  }
})();

