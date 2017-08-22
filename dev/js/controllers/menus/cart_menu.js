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
    AuxStor,
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
    thisCtrl.DIS_ASSEMBLING = $filter('translate')('cart.DIS_ASSEMBLING');
    thisCtrl.WITHOUT_ASSEMBLING = $filter('translate')('cart.WITHOUT_ASSEMBLING');
    thisCtrl.WITHOUT_DIS_ASSEMBLING = $filter('translate')('cart.WITHOUT_DIS_ASSEMBLING');
    thisCtrl.ADD_SERVICES = $filter('translate')('cart.ADD_SERVICES');
    thisCtrl.FREE = $filter('translate')('cart.FREE');
    thisCtrl.PAYMENT_BY_INSTALMENTS = $filter('translate')('cart.PAYMENT_BY_INSTALMENTS');
    thisCtrl.WITHOUT_INSTALMENTS = $filter('translate')('cart.WITHOUT_INSTALMENTS');
    thisCtrl.DELIVERY_DATE = $filter('translate')('cart.DELIVERY_DATE');
    thisCtrl.FIRST_PAYMENT_LABEL = $filter('translate')('cart.FIRST_PAYMENT_LABEL');
    thisCtrl.DATE_DELIVERY_LABEL = $filter('translate')('cart.DATE_DELIVERY_LABEL');
    thisCtrl.MONTHLY_PAYMENT_LABEL = $filter('translate')('cart.MONTHLY_PAYMENT_LABEL');
    thisCtrl.TOTAL_PRICE_LABEL = $filter('translate')('cart.TOTAL_PRICE_LABEL');
    thisCtrl.ORDER = $filter('translate')('cart.ORDER');
    thisCtrl.ORDER_LV = $filter('translate')('cart.ORDER_LV');
    thisCtrl.CALCULATE_PRICE = $filter('translate')('cart.CALCULATE_PRICE');
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
      // console.log(OrderStor.order.products);
      CartStor.cart.showCurrentTemp = 0;
      if(OrderStor.order.products.length) {
       // console.log("openOrderDialog");
        if (OrderStor.order.is_instalment) {
          CartStor.cart.isCreditDialog = 1;
        } else {
          CartStor.cart.isOrderDialog = 1;
            console.log("openOrderDialog");
        }
      }
    }

    // function resizable (el, factor) {
    //   var int = Number(factor);
    //   function resize() {el.style.width = ((el.value.length+1) *2* int) + 'px'}
    //   var e = 'keyup,keypress,focus,blur,change'.split(',');
    //   for (var i in e) el.addEventListener(e[i],resize,false);
    //   resize();
    // }
    // resizable(document.getElementById('disc-input'),6);
    // resizable(document.getElementById('disc-input-add'),6);


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.closeInstalment = closeInstalment;
    thisCtrl.selectFloorPrice = CartMenuServ.selectFloorPrice;
    thisCtrl.selectAssembling = CartMenuServ.selectAssembling;
    thisCtrl.selectDisAssembling = CartMenuServ.selectDisAssembling;
    thisCtrl.selectInstalment = CartMenuServ.selectInstalment;
    thisCtrl.openMasterDialog = openMasterDialog;
    thisCtrl.openOrderDialog = openOrderDialog;
    thisCtrl.swipeDiscountBlock = CartMenuServ.swipeDiscountBlock;
    thisCtrl.calculateOrderPrice = CartMenuServ.calculateOrderPrice;

  });
})();
