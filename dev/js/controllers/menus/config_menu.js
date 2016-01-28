(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ConfigMenuCtrl', configMenuCtrl);

  function configMenuCtrl($filter, globalConstants, GeneralServ, MainServ, AddElementMenuServ, DesignServ, GlobalStor, OrderStor, ProductStor, UserStor) {

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


    //============ methods ================//


    //------- Select menu item

    function selectConfigPanel(id) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
      GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
      //---- hide rooms if opened
      GlobalStor.global.showRoomSelectorDialog = 0;
      //---- hide tips
      GlobalStor.global.configMenuTips = 0;
      //---- hide comment if opened
      GlobalStor.global.isShowCommentBlock = 0;
      //---- hide template type menu if opened
      GlobalStor.global.isTemplateTypeMenu = 0;
      GeneralServ.stopStartProg();
      MainServ.setDefaultAuxParam();
      //------ delete events on Glass/Grid Selector Dialogs
      DesignServ.removeGlassEventsInSVG();
      GlobalStor.global.showGlassSelectorDialog = 0;
    }

    function saveProduct() {
      if(MainServ.inputProductInOrder()){
        //--------- moving to Cart when click on Cart button
        MainServ.goToCart();
      }
    }

    function showNextTip() {
      var tipQty = thisCtrl.config.TOOLTIP.length;
      ++GlobalStor.global.configMenuTips;
      if(GlobalStor.global.configMenuTips === tipQty) {
        GlobalStor.global.configMenuTips = 0;
        //------ open templates
        GlobalStor.global.activePanel = 1;
        //------ close rooms
        GlobalStor.global.showRoomSelectorDialog = 0;
      }
    }


  }
})();