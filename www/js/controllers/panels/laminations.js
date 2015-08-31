
// controllers/panels/laminations.js

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

