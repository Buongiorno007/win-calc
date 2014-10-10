/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('MainCtrl', ['$rootScope', '$scope', 'localStorage', function ($rootScope, $scope, localStorage) {
  $scope.global = localStorage;
/*
  $scope.main = {
    isConfigMenuShow: false
  };

  $rootScope.$on('swipeMainPage', function() {
    $scope.main.isConfigMenuShow = !$scope.main.isConfigMenuShow;
  });
*/

}]);
