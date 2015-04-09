(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .controller('LaminationCtrl', laminationSelectorCtrl);

  laminationSelectorCtrl.$inject = ['$scope', 'globalConstants', 'localStorage', 'analyticsServ'];

  function laminationSelectorCtrl($scope, globalConstants, localStorage, analyticsServ) {

    $scope.global = localStorage;

    $scope.laminationInPrice = 0;
    $scope.laminationOutPrice = 0;

    $scope.laminationPanel = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
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
      //------ save analytics data
      analyticsServ.saveAnalyticDB($scope.global.userInfo.id, $scope.global.order.orderId, laminatIndex, 1);
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
      //------ save analytics data
      analyticsServ.saveAnalyticDB($scope.global.userInfo.id, $scope.global.order.orderId, laminatIndex, 2);
    };

    $scope.setLaminationTotalPrice = function() {
      $scope.global.product.laminationPriceSELECT = $scope.global.product.laminationInPrice + $scope.global.product.laminationOutPrice;
      $scope.global.setProductPriceTOTALapply();
    };

  }
})();
