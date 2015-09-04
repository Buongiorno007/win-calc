
// controllers/panels/lamination.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('LaminationCtrl', laminationSelectorCtrl);

  function laminationSelectorCtrl($scope, globalConstants, globalDB, localStorage, UserStor, analyticsServ) {

    var thisCtrl = this;
    $scope.global = localStorage.storage;

    thisCtrl.config = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };

    //----------- get all lamination
    globalDB.selectAllDBGlobal(globalDB.laminationTableDBGlobal, function(results){
      if(results.status) {
        var laminations = results.data,
            laminationQty = laminations.length;
        //TODO вообще пустую ламинацию удалить из базы
        //-------- find and delete white lamination from lamination Arr
        while(--laminationQty > -1) {
          if(laminations[laminationQty].name === 'No color') {
            laminations.splice(laminationQty, 1);
          }
        }
        thisCtrl.laminationsIn = angular.copy(laminations);
        thisCtrl.laminationsOut = angular.copy(laminations);
      } else {
        console.log('No laminations in database', results);
      }
    });


    //------ clicking
    thisCtrl.selectLaminatIn = selectLaminatIn;
    thisCtrl.selectLaminatOut = selectLaminatOut;




    //============ methods ================//

    //------------ Select lamination
    function selectLaminatIn(laminatIndex) {
      if(laminatIndex === 'white') {
        $scope.global.product.laminationInId = 'white';
        $scope.global.product.laminationInName =  $scope.global.laminationsWhite;
        $scope.global.product.laminationInPrice = 0;
      } else {
        $scope.global.product.laminationInId = thisCtrl.laminationsIn[laminatIndex].id;
        $scope.global.product.laminationInName = thisCtrl.laminationsIn[laminatIndex].name;
        $scope.global.product.laminationInPrice = 547; //TODO price is absented in GlobalDB
      }
      setLaminationTotalPrice();
      //------ save analytics data
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, $scope.global.order.orderId, $scope.global.product.laminationInId, 1);
    }

    function selectLaminatOut(laminatIndex) {
      if(laminatIndex === 'white') {
        $scope.global.product.laminationOutId = 'white';
        $scope.global.product.laminationOutName =  $scope.global.laminationsWhite;
        $scope.global.product.laminationOutPrice = 0;
      } else {
        $scope.global.product.laminationOutId = thisCtrl.laminationsOut[laminatIndex].id;
        $scope.global.product.laminationOutName = thisCtrl.laminationsOut[laminatIndex].name;
        $scope.global.product.laminationOutPrice = 547; //TODO price is absented in GlobalDB
      }
      setLaminationTotalPrice();
      //------ save analytics data
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, $scope.global.order.orderId, $scope.global.product.laminationOutId, 2);
    }

    function setLaminationTotalPrice() {
      $scope.global.product.laminationPriceSELECT = $scope.global.product.laminationInPrice + $scope.global.product.laminationOutPrice;
      $scope.global.setProductPriceTOTALapply();
    }

  }
})();

