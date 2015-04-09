
// controllers/panels/hardware-window.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .controller('HardwareWindowCtrl', hardwareSelectorCtrl);

  hardwareSelectorCtrl.$inject = ['$scope', 'globalConstants', 'localStorage', 'analyticsServ'];

  function hardwareSelectorCtrl($scope, globalConstants, localStorage, analyticsServ) {

    $scope.global = localStorage;

    $scope.hardwarePanel = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };

    // Select hardware
    $scope.selectHardware = function(hardwareTypeIndex, hardwareIndex) {
      $scope.global.product.hardwareTypeIndex = hardwareTypeIndex;
      $scope.global.product.hardwareIndex = hardwareIndex;
      var selectedHardware = $scope.global.hardwares[hardwareTypeIndex][hardwareIndex];
      $scope.global.product.hardwareId = selectedHardware.hardwareId;
      $scope.global.product.hardwareName = selectedHardware.hardwareName;
      $scope.global.product.hardwareHeatCoeff = selectedHardware.heatCoeff;
      $scope.global.product.hardwareAirCoeff = selectedHardware.airCoeff;
      $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
      //------ save analytics data
      analyticsServ.saveAnalyticDB($scope.global.userInfo.id, $scope.global.order.orderId, hardwareIndex, hardwareTypeIndex);
    };

  }
})();

