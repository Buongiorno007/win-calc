
// controllers/panels/lamination.js

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
    isSelectedLaminatInner: 'white',
    isSelectedLaminatOuter: 'white',
    typing: 'on'
  };

  constructService.getAllLamination(function (results) {
    if (results.status) {
      $scope.laminationPanel.laminatWhite = results.data.laminationWhite;
      $scope.laminationPanel.laminatIn = results.data.laminationInside;
      $scope.laminationPanel.laminatOut = results.data.laminationOutside;
    } else {
      console.log(results);
    }
  });

  // Select lamination
  $scope.selectLaminatIn = function(laminatId) {
    $scope.laminationPanel.isSelectedLaminatInner = laminatId;
    if(laminatId !== 'white') {
      $scope.global.product.laminationInner = $scope.laminationPanel.laminatIn[laminatId].laminationName;
      $scope.laminationInPrice = $scope.laminationPanel.laminatIn[laminatId].laminationPrice;
      $scope.setLaminationTotalPrice();
    } else {
      $scope.global.product.laminationInner =  $scope.laminationPanel.laminatWhite;
      $scope.laminationInPrice = 0;
      $scope.setLaminationTotalPrice();
    }
  };

  $scope.selectLaminatOut = function(laminatId) {
    $scope.laminationPanel.isSelectedLaminatOuter = laminatId;
    if(laminatId !== 'white') {
      $scope.global.product.laminationOuter = $scope.laminationPanel.laminatOut[laminatId].laminationName;
      $scope.laminationOutPrice = $scope.laminationPanel.laminatOut[laminatId].laminationPrice;
      $scope.setLaminationTotalPrice();
    } else {
      $scope.global.product.laminationOuter =  $scope.laminationPanel.laminatWhite;
      $scope.laminationOutPrice = 0;
      $scope.setLaminationTotalPrice();
    }
  };

  $scope.setLaminationTotalPrice = function() {
    $scope.global.laminationPriceTOTAL = $scope.laminationInPrice + $scope.laminationOutPrice;
    $scope.global.setProductPriceTOTAL();
  };

}]);
