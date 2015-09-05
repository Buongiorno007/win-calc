
// controllers/menus/cart_menu.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CartMenuCtrl', cartMenuCtrl);

  function cartMenuCtrl($filter, globalConstants, OrderStor, UserStor, CartStor, CartMenuServ, optionsServ) {

    var thisCtrl = this;
    thisCtrl.U = UserStor;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;

    thisCtrl.config = {
      activeMenuItem: false,
      floorData: [],
      assemblingData: [],
      instalmentsData: [],
      month: $filter('translate')('common_words.MONTH_LABEL'),
      montha: $filter('translate')('common_words.MONTHA_LABEL'),
      months: $filter('translate')('common_words.MONTHS_LABEL'),
      //activeInstalmentSwitcher: false,
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };


    //----------- download Cart Menu Data

    optionsServ.getFloorPrice(function (results) {
      if (results.status) {
        thisCtrl.config.floorData = angular.copy(results.data.floors);
      } else {
        console.log(results);
      }
    });

    optionsServ.getAssemblingPrice(function (results) {
      if (results.status) {
        thisCtrl.config.assemblingData = angular.copy(results.data.assembling);
      } else {
        console.log(results);
      }
    });

    optionsServ.getInstalment(function (results) {
      if (results.status) {
        thisCtrl.config.instalmentsData = results.data.instalment;
      } else {
        console.log(results);
      }
    });



    //------ clicking
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.closeInstalment = closeInstalment;
    thisCtrl.selectFloorPrice = CartMenuServ.selectFloorPrice;
    thisCtrl.selectAssembling = CartMenuServ.selectAssembling;
    thisCtrl.selectInstalment = CartMenuServ.selectInstalment;
    thisCtrl.openMasterDialog = openMasterDialog;
    thisCtrl.openOrderDialog = openOrderDialog;






    //============ methods ================//

    //----- Select menu item
    function selectMenuItem(id) {
      thisCtrl.config.activeMenuItem = (thisCtrl.config.activeMenuItem === id) ? false : id;
    }

    function closeInstalment() {
      OrderStor.order.is_instalment = 0;
      OrderStor.order.selectedInstalmentPeriod = 0;
      OrderStor.order.selectedInstalmentPercent = 0;
      thisCtrl.config.activeMenuItem = false;
    }

    //------ show Call Master Dialog
    function openMasterDialog() {
      CartStor.cart.isMasterDialog = true;
    }

    //------ show Order/Credit Dialog
    function openOrderDialog() {
      if(OrderStor.order.is_instalment) {
        CartStor.cart.isCreditDialog = true;
      } else {
        CartStor.cart.isOrderDialog = true;
      }
    }


  }
})();
