/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('MainCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
  $scope.main = {
    isConfigMenuShow: false
  };

  $rootScope.$on('swipeMainPage', function() {
    $scope.main.isConfigMenuShow = !$scope.main.isConfigMenuShow;
  });
}]);