(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ProfilesCtrl',

  function(
    $filter,
    $q,
    globalConstants,
    MainServ,
    AnalyticsServ,
    GlobalStor,
    OrderStor,
    ProductStor,
    DesignStor,
    UserStor,
    localDB
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
      profileForAlert(newId)
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

            /** Extra Sash finding */
            if (GlobalStor.global.isSashesInTemplate) {
              /** check sizes of all hardware in sashes */
              MainServ.checkHardwareSizes(ProductStor.product.template);
            }

            /** return previous Product */
            ProductStor.product = angular.copy(productTEMP);

            if(DesignStor.design.extraGlass.length) {
              /** there are incorrect glasses
               * expose Alert */
              DesignStor.design.isGlassExtra = 1;
            } else {

              if(DesignStor.design.extraHardware.length){
                /** there are incorrect sashes
                 * expose Alert */
                DesignStor.design.isHardwareExtra = 1;
              } else {
                /** set default white lamination */
                MainServ.setCurrLamination(ProductStor.product);
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
            }
          });
        });

      }
    }
    function profileForAlert(newId) {
      GlobalStor.global.continued = 0;
      var id = 0;
      id = newId;
      GlobalStor.global.dataProfiles = [];
     var deferred = $q.defer();
       localDB.selectLocalDB(
         localDB.tablesLocalDB.beed_profile_systems.tableName, {
          'profile_system_id': newId
        }).then(function(result) {
          GlobalStor.global.dataProfiles = angular.copy(result)
          deferred.resolve(result);
        });
      return deferred.promise;
    }

    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.profileForAlert = profileForAlert;
    thisCtrl.selectProfile = selectProfile;
    thisCtrl.showInfoBox = MainServ.showInfoBox;

  });
})();
