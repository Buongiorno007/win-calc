(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('ProfilesCtrl', profileSelectorCtrl);

  function profileSelectorCtrl(globalConstants, MainServ, analyticsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

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
    thisCtrl.selectProfile = selectProfile;



    //============ methods ================//

    //---------- Select profile
    function selectProfile(producerIndex, profileIndex) {
      ProductStor.product.profileTypeIndex = producerIndex;
      ProductStor.product.profileIndex = profileIndex;

      MainServ.setCurrentProfile().then(function(){
        MainServ.parseTemplate();
      });

      //------ save analytics data
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, ProductStor.product.profileId, producerIndex);
    }

  }
})();
