
// controllers/panels/glass.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('GlassCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.glassPanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    isSelectedGlassType: 0,
    isSelectedGlass: 0,
    typing: 'on'
  };

  constructService.getAllGlass(function (results) {
    if (results.status) {
      $scope.glassPanel.glassTypes = results.data.glassTypes;
      $scope.glassPanel.glasses = results.data.glasses;
    } else {
      console.log(results);
    }
  });

  // Select glass
  $scope.selectGlass = function(typeId, glassIndex, glassId) {
    var selectedGlass = $scope.glassPanel.glasses[typeId][glassIndex];
    $scope.glassPanel.isSelectedGlassType = typeId;
    $scope.global.product.glassId = glassId;
    $scope.global.product.glassName = selectedGlass.glassName;
    $scope.global.product.glassHeatCoeff = selectedGlass.heatCoeff;
    $scope.global.product.glassAirCoeff = selectedGlass.airCoeff;
    $scope.global.createObjXFormedPrice($scope.global.templateDefault, $scope.global.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId);
  };

}]);

