
// controllers/panels/glass.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('GlassCtrl', glassSelectorCtrl);

  function glassSelectorCtrl($scope, globalConstants, localStorage, UserStor, analyticsServ) {
    var thisCtrl = this;

    thisCtrl.config = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };
    thisCtrl.global = localStorage.storage;

    // Select glass
    thisCtrl.selectGlass = function(typeIndex, glassIndex, glassId) {
      thisCtrl.global.product.glassTypeIndex = typeIndex;
      thisCtrl.global.product.glassIndex = glassIndex;
      var selectedGlass = thisCtrl.global.glasses[typeIndex][glassIndex];
      thisCtrl.global.product.glassId = glassId;
      thisCtrl.global.product.glassName = selectedGlass.glassName;
      thisCtrl.global.product.glassHeatCoeff = selectedGlass.heatCoeff;
      thisCtrl.global.product.glassAirCoeff = selectedGlass.airCoeff;
      //------ calculate price
      thisCtrl.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
      //------ save analytics data
      analyticsServ.saveGlassAnalyticDB(UserStor.userInfo.id, $scope.global.order.orderId, glassId, typeIndex);
    };

  }
})();
