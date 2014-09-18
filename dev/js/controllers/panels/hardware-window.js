/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HardwareWindowCtrl', ['$scope', 'globalData', 'constructService', function ($scope, globalData, constructService) {

  $scope.global = globalData;

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
    $scope.global.hardwareName = selectedHardware.hardwareName;
    $scope.global.orderPrice += selectedHardware.hardwarePrice;
  };

}]);
