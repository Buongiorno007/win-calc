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
    MainServ,
    localDB,
    UserStor
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
      GlobalStor.global.isEditBox = 0;
      GlobalStor.global.isBox = 0;
      ProductStor.product = ProductStor.setDefaultProduct();
      OrderStor.order = OrderStor.setDefaultOrder();
      RecOrderServ.extendProfile();
      RecOrderServ.extendGlass();
      RecOrderServ.extendHardware();
      RecOrderServ.extendLaminat();
      RecOrderServ.templateSource();
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord=0; ord<ordersQty; ord+=1 ) {
        var orderNum = angular.copy(HistoryStor.history.isBoxArray[ord].order_id);
            localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_id': orderNum});
            localDB.deleteOrderServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, orderNum) 
      }
          
      var productArray = HistoryStor.history.isBoxArray;
      async.eachSeries(productArray, calculate, function (err, result) {
        console.log('end')
      });

      function calculate (product, _cb) {
        ProductStor.product = ProductStor.setDefaultProduct();
          async.waterfall([
            function (_callback) {
              ProductStor.product.order_id = angular.copy(product.order_id);
              ProductStor.product.template_source = angular.copy(product.template_source);
              ProductStor.product.hardware_id = angular.copy(product.hardware_id);
              ProductStor.product.hardware.id = angular.copy(product.hardware);
              ProductStor.product.lamination = angular.copy(product.lamination);
              ProductStor.product.product_id = angular.copy(product.product_id);
              ProductStor.product.profile_id = angular.copy(product.profile_id);
              ProductStor.product.glass = angular.copy(product.glasses);
              _callback(null);
            },
            function (_callback) {
              MainServ.setCurrentProfile(ProductStor.product, ProductStor.product.profile_id).then(function(result) {        
                MainServ.saveTemplateInProductForOrder().then(function(result) {
                  var profileId = ProductStor.product.profile_id,
                      hardwareId = ProductStor.product.hardware_id,
                      laminatId = ProductStor.product.lamination_id,
                      glassIds =  ProductStor.product.glass;      
                  MainServ.preparePrice(ProductStor.product.template, profileId, glassIds, hardwareId, laminatId).then(function(result) {
                    _callback();               
                  });
                });
              });  
            },
            function (_callback) {
              // localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.order_products.tableName, ProductStor.product);
              // localDB.insertRowLocalDB(ProductStor.product, localDB.tablesLocalDB.order_products.tableName);
              OrderStor.order.products.push(ProductStor.product)
              _callback();  
            },
            function (_callback) {
              MainServ.saveOrderInDBnew();
              _callback();  
            }
          ], function (err, result) {
            if (err) {
              //console.log('err', err)
              return _cb(err);
            }
              //console.log('herereer')
          _cb(null);
        });
      }
      HistoryStor.history.listName = [];
      HistoryStor.history.isBoxArray = [];
      HistoryStor.history.isBoxArrayCopy = [];
      HistoryStor.history.listNameHardware = [];
      HistoryStor.history.listNameProfiles = [];
    }
    function close () {
      GlobalStor.global.isEditBox = 0;
      GlobalStor.global.isBox = 0;
      HistoryStor.history.isBoxArray = [];
      HistoryStor.history.isBoxArrayCopy = [];
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