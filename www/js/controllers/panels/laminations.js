
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
        ProductStor.product.lamination_in_id = id;
        ProductStor.product.laminationInName = name;
      } else {
        ProductStor.product.lamination_in_id = 0;
        ProductStor.product.laminationInName =  $filter('translate')('mainpage.CONFIGMENU_NOT_LAMINATION');
      }
      setLaminationTotalPrice();
      //------ save analytics data
      //TODO analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.order_number, ProductStor.product.lamination_in_id, 1);
    }


    function selectLaminatOut(id, name) {
      if(id) {
        ProductStor.product.lamination_out_id = id;
        ProductStor.product.laminationOutName = name;
      } else {
        ProductStor.product.lamination_out_id = 0;
        ProductStor.product.laminationOutName =  $filter('translate')('mainpage.CONFIGMENU_NOT_LAMINATION');
      }
      setLaminationTotalPrice();
      //------ save analytics data
      //TODO analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.order_number, ProductStor.product.lamination_out_id, 2);
    }

    //TODO?????
    function setLaminationTotalPrice() {
//      ProductStor.product.laminationPriceSELECT = ProductStor.product.laminationInPrice + ProductStor.product.laminationOutPrice;
//      $timeout(function() {
//        MainServ.setProductPriceTOTAL();
//      }, 50);
    }

  }
})();

