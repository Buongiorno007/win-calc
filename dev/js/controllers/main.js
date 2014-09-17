/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('MainCtrl', ['$rootScope', '$scope', 'globalData', function ($rootScope, $scope, globalData) {
  $scope.global = globalData;
/*
  $scope.main = {
    isConfigMenuShow: false
  };

  $rootScope.$on('swipeMainPage', function() {
    $scope.main.isConfigMenuShow = !$scope.main.isConfigMenuShow;
  });
*/

}]);
