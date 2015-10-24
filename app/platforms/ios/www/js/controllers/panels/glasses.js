(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('GlassesCtrl', glassSelectorCtrl);

  function glassSelectorCtrl($filter, globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, MainServ, analyticsServ) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      camera: $filter('translate')('panels.CAMERa'),
      camer: $filter('translate')('panels.CAMER'),
      camers: $filter('translate')('panels.CAMERs'),
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };


    //------ clicking
    thisCtrl.selectGlass = selectGlass;
    thisCtrl.showInfoBox = MainServ.showInfoBox;


    //============ methods ================//

    //------- Select glass
    function selectGlass(newId) {
      //----- open glass selector dialog
      GlobalStor.global.showGlassSelectorDialog = 1;
      var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
      //------- set currenct Glass
      MainServ.setCurrentGlass(ProductStor.product, newId);
      //------ calculate price
      MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass[0].id, hardwareIds);//TODO array!!
      //------ save analytics data
//      analyticsServ.saveGlassAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, newId, typeIndex);
      //TODO analyticsServ.saveGlassAnalyticDB(UserStor.userInfo.id, OrderStor.order.order_id, newId);
    }

  }
})();
