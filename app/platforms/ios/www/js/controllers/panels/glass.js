
// controllers/panels/glass.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('GlassCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.glassPanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    typing: 'on'
  };


  // Select glass
  $scope.selectGlass = function(typeIndex, glassIndex, glassId) {
    $scope.global.product.glassTypeIndex = typeIndex;
    $scope.global.product.glassIndex = glassIndex;
    var selectedGlass = $scope.global.glasses[typeIndex][glassIndex];
    $scope.global.product.glassId = glassId;
    $scope.global.product.glassName = selectedGlass.glassName;
    $scope.global.product.glassHeatCoeff = selectedGlass.heatCoeff;
    $scope.global.product.glassAirCoeff = selectedGlass.airCoeff;
    $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId);
  };

}]);

