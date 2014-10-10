/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('SchemeViewCtrl', ['$scope', 'localStorage', function ($scope, localStorage) {

  $scope.global = localStorage;

  // Close Window Scheme Dialog
  $scope.closeWindowScheme = function() {
    $scope.global.isWindowSchemeDialog = false;
  }

}]);
