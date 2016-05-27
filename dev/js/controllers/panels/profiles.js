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
      GlobalStor.global.continued = 0
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
    function alert() {
      var  deferred = $q.defer();
      GlobalStor.global.nameAddElem = [];
      var name = '';
      var product = 0;
      var tr = '';
        for(var u=0; u<ProductStor.product.chosenAddElements.length; u+=1) {
          for(var f=0; f<ProductStor.product.chosenAddElements[u].length; f+=1) {
          var obj = {
            name : '',
            product : 0,
            tr: ''
          };
            for (var y = 0; y<GlobalStor.global.dataProfiles.length; y+=1) {
              if (ProductStor.product.chosenAddElements[u][f].id === GlobalStor.global.dataProfiles[y].list_id) {
                obj.tr = ProductStor.product.chosenAddElements[u][f].name;
              } else {
                obj.name = ProductStor.product.chosenAddElements[u][f].name;
              }    
            }
              GlobalStor.global.nameAddElem.push(obj)
          }
        }
        for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
          if(GlobalStor.global.nameAddElem[d].name === GlobalStor.global.nameAddElem[d].tr) {
            delete GlobalStor.global.nameAddElem[d].name;
          }
        }
        for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
          if(GlobalStor.global.nameAddElem[d].name !== undefined && GlobalStor.global.continued === 0) {
            GlobalStor.global.dangerAlert = 1;
          }
        }
        return deferred.promise;
    }
    function checkForAddElem(newId) {
      var  deferred = $q.defer();
      profileForAlert(newId).then(function() {
        alert().then(function() {
        });
        if(GlobalStor.global.dangerAlert < 1 || GlobalStor.global.continued === 1) {
          selectProfile(newId);
        }
      });
    }




    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.alert = alert;
    thisCtrl.checkForAddElem = checkForAddElem;
    thisCtrl.profileForAlert = profileForAlert;
    thisCtrl.selectProfile = selectProfile;
    thisCtrl.showInfoBox = MainServ.showInfoBox;

  });
})();
