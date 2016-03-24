(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('HardwaresCtrl',

  function(
    $filter,
    globalConstants,
    GlobalStor,
    OrderStor,
    ProductStor,
    DesignStor,
    UserStor,
    MainServ,
    AnalyticsServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };

    //------- translate
    thisCtrl.BRAND = $filter('translate')('panels.BRAND');
    thisCtrl.COUNTRY = $filter('translate')('panels.COUNTRY');
    thisCtrl.CORROSION_COEFF = $filter('translate')('panels.CORROSION_COEFF');
    thisCtrl.BURGLAR_COEFF = $filter('translate')('panels.BURGLAR_COEFF');




    /**============ METHODS ================*/

    /**----------- Select hardware -------- */
    function selectHardware(newId) {
      if(ProductStor.product.hardware.id !== newId) {

        /** check sizes of all hardware in sashes */
        MainServ.checkHardwareSizes(ProductStor.product.template, newId);

        if(DesignStor.design.extraHardware.length){
          /** there are incorrect sashes
           * expose Alert */
          DesignStor.design.isHardwareExtra = 1;
        } else {
          //-------- set current Hardware
          MainServ.setCurrentHardware(ProductStor.product, newId);
          //------ calculate price
          MainServ.preparePrice(
            ProductStor.product.template,
            ProductStor.product.profile.id,
            ProductStor.product.glass,
            ProductStor.product.hardware.id,
            ProductStor.product.lamination.lamination_in_id
          );
          //------ save analytics data
//AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 3);
          /** send analytics data to Server*/
          AnalyticsServ.sendAnalyticsData(
            UserStor.userInfo.id,
            OrderStor.order.id,
            ProductStor.product.template_id,
            newId,
            3
          );
        }
      }
    }


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.selectHardware = selectHardware;
    thisCtrl.showInfoBox = MainServ.showInfoBox;

  });
})();
