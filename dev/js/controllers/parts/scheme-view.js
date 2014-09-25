/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('SchemeViewCtrl', ['$scope', 'globalData', function ($scope, globalData) {

  $scope.global = globalData;

  // Close Window Scheme Dialog
  $scope.closeWindowScheme = function() {
    $scope.global.isWindowSchemeDialog = false;
  }

}]);
