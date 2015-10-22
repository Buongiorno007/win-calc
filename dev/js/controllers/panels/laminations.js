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
    thisCtrl.selectLaminat = selectLaminat;
    thisCtrl.showInfoBox = MainServ.showInfoBox;



    //============ methods ================//

    //------------ Select lamination
    function selectLaminat(type, id, name) {
      if(type) {
        ProductStor.product.lamination_out_id = id;
        if(id === 1) {
          ProductStor.product.laminationOutName =  $filter('translate')('mainpage.WHITE_LAMINATION');
        } else {
          ProductStor.product.laminationOutName = name;
        }
      } else {
        ProductStor.product.lamination_in_id = id;
        if(id === 1) {
          ProductStor.product.laminationInName =  $filter('translate')('mainpage.WHITE_LAMINATION');
        } else {
          ProductStor.product.laminationInName = name;
        }
      }
      setLaminationTotalPrice();
      //------ save analytics data
      //TODO analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.order_id, id, type);
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
