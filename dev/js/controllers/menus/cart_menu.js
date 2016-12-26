(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .controller('CartMenuCtrl',

  function(
    $filter,
    globalConstants,
    GlobalStor,
    OrderStor,
    UserStor,
    CartStor,
    ProductStor,
    CartMenuServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.U = UserStor;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      activeMenuItem: false,
      month: $filter('translate')('common_words.MONTH_LABEL'),
      montha: $filter('translate')('common_words.MONTHA_LABEL'),
      months: $filter('translate')('common_words.MONTHS_LABEL'),
      //activeInstalmentSwitcher: false,
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };

    //------- translate
    thisCtrl.DELIVERY = $filter('translate')('cart.DELIVERY');
    thisCtrl.SELF_EXPORT = $filter('translate')('cart.SELF_EXPORT');
    thisCtrl.FLOOR = $filter('translate')('cart.FLOOR');
    thisCtrl.ASSEMBLING = $filter('translate')('cart.ASSEMBLING');
    thisCtrl.WITHOUT_ASSEMBLING = $filter('translate')('cart.WITHOUT_ASSEMBLING');
    thisCtrl.FREE = $filter('translate')('cart.FREE');
    thisCtrl.PAYMENT_BY_INSTALMENTS = $filter('translate')('cart.PAYMENT_BY_INSTALMENTS');
    thisCtrl.WITHOUT_INSTALMENTS = $filter('translate')('cart.WITHOUT_INSTALMENTS');
    thisCtrl.DELIVERY_DATE = $filter('translate')('cart.DELIVERY_DATE');
    thisCtrl.FIRST_PAYMENT_LABEL = $filter('translate')('cart.FIRST_PAYMENT_LABEL');
    thisCtrl.DATE_DELIVERY_LABEL = $filter('translate')('cart.DATE_DELIVERY_LABEL');
    thisCtrl.MONTHLY_PAYMENT_LABEL = $filter('translate')('cart.MONTHLY_PAYMENT_LABEL');
    thisCtrl.TOTAL_PRICE_LABEL = $filter('translate')('cart.TOTAL_PRICE_LABEL');
    thisCtrl.ORDER = $filter('translate')('cart.ORDER');
    thisCtrl.MEASURE = $filter('translate')('cart.MEASURE');
    thisCtrl.ROOM_SELECTION = $filter('translate')('mainpage.ROOM_SELECTION');
    thisCtrl.COMMENT = $filter('translate')('mainpage.COMMENT');




    /**============ METHODS ================*/

    //----- Select menu item
    function selectMenuItem(id) {
      thisCtrl.config.activeMenuItem = (thisCtrl.config.activeMenuItem === id) ? 0 : id;
    }

    function closeInstalment() {
      OrderStor.order.is_instalment = 0;
      OrderStor.order.instalment_id = 0;
      OrderStor.order.selectedInstalmentPeriod = 0;
      OrderStor.order.selectedInstalmentPercent = 0;
      thisCtrl.config.activeMenuItem = 0;
    }

    //------ show Call Master Dialog
    function openMasterDialog() {
      if(OrderStor.order.products.length) {
        CartStor.cart.isMasterDialog = 1;
      }
    }

    //------ show Order/Credit Dialog
    function openOrderDialog() {
      CartStor.cart.showCurrentTemp = 0;
      if(OrderStor.order.products.length) {
        if (OrderStor.order.is_instalment) {
          CartStor.cart.isCreditDialog = 1;
        } else {
          CartStor.cart.isOrderDialog = 1;
        }
      }
    }



    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.closeInstalment = closeInstalment;
    thisCtrl.selectFloorPrice = CartMenuServ.selectFloorPrice;
    thisCtrl.selectAssembling = CartMenuServ.selectAssembling;
    thisCtrl.selectInstalment = CartMenuServ.selectInstalment;
    thisCtrl.openMasterDialog = openMasterDialog;
    thisCtrl.openOrderDialog = openOrderDialog;
    thisCtrl.swipeDiscountBlock = CartMenuServ.swipeDiscountBlock;

  });
})();
