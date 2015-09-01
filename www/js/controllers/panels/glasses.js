
// controllers/panels/glasses.js

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


    //============ methods ================//

    //------- Select glass
    function selectGlass(newId) {
      //------- set currenct Glass
      MainServ.setCurrentGlass(newId);
      //------ calculate price
      MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, newId, ProductStor.product.hardware.id);
      //------ save analytics data
//      analyticsServ.saveGlassAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, newId, typeIndex);
      analyticsServ.saveGlassAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, newId);
    }

  }
})();

