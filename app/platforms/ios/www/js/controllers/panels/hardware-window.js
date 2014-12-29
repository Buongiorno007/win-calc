
// controllers/panels/hardware-window.js

/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HardwareWindowCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.hardwarePanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    typing: 'on'
  };

  // Select hardware
  $scope.selectHardware = function(hardwareTypeIndex, hardwareIndex) {
    $scope.global.product.hardwareTypeIndex = hardwareTypeIndex;
    $scope.global.product.hardwareIndex = hardwareIndex;
    var selectedHardware = $scope.global.hardwares[hardwareTypeIndex][hardwareIndex];
    $scope.global.product.hardwareName = selectedHardware.hardwareName;
    $scope.global.product.hardwareHeatCoeff = selectedHardware.heatCoeff;
    $scope.global.product.hardwareAirCoeff = selectedHardware.airCoeff;
    $scope.global.product.hardwarePriceSELECT = selectedHardware.hardwarePrice;
    $scope.global.calculateCoeffs();
    $scope.global.setProductPriceTOTALapply();
  };

}]);
