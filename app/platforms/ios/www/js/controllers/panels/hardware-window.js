/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HardwareWindowCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.hardwarePanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    isSelectedHardwareProducer: 0,
    isSelectedHardware: 0,
    typing: 'on'
  };

  constructService.getAllHardware(function (results) {
    if (results.status) {
      $scope.hardwarePanel.hardwareProducers = results.data.producers;
      $scope.hardwarePanel.hardwares = results.data.hardwares;
    } else {
      console.log(results);
    }
  });

  // Select hardware
  $scope.selectHardware = function(producerId, hardwareId) {
    $scope.hardwarePanel.isSelectedHardwareProducer = producerId;
    $scope.hardwarePanel.isSelectedHardware = hardwareId;

    var selectedHardware = $scope.hardwarePanel.hardwares[producerId][hardwareId];
    $scope.global.product.hardwareName = selectedHardware.hardwareName;
    $scope.global.hardwarePriceTOTAL = selectedHardware.hardwarePrice;
    $scope.global.setProductPriceTOTAL();
  };

}]);
