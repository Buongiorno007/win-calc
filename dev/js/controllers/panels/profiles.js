(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('ProfilesCtrl', profileSelectorCtrl);

  function profileSelectorCtrl($filter, globalConstants, MainServ, analyticsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

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
    thisCtrl.selectProfile = selectProfile;
    thisCtrl.showInfoBox = MainServ.showInfoBox;



    //============ methods ================//

    //---------- Select profile
    function selectProfile(newId) {
      MainServ.setCurrentProfile(ProductStor.product, newId).then(function(){
        ProductStor.product.glass.length = 0;
        MainServ.parseTemplate();
      });

      //------ save analytics data
//      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, id, producerIndex);
//TODO      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.order_id, newId);
    }

  }
})();
