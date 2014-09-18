/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('GlassCtrl', ['$scope', 'globalData', 'constructService', function ($scope, globalData, constructService) {

  $scope.global = globalData;

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
  $scope.selectGlass = function(typeId, glassId) {
    $scope.glassPanel.isSelectedGlassType = typeId;
    $scope.glassPanel.isSelectedGlass = glassId;

    var selectedGlass = $scope.glassPanel.glasses[typeId][glassId];
    $scope.global.glassName = selectedGlass.glassName;
    $scope.global.orderPrice += selectedGlass.glassPrice;
  };

}]);
