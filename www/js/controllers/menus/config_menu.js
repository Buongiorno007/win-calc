
// controllers/menus/config_menu.js

(function(){
  'use strict';

  /**
   * @ngInject
   */

  angular
    .module('MainModule')
    .controller('ConfigMenuCtrl', glassSelectorCtrl);

  function glassSelectorCtrl(globalConstants, GlobalStor, OrderStor, ProductStor, AuxStor, UserStor, MainServ, AddElementsServ) {

    console.log('START CONFIG MENU!!!!!!');
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;


    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_CONFIG_LIST: 5 * globalConstants.STEP,
      DELAY_SHOW_FOOTER: 5 * globalConstants.STEP,
      DELAY_TYPE_ITEM_TITLE: 10 * globalConstants.STEP,
      DELAY_SHOW_U_COEFF: 20 * globalConstants.STEP,
      DELAY_GO_TO_CART: 2 * globalConstants.STEP,
      typing: 'on'
    };

    GlobalStor.global.isOpenedCartPage = false;
    GlobalStor.global.isOpenedHistoryPage = false;

    //------ clicking
    thisCtrl.selectConfigPanel = selectConfigPanel;
    thisCtrl.inputProductInOrder = saveProduct;


    //============ methods ================//


    //------- Select menu item

    function selectConfigPanel(id) {
      GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;

      AuxStor.aux.isWindowSchemeDialog = false;
      AuxStor.aux.isAddElementListView = false;
      AuxStor.aux.isFocusedAddElement = false;
      AuxStor.aux.isTabFrame = false;
      AuxStor.aux.showAddElementsMenu = false;
      AddElementsServ.desactiveAddElementParameters();
    }

    function saveProduct() {
      MainServ.inputProductInOrder().then(function() {
        //--------- moving to Cart when click on Cart button
        MainServ.goToCart();
      });
    }

  }
})();
