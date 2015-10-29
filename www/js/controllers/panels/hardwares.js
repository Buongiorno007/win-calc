
// controllers/panels/hardwares.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('HardwaresCtrl', hardwareSelectorCtrl);

  function hardwareSelectorCtrl(globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, MainServ, AnalyticsServ) {

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
    thisCtrl.selectHardware = selectHardware;
    thisCtrl.showInfoBox = MainServ.showInfoBox;


    //============ methods ================//


    //----------- Select hardware
    function selectHardware(newId) {
      if(ProductStor.product.hardware.id !== newId) {
        //-------- set current Hardware
        MainServ.setCurrentHardware(ProductStor.product, newId);
        //------ calculate price
        MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass[0].id, ProductStor.product.hardware.id);//TODO array!!
        //------ save analytics data
        AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 3);
      }
    }

  }
})();

