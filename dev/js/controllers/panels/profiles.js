(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ProfilesCtrl',

  function(
    $filter,
    globalConstants,
    MainServ,
    AnalyticsServ,
    GlobalStor,
    OrderStor,
    ProductStor,
    UserStor
  ) {
    /*jshint validthis:true */
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

    //------- translate
    thisCtrl.COUNTRY = $filter('translate')('panels.COUNTRY');
    thisCtrl.HEAT_INSULATION = $filter('translate')('panels.HEAT_INSULATION');
    thisCtrl.NOICE_INSULATION = $filter('translate')('panels.NOICE_INSULATION');





    /**============ METHODS ================*/

    //---------- Select profile
    function selectProfile(newId) {
      if(ProductStor.product.profile.id !== newId) {
        /** set default white lamination */
        MainServ.setCurrLamination();
        MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
          ProductStor.product.glass.length = 0;
          MainServ.parseTemplate().then(function () {
            //------ save analytics data
//            AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 1);
            /** change lamination groups as of new profile */
            MainServ.laminatFiltering();
            /** send analytics data to Server*/
            AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 1);
          });
        });
      }
    }


    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.selectProfile = selectProfile;
    thisCtrl.showInfoBox = MainServ.showInfoBox;

  });
})();
