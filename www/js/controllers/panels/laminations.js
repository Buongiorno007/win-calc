
// controllers/panels/laminations.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('LaminationsCtrl', laminationSelectorCtrl);

  function laminationSelectorCtrl($timeout, $filter, globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, MainServ, analyticsServ) {

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
    function selectLaminatIn(id, name) {
      if(id) {
        ProductStor.product.laminationInId = id;
        ProductStor.product.laminationInName = name;
        ProductStor.product.laminationInPrice = 547; //TODO price is absented in GlobalDB
      } else {
        ProductStor.product.laminationInId = 0;
        ProductStor.product.laminationInName =  $filter('translate')('mainpage.CONFIGMENU_NOT_LAMINATION');
        ProductStor.product.laminationInPrice = 0;
      }
      setLaminationTotalPrice();
      //------ save analytics data
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, ProductStor.product.laminationInId, 1);
    }


    function selectLaminatOut(id, name) {
      if(id) {
        ProductStor.product.laminationOutId = id;
        ProductStor.product.laminationOutName = name;
        ProductStor.product.laminationOutPrice = 547; //TODO price is absented in GlobalDB
      } else {
        ProductStor.product.laminationOutId = 0;
        ProductStor.product.laminationOutName =  $filter('translate')('mainpage.CONFIGMENU_NOT_LAMINATION');
        ProductStor.product.laminationOutPrice = 0;
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

