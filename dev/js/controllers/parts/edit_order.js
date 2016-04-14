(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .controller('EditOrderCtrl',

  function(
    $q,
    $filter,
    OrderStor,
    HistoryStor,
    CartStor,
    GlobalStor,
    ProductStor,
    RecOrderServ,
    MainServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;


    thisCtrl.CONFIGMENU_PROFILE = $filter('translate')('mainpage.CONFIGMENU_PROFILE');
    thisCtrl.CONFIGMENU_GLASS = $filter('translate')('mainpage.CONFIGMENU_GLASS');
    thisCtrl.CONFIGMENU_HARDWARE = $filter('translate')('mainpage.CONFIGMENU_HARDWARE');
    thisCtrl.CONFIGMENU_LAMINATION = $filter('translate')('mainpage.CONFIGMENU_LAMINATION');

    /**============ METHODS ================*/
    
    function okey() {
      ProductStor.product = ProductStor.setDefaultProduct();
      RecOrderServ.extendProfile();
      RecOrderServ.extendGlass();
      RecOrderServ.extendHardware();
      RecOrderServ.extendLaminat();
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
        for(ord=0; ord<ordersQty; ord+=1 ) {
          delete HistoryStor.history.isBoxArray[ord].nameHardware;
          delete HistoryStor.history.isBoxArray[ord].nameIn;
          delete HistoryStor.history.isBoxArray[ord].nameOut;
          delete HistoryStor.history.isBoxArray[ord].nameProfiles;
          delete HistoryStor.history.isBoxArray[ord].listNameGlass;
          delete HistoryStor.history.isBoxArray[ord].listNameLaminat;
        }
          RecOrderServ.templateSource();
          GlobalStor.global.isEditBox = 0;
          GlobalStor.global.isBox = 0;

      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
        for(ord=0; ord<ordersQty; ord+=1 ) {
          ProductStor.product.template_source = angular.copy(HistoryStor.history.isBoxArray[ord].template_source);
          ProductStor.product.hardware_id = angular.copy(HistoryStor.history.isBoxArray[ord].hardware_id);
          ProductStor.product.hardware = angular.copy(HistoryStor.history.isBoxArray[ord].hardware);
          ProductStor.product.lamination = angular.copy(HistoryStor.history.isBoxArray[ord].lamination);
          ProductStor.product.product_id = angular.copy(HistoryStor.history.isBoxArray[ord].product_id);
          ProductStor.product.profile_id = angular.copy(HistoryStor.history.isBoxArray[ord].profile_id);
          ProductStor.product.glass = angular.copy(HistoryStor.history.isBoxArray[ord].glasses);
      }

          pricesThrough()
          function pricesThrough() {
            console.log(' ProductStor.product ProductStor.product',  ProductStor.product)
            var defer = $q.defer();
              MainServ.setCurrentProfile(ProductStor.product, ProductStor.product.profile_id).then(function(result) {        
                MainServ.saveTemplateInProductForOrder().then(function(result) {
                  var profileId = ProductStor.product.profile_id,
                      hardwareId = ProductStor.product.hardware_id,
                      laminatId = ProductStor.product.lamination_id,
                      glassIds =  ProductStor.product.glass;      
                  MainServ.preparePrice(ProductStor.product.template, profileId, glassIds, hardwareId, laminatId).then(function(result) {
                    ProductStor.product = ProductStor.setDefaultProduct();
                    defer.resolve();         
                  });
                });
              });  
            return defer.promise;
          }
      }
    }
    function close () {
      GlobalStor.global.isEditBox = 0;
      GlobalStor.global.isBox = 0;
      HistoryStor.history.isBoxArray = [];
      HistoryStor.history.listName = [];
      HistoryStor.history.listNameHardware = [];
      HistoryStor.history.listNameProfiles = [];
    }
    function listName (product_id) {
      RecOrderServ.nameListLaminat(product_id);
      RecOrderServ.nameListGlasses(product_id);
    }

    /**========== FINISH ==========*/

    //------ clicking
      thisCtrl.box = RecOrderServ.box;
      thisCtrl.templateSource = RecOrderServ.templateSource;
      thisCtrl.nameListLaminat = RecOrderServ.nameListLaminat;
      thisCtrl.nameListGlasses = RecOrderServ.nameListGlasses;
      thisCtrl.extendLaminat = RecOrderServ.extendLaminat;
      thisCtrl.extendHardware = RecOrderServ.extendHardware;
      thisCtrl.extendProfile = RecOrderServ.extendProfile;
      thisCtrl.extendGlass = RecOrderServ.extendGlass;
      thisCtrl.okey = okey;
      thisCtrl.close = close;
      thisCtrl.listName = listName;

  });
})();