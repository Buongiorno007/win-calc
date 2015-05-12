(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('GlassesCtrl', glassSelectorCtrl);

  function glassSelectorCtrl(globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, MainServ, analyticsServ) {

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
    thisCtrl.selectGlass = selectGlass;


    //============ methods ================//

    //------- Select glass
    function selectGlass(typeIndex, glassIndex, glassId) {
      ProductStor.product.glassTypeIndex = typeIndex;
      ProductStor.product.glassIndex = glassIndex;
      //------- set currenct Glass
      MainServ.setCurrentGlass();
      //------ calculate price
      MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profileId, glassId, ProductStor.product.hardwareId);
      //------ save analytics data
      analyticsServ.saveGlassAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, glassId, typeIndex);
    }

  }
})();
