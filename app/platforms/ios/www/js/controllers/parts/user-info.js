
// controllers/parts/user-info.js

/* globals BauVoiceApp, STEP, playSound */
'use strict';

BauVoiceApp.controller('UserInfoCtrl', ['$scope', 'globalDB', 'localDB', 'localStorage', '$translate', function ($scope, globalDB, localDB, localStorage, $translate) {

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

  $scope.swipeMainPage = function() {
    //$rootScope.$broadcast('swipeMainPage', true);
    $scope.global.showNavMenu = !$scope.global.showNavMenu;
    $scope.global.isConfigMenu = true;
    if(!$scope.global.isOpenedHistoryPage) {
      $scope.global.startProgramm = false;
    }
  };
 */
  $(".user-info-container").swipe( {
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
      if(direction === 'left') {
        $scope.global.showNavMenu = false;
        $scope.global.isConfigMenu = true;
        if(!$scope.global.isOpenedHistoryPage) {
          $scope.global.startProgramm = false;
        }
        playSound('swip');
      } else if(direction === 'right') {
        $scope.global.showNavMenu = true;
        $scope.global.isConfigMenu = false;
        playSound('swip');
      }
      $scope.$apply();
    },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
    threshold:0
  });


/*
  $rootScope.$on('swipeMainPage', function() {
    $scope.userInfo.isConfigMenuShow = !$scope.userInfo.isConfigMenuShow;
  });
*/

}]);

