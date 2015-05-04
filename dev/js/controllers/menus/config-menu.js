(function(){
  'use strict';

  /**
   * @ngInject
   */

  angular
    .module('MainModule')
    .controller('ConfigMenuCtrl', glassSelectorCtrl);

  function glassSelectorCtrl(globalConstants, localDB, GlobalStor, OrderStor, ProductStor, AuxStor, UserStor, MainServ, AddElementsServ) {

    console.log('START CONFIG MENU!!!!!!');
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.order = OrderStor.order;
    thisCtrl.product = ProductStor.product;
    thisCtrl.userInfo = UserStor.userInfo;


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
    thisCtrl.inputProductInOrder = MainServ.inputProductInOrder;


    //============ methods ================//


    //------- Select menu item

    function selectConfigPanel(id) {
      //------- if panel is opened yet
      if(GlobalStor.global.activePanel === id) {
        GlobalStor.global.activePanel = 0;
      } else {
        GlobalStor.global.activePanel = id;
      }

      AuxStor.aux.isWindowSchemeDialog = false;
      AuxStor.aux.isAddElementListView = false;
      AuxStor.aux.isFocusedAddElement = false;
      AuxStor.aux.isTabFrame = false;
      AuxStor.aux.showAddElementsMenu = false;
      AddElementsServ.desactiveAddElementParameters();
    }














    //--------- moving to Cart when click on Cart button
    $scope.movetoCart = function() {
      $location.path('/cart');

      $timeout(function(){
        $scope.global.gotoCartPage();
      }, $scope.configMenu.DELAY_GO_TO_CART);
    };



  }
})();