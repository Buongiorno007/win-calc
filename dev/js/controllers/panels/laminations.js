(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('LaminationsCtrl', laminationSelectorCtrl);

  function laminationSelectorCtrl($timeout, globalConstants, globalDB, GlobalStor, OrderStor, ProductStor, UserStor, MainServ, analyticsServ) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };

    //----------- get all lamination
    globalDB.selectAllDBGlobal(globalDB.laminationTableDBGlobal).then(function(result){
      if(result) {
        var laminations = result,
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
        console.log('No laminations in database');
      }
    });


    //------ clicking
    thisCtrl.selectLaminatIn = selectLaminatIn;
    thisCtrl.selectLaminatOut = selectLaminatOut;




    //============ methods ================//

    //------------ Select lamination
    function selectLaminatIn(laminatIndex) {
      if(laminatIndex === 'white') {
        ProductStor.product.laminationInId = 'white';
        ProductStor.product.laminationInName =  GlobalStor.global.laminationsWhite;
        ProductStor.product.laminationInPrice = 0;
      } else {
        ProductStor.product.laminationInId = thisCtrl.laminationsIn[laminatIndex].id;
        ProductStor.product.laminationInName = thisCtrl.laminationsIn[laminatIndex].name;
        ProductStor.product.laminationInPrice = 547; //TODO price is absented in GlobalDB
      }
      setLaminationTotalPrice();
      //------ save analytics data
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, ProductStor.product.laminationInId, 1);
    }


    function selectLaminatOut(laminatIndex) {
      if(laminatIndex === 'white') {
        ProductStor.product.laminationOutId = 'white';
        ProductStor.product.laminationOutName =  GlobalStor.global.laminationsWhite;
        ProductStor.product.laminationOutPrice = 0;
      } else {
        ProductStor.product.laminationOutId = thisCtrl.laminationsOut[laminatIndex].id;
        ProductStor.product.laminationOutName = thisCtrl.laminationsOut[laminatIndex].name;
        ProductStor.product.laminationOutPrice = 547; //TODO price is absented in GlobalDB
      }
      setLaminationTotalPrice();
      //------ save analytics data
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, ProductStor.product.laminationOutId, 2);
    }


    function setLaminationTotalPrice() {
      ProductStor.product.laminationPriceSELECT = ProductStor.product.laminationInPrice + ProductStor.product.laminationOutPrice;
      $timeout(function() {
        MainServ.setProductPriceTOTAL();
      }, 50);

    }

  }
})();
