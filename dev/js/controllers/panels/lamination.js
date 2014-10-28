/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('LaminationCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

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
      $scope.global.product.productPrice += $scope.laminationPanel.laminatIn[laminatId].laminationPrice;
    } else {
      $scope.global.product.laminationInner =  $scope.laminationPanel.laminatWhite;
    }
  };

  $scope.selectLaminatOut = function(laminatId) {
    $scope.laminationPanel.isSelectedLaminatOuter = laminatId;
    if(laminatId !== 'white') {
      $scope.global.product.laminationOuter = $scope.laminationPanel.laminatOut[laminatId].laminationName;
      $scope.global.product.productPrice += $scope.laminationPanel.laminatOut[laminatId].laminationPrice;
    } else {
      $scope.global.product.laminationOuter =  $scope.laminationPanel.laminatWhite;
    }
  };

}]);
