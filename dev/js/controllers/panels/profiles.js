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
    DesignStor,
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
      var productTEMP;
      if(ProductStor.product.profile.id !== newId) {

        /** save previous Product */
        productTEMP = angular.copy(ProductStor.product);

        /** check new Profile */
        MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
          //------- set current template for product
          MainServ.saveTemplateInProduct(ProductStor.product.template_id).then(function() {

            /** Extra Glass finding */
            MainServ.checkGlassSizes(ProductStor.product.template);

            /** return previous Product */
            ProductStor.product = angular.copy(productTEMP);

            if(DesignStor.design.extraGlass.length) {
              /** there are incorrect glasses
               * expose Alert */
              DesignStor.design.isGlassExtra = 1;
            } else {
              /** set default white lamination */
              MainServ.setCurrLamination();
              /** set new Profile */
              MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
                MainServ.parseTemplate().then(function () {
                  /** change lamination groups as of new profile */
                  MainServ.laminatFiltering();
                  /** send analytics data to Server*/
                  AnalyticsServ.sendAnalyticsData(
                    UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 1
                  );
                });
              });
            }

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
