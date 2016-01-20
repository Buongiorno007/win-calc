(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .controller('CartMenuCtrl', cartMenuCtrl);

  function cartMenuCtrl($filter, globalConstants, GlobalStor, OrderStor, UserStor, CartStor, CartMenuServ) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.U = UserStor;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;

    thisCtrl.config = {
      activeMenuItem: false,
      month: $filter('translate')('common_words.MONTH_LABEL'),
      montha: $filter('translate')('common_words.MONTHA_LABEL'),
      months: $filter('translate')('common_words.MONTHS_LABEL'),
      //activeInstalmentSwitcher: false,
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };


    //------ clicking
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.closeInstalment = closeInstalment;
    thisCtrl.selectFloorPrice = CartMenuServ.selectFloorPrice;
    thisCtrl.selectAssembling = CartMenuServ.selectAssembling;
    thisCtrl.selectInstalment = CartMenuServ.selectInstalment;
    thisCtrl.openMasterDialog = openMasterDialog;
    thisCtrl.openOrderDialog = openOrderDialog;
    thisCtrl.swipeDiscountBlock = CartMenuServ.swipeDiscountBlock;





    //============ methods ================//

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
      CartStor.cart.isMasterDialog = 1;
    }

    //------ show Order/Credit Dialog
    function openOrderDialog() {
      if(OrderStor.order.is_instalment) {
        CartStor.cart.isCreditDialog = 1;
      } else {
        CartStor.cart.isOrderDialog = 1;
      }
    }


  }
})();