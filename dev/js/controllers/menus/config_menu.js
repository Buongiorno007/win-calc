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
      TOOLTIP: $filter('translate')('mainpage.TEMPLATE_TIP'),
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


    //============ methods ================//


    //------- Select menu item

    function selectConfigPanel(id) {
      GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
      GlobalStor.global.isConfigMenuTips = 0;
      AuxStor.aux.isWindowSchemeDialog = 0;
      AuxStor.aux.isAddElementListView = 0;
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AddElementsServ.desactiveAddElementParameters();
    }

    function saveProduct() {
      MainServ.inputProductInOrder().then(function() {
        //--------- moving to Cart when click on Cart button
        MainServ.goToCart();
      });
    }

    function showTooltip() {
      thisCtrl.config.TOOLTIP = $filter('translate')('mainpage.PROFILE_TIP');
      thisCtrl.config.TOOLTIP = $filter('translate')('mainpage.GLASS_TIP');


    }

    function closeTooltip() {

    }

  }
})();