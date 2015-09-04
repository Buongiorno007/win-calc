(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('HardwaresCtrl', hardwareSelectorCtrl);

  function hardwareSelectorCtrl(globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, MainServ, analyticsServ) {

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


    //============ methods ================//


    //----------- Select hardware
    function selectHardware(hardwareTypeIndex, hardwareIndex) {
      ProductStor.product.hardwareTypeIndex = hardwareTypeIndex;
      ProductStor.product.hardwareIndex = hardwareIndex;
      //-------- set current Hardware
      MainServ.setCurrentHardware();
      //------ calculate price
      MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass.list_id, ProductStor.product.hardware_id);
      //------ save analytics data
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, hardwareIndex, hardwareTypeIndex);
    }

  }
})();
