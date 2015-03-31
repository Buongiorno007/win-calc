/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('LaminationCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.laminationInPrice = 0;
  $scope.laminationOutPrice = 0;

  $scope.laminationPanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    typing: 'on'
  };

  // Select lamination
  $scope.selectLaminatIn = function(laminatIndex) {
    if(laminatIndex !== 'white') {
      $scope.global.product.laminationInIndex = laminatIndex;
      $scope.global.product.laminationInName = $scope.global.laminationsIn[laminatIndex].laminationName;
      $scope.global.product.laminationInPrice = $scope.global.laminationsIn[laminatIndex].laminationPrice;
      $scope.setLaminationTotalPrice();
    } else {
      $scope.global.product.laminationInIndex = 'white';
      $scope.global.product.laminationInName =  $scope.global.laminationsWhite;
      $scope.global.product.laminationInPrice = 0;
      $scope.setLaminationTotalPrice();
    }
  };

  $scope.selectLaminatOut = function(laminatIndex) {
    if(laminatIndex !== 'white') {
      $scope.global.product.laminationOutIndex = laminatIndex;
      $scope.global.product.laminationOutName = $scope.global.laminationsOut[laminatIndex].laminationName;
      $scope.global.product.laminationOutPrice = $scope.global.laminationsOut[laminatIndex].laminationPrice;
      $scope.setLaminationTotalPrice();
    } else {
      $scope.global.product.laminationOutIndex = 'white';
      $scope.global.product.laminationOutName =  $scope.global.laminationsWhite;
      $scope.global.product.laminationOutPrice = 0;
      $scope.setLaminationTotalPrice();
    }
  };

  $scope.setLaminationTotalPrice = function() {
    $scope.global.product.laminationPriceSELECT = $scope.global.product.laminationInPrice + $scope.global.product.laminationOutPrice;
    $scope.global.setProductPriceTOTALapply();
  };

}]);
