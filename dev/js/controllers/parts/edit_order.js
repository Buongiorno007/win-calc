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
      RecOrderServ.extendAddElem();
      RecOrderServ.extendProfile();
      RecOrderServ.extendGlass();
      RecOrderServ.extendHardware();
      RecOrderServ.extendLaminat();
      RecOrderServ.templateSource();
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord=0; ord<ordersQty; ord+=1 ) {
        var orderNum = angular.copy(HistoryStor.history.isBoxArray[ord].order_id);
        localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_id': orderNum});
        localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_id': orderNum});
        localDB.deleteOrderServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, orderNum);
      }
          
      var productArray = HistoryStor.history.isBoxArray;
      async.eachSeries(productArray,calculate, function (err, result) {
        console.log('end');
      });


      function calculate (product, _cb) {
        OrderStor.order = OrderStor.setDefaultOrder();
        ProductStor.product = ProductStor.setDefaultProduct();
          async.waterfall([
            function (_callback) {
              OrderStor.order.id = angular.copy(product.order_id);
              ProductStor.product.chosenAddElements = angular.copy(product.chosenAddElements);
              ProductStor.product.order_id = angular.copy(product.order_id);
              ProductStor.product.template_source = angular.copy(product.template_source);
              ProductStor.product.hardware_id = angular.copy(product.hardware_id);
              ProductStor.product.hardware = angular.copy(product.hardware);
              ProductStor.product.lamination = angular.copy(product.lamination);
              ProductStor.product.product_id = angular.copy(product.product_id);
              ProductStor.product.is_addelem_only = angular.copy(product.is_addelem_only);
              ProductStor.product.profile_id = angular.copy(product.profile_id);
              ProductStor.product.glass = angular.copy(product.glasses);
              _callback(null);
            },
            function (_callback) {
              if (ProductStor.product.profile_id !== "undefined") {
                MainServ.setCurrentProfile(ProductStor.product, ProductStor.product.profile_id).then(function(result) {        
                  MainServ.saveTemplateInProductForOrder().then(function(result) {
                    AddElementMenuServ.setAddElementsTotalPrice(ProductStor.product);
                    var profileId = ProductStor.product.profile_id,
                      hardwareId = ProductStor.product.hardware_id,
                      laminatId = ProductStor.product.lamination.lamination_in_id,
                      glassIds =  ProductStor.product.glass;     
                    MainServ.preparePrice(ProductStor.product.template, profileId, glassIds, hardwareId, laminatId).then(function(result) {
                      _callback();    
                    });         
                  });
                });  
              } else {
                AddElementMenuServ.setAddElementsTotalPrice(ProductStor.product);
                  ProductStor.product.template_price = 0;
                  ProductStor.product.glass = [];
                _callback();   
              }
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
                for (var n=0; n<orderProdQty; n+=1) {
                  HistoryStor.history.price += OrderStor.order.products[n].productPriceDis;
                }
                style = HistoryStor.history.information.order_style;
                type = HistoryStor.history.information.order_type;
                MainServ.saveOrderInDB(HistoryStor.history.information, type, style);
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
      HistoryStor.history.isBoxArray = [];
      HistoryStor.history.isBoxArrayCopy = [];
      HistoryStor.history.listNameHardware = [];
      HistoryStor.history.listNameProfiles = [];
    }
    function close() {
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
      RecOrderServ.profileForAlert();
    }
    function checkProd() {
      RecOrderServ.errorChecking()
      if (HistoryStor.history.errorСhecking < 1) {
        RecOrderServ.alert()
        if(GlobalStor.global.dangerAlert < 1) {
          saveOrder()
        }
        GlobalStor.global.isAlertHistory = 0;
      } else {
          $('.page-form').scrollTop(0);
          GlobalStor.global.isAlertHistory = 1;
          console.log('errrrrrrror', HistoryStor.history.errorСhecking)
        }
    }
    /**========== FINISH ==========*/

    //------ clicking
      thisCtrl.checkProd = checkProd;
      thisCtrl.saveOrder = saveOrder;
      thisCtrl.close = close;
      thisCtrl.itemsForLists = itemsForLists;
      thisCtrl.box = RecOrderServ.box;
      thisCtrl.profileForAlert = RecOrderServ.profileForAlert;
      thisCtrl.extendAddElem = RecOrderServ.extendAddElem;
      thisCtrl.errorChecking = RecOrderServ.errorChecking;
      thisCtrl.downloadOrders = HistoryServ.downloadOrders;
      thisCtrl.templateSource = RecOrderServ.templateSource;
      thisCtrl.nameListLaminat = RecOrderServ.nameListLaminat;
      thisCtrl.nameListGlasses = RecOrderServ.nameListGlasses;
      thisCtrl.extendLaminat = RecOrderServ.extendLaminat;
      thisCtrl.extendHardware = RecOrderServ.extendHardware;
      thisCtrl.extendProfile = RecOrderServ.extendProfile;
      thisCtrl.extendGlass = RecOrderServ.extendGlass;
  });
})();