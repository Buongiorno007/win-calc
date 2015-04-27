
// controllers/panels/hardwares.js

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
    thisCtrl.global = GlobalStor.global;
    thisCtrl.product = ProductStor.product;

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
      var selectedHardware = GlobalStor.global.hardwares[hardwareTypeIndex][hardwareIndex];
      ProductStor.product.hardwareId = selectedHardware.hardwareId;
      ProductStor.product.hardwareName = selectedHardware.hardwareName;
      ProductStor.product.hardwareHeatCoeff = selectedHardware.heatCoeff;
      ProductStor.product.hardwareAirCoeff = selectedHardware.airCoeff;

      //------ calculate price
      MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profileId, ProductStor.product.glassId, ProductStor.product.hardwareId);
      //------ save analytics data
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, hardwareIndex, hardwareTypeIndex);
    }

  }
})();

