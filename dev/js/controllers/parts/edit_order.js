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
    UserStor,
    HistoryServ,
    AddElementMenuServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;


    thisCtrl.CONFIGMENU_PROFILE = $filter('translate')('mainpage.CONFIGMENU_PROFILE');
    thisCtrl.CONFIGMENU_ALERT = $filter('translate')('mainpage.CONFIGMENU_ALERT');
    thisCtrl.CONFIGMENU_GLASS = $filter('translate')('mainpage.CONFIGMENU_GLASS');
    thisCtrl.CONFIGMENU_HARDWARE = $filter('translate')('mainpage.CONFIGMENU_HARDWARE');
    thisCtrl.CONFIGMENU_LAMINATION = $filter('translate')('mainpage.CONFIGMENU_LAMINATION');
    thisCtrl.WIDTH_LABEL = $filter('translate')('add_elements.WIDTH_LABEL');
    thisCtrl.HEIGHT_LABEL = $filter('translate')('add_elements.HEIGHT_LABEL');
     thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');


    /**============ METHODS ================*/

    function saveOrder() {
      GlobalStor.global.isEditBox = 0;
      GlobalStor.global.isBox = 0;
      HistoryStor.history.price = 0;
      var style = '';
      var type = 0;
      ProductStor.product = ProductStor.setDefaultProduct();
      OrderStor.order = OrderStor.setDefaultOrder();
      var ordersQty = HistoryStor.history.isBoxArray.products.length, ord;
      for(ord=0; ord<ordersQty; ord+=1 ) {
        var orderNum = angular.copy(HistoryStor.history.isBoxArray.products[ord].order_id);
        localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_id': orderNum});
        localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_id': orderNum});
        localDB.deleteOrderServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, orderNum);
      }
          
      var productArray = HistoryStor.history.isBoxArray.products;
      async.eachSeries(productArray,calculate, function (err, result) {
        console.log('end');
      });


      function calculate (product, _cb) {
        OrderStor.order = OrderStor.setDefaultOrder();
        ProductStor.product = ProductStor.setDefaultProduct();
          async.waterfall([
            function (_callback) {
              OrderStor.order.id = angular.copy(product.order_id);
              ProductStor.product.chosenAddElements = angular.copy(product.addElementDATA);
              ProductStor.product.order_id = angular.copy(product.order_id);
              ProductStor.product.template_source = angular.copy( JSON.parse(product.template_source));
              ProductStor.product.hardware = angular.copy(product.hardware || {});
              ProductStor.product.lamination = angular.copy(product.lamination);
              ProductStor.product.product_id = angular.copy(product.product_id);
              ProductStor.product.is_addelem_only = angular.copy(product.is_addelem_only);
              ProductStor.product.profile = angular.copy(product.profile);
              ProductStor.product.glass = angular.copy(product.glass_id);
              ProductStor.product.is_addelem_only = angular.copy(product.is_addelem_only);
              ProductStor.product.construction_type = angular.copy(product.construction_type);
              _callback(null);
            },
            function (_callback) {
              if(ProductStor.product.is_addelem_only === 0) {
                MainServ.setCurrentProfile(ProductStor.product, ProductStor.product.profile.id).then(function(result) {        
                  MainServ.saveTemplateInProductForOrder().then(function(result) {
                    var profileId = ProductStor.product.profile.id,
                        hardwareId = ProductStor.product.hardware_id,
                        laminatId = ProductStor.product.lamination.lamination_in_id,
                        glassIds =  ProductStor.product.glass;     
                    MainServ.preparePrice(ProductStor.product.template, profileId, glassIds, hardwareId, laminatId).then(function(result) {
                      _callback();    
                    });         
                  }); 
                });
              } else {
                ProductStor.product.glass = [];
                ProductStor.product.profile = {};
                ProductStor.product.hardware = {};
                ProductStor.product.lamination = {
                  id:0,
                  img_in_id:1,
                  img_out_id:1,
                  laminat_in_name:"mainpage.WHITE_LAMINATION",
                  laminat_out_name:"mainpage.WHITE_LAMINATION",
                  lamination_in_id:1,
                  lamination_out_id:1
                };
                _callback()
              }
            },            
            function (_callback) {
              AddElementMenuServ.setAddElementsTotalPrice(ProductStor.product);
              _callback();  
            },
            function (_callback) {
              MainServ.setProductPriceTOTAL(ProductStor.product);
              _callback();  
            },
            function (_callback) {
              OrderStor.order.products.push(ProductStor.product);
              _callback();  
            },
            function (_callback) {
                var orderProdQty = OrderStor.order.products.length;
                // for (var n=0; n<orderProdQty; n+=1) {
                //   HistoryStor.history.price += OrderStor.order.products[n].productPriceDis;
                // }
                style = HistoryStor.history.isBoxArray.order_style;
                type = HistoryStor.history.isBoxArray.order_type;

                MainServ.saveOrderInDB(HistoryStor.history.isBoxArray.info, type, style);
              _callback();  
            },
            function (_callback) {
              OrderStor.order = OrderStor.setDefaultOrder();
              HistoryServ.downloadOrders();
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
      //HistoryStor.history.isBoxArray = [];
      HistoryStor.history.isBoxArrayCopy = [];
      HistoryStor.history.listNameHardware = [];
      HistoryStor.history.listNameProfiles = [];
    }
    function close() {
      RecOrderServ.extend();
      GlobalStor.global.isEditBox = 0;
      GlobalStor.global.isAlertHistory = 0;
      GlobalStor.global.isBox = 0;
      HistoryStor.history.isBoxArray = [];
      HistoryStor.history.isBoxArrayCopy = [];
      HistoryStor.history.listName = [];
      HistoryStor.history.listNameHardware = [];
      HistoryStor.history.listNameProfiles = [];
    }
    function itemsForLists(product_id) {
      GlobalStor.global.continued = 0;
      RecOrderServ.nameListLaminat(product_id);
      RecOrderServ.nameListGlasses(product_id);
      // RecOrderServ.profileForAlert();
    }
    function checkProd() {
        // RecOrderServ.alert()
        if(GlobalStor.global.dangerAlert < 1) {
          RecOrderServ.extend();
          saveOrder()
        }
        GlobalStor.global.isAlertHistory = 0;
    }
    /**========== FINISH ==========*/

    //------ clicking
      thisCtrl.checkProd = checkProd;
      thisCtrl.saveOrder = saveOrder;
      thisCtrl.close = close;
      thisCtrl.extend = RecOrderServ.extend;
      thisCtrl.itemsForLists = itemsForLists;
      thisCtrl.box = RecOrderServ.box;
      // thisCtrl.profileForAlert = RecOrderServ.profileForAlert;
      thisCtrl.downloadOrders = HistoryServ.downloadOrders;
  });
})();