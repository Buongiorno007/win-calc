
// controllers/menus/config_menu.js

(function(){
  'use strict';

  /**
   * @ngInject
   */

  angular
    .module('MainModule')
    .controller('ConfigMenuCtrl', glassSelectorCtrl);

  function glassSelectorCtrl($filter, globalConstants, GlobalStor, OrderStor, ProductStor, AuxStor, UserStor, MainServ, AddElementsServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;


    thisCtrl.config = {
      TOOLTIP: [
        '',
        $filter('translate')('mainpage.TEMPLATE_TIP'),
        $filter('translate')('mainpage.PROFILE_TIP'),
        $filter('translate')('mainpage.GLASS_TIP')
      ],
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_CONFIG_LIST: 5 * globalConstants.STEP,
      DELAY_SHOW_FOOTER: 5 * globalConstants.STEP,
      DELAY_TYPE_ITEM_TITLE: 10 * globalConstants.STEP,
      DELAY_SHOW_U_COEFF: 20 * globalConstants.STEP,
      DELAY_GO_TO_CART: 2 * globalConstants.STEP,
      typing: 'on'
    };

    GlobalStor.global.isOpenedCartPage = 0;
    GlobalStor.global.isOpenedHistoryPage = 0;

    //------ clicking
    thisCtrl.selectConfigPanel = selectConfigPanel;
    thisCtrl.inputProductInOrder = saveProduct;
    thisCtrl.showNextTip = showNextTip;
    thisCtrl.showReport = showReport;


    //============ methods ================//


    //------- Select menu item

    function selectConfigPanel(id) {
      GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
      GlobalStor.global.configMenuTips = 0;
      MainServ.setDefaultAuxParam();
      AddElementsServ.desactiveAddElementParameters();
    }

    function saveProduct() {
      MainServ.inputProductInOrder().then(function() {
        //--------- moving to Cart when click on Cart button
        MainServ.goToCart();
      });
    }

    function showNextTip() {
      var tipQty = thisCtrl.config.TOOLTIP.length;
      ++GlobalStor.global.configMenuTips;
      if(GlobalStor.global.configMenuTips === tipQty) {
        GlobalStor.global.configMenuTips = 0;
      }
    }

    function showReport() {
      GlobalStor.global.isReport = !GlobalStor.global.isReport;
    }

  }
})();
