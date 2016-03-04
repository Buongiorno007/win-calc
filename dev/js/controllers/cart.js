(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .controller('CartCtrl',

  function(
    $filter,
    globalConstants,
    GlobalStor,
    OrderStor,
    ProductStor,
    UserStor,
    CartStor,
    CartServ,
    CartMenuServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.U = UserStor;
    thisCtrl.C = CartStor;

    thisCtrl.config = {
      currDisConstr: 0,
      isAddElementDetail: 0,
      isCartLightView: 0,
      detailProductIndex: 0,
      isShowDiscInput: 0,
      isShowDiscInputAdd: 0,
      isProductComment: 0,

      element: $filter('translate')('add_elements.ELEMENT'),
      elementa: $filter('translate')('add_elements.ELEMENTA'),
      elements: $filter('translate')('add_elements.ELEMENTS'),
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };


    //------- translate
    thisCtrl.ALL_ADD_ELEMENTS = $filter('translate')('cart.ALL_ADD_ELEMENTS');
    thisCtrl.ADD_ORDER = $filter('translate')('cart.ADD_ORDER');
    thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
    thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
    thisCtrl.MM = $filter('translate')('mainpage.MM');
    thisCtrl.CONFIGMENU_SIZING = $filter('translate')('mainpage.CONFIGMENU_SIZING');
    thisCtrl.CONFIGMENU_PROFILE = $filter('translate')('mainpage.CONFIGMENU_PROFILE');
    thisCtrl.CONFIGMENU_GLASS = $filter('translate')('mainpage.CONFIGMENU_GLASS');
    thisCtrl.CONFIGMENU_HARDWARE = $filter('translate')('mainpage.CONFIGMENU_HARDWARE');
    thisCtrl.CONFIGMENU_LAMINATION_TYPE = $filter('translate')('mainpage.CONFIGMENU_LAMINATION_TYPE');
    thisCtrl.CONFIGMENU_LAMINATION = $filter('translate')('mainpage.CONFIGMENU_LAMINATION');
    thisCtrl.CONFIGMENU_ADDITIONAL = $filter('translate')('mainpage.CONFIGMENU_ADDITIONAL');
    thisCtrl.PRODUCT_QTY = $filter('translate')('cart.PRODUCT_QTY');
    thisCtrl.ORDER_COMMENT = $filter('translate')('cart.ORDER_COMMENT');
    thisCtrl.LIGHT_VIEW = $filter('translate')('cart.LIGHT_VIEW');
    thisCtrl.DISCOUNT_SELECT = $filter('translate')('cart.DISCOUNT_SELECT');
    thisCtrl.MAX = $filter('translate')('common_words.MAX');
    thisCtrl.DISCOUNT_WINDOW = $filter('translate')('cart.DISCOUNT_WINDOW');
    thisCtrl.DISCOUNT_ADDELEM = $filter('translate')('cart.DISCOUNT_ADDELEM');
    thisCtrl.DISCOUNT = $filter('translate')('cart.DISCOUNT');
    thisCtrl.DISCOUNT_WITHOUT = $filter('translate')('cart.DISCOUNT_WITHOUT');
    thisCtrl.DISCOUNT_WITH = $filter('translate')('cart.DISCOUNT_WITH');
    thisCtrl.FULL_VIEW = $filter('translate')('cart.FULL_VIEW');
    thisCtrl.ADDELEMENTS_EDIT_LIST = $filter('translate')('cart.ADDELEMENTS_EDIT_LIST');
    thisCtrl.WIDTH_LABEL = $filter('translate')('add_elements.WIDTH_LABEL');
    thisCtrl.HEIGHT_LABEL = $filter('translate')('add_elements.HEIGHT_LABEL');
    thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');
    thisCtrl.ADDELEMENTS_PRODUCT_COST = $filter('translate')('cart.ADDELEMENTS_PRODUCT_COST');
    thisCtrl.GRID = $filter('translate')('add_elements.GRID');
    thisCtrl.VISOR = $filter('translate')('add_elements.VISOR');
    thisCtrl.SPILLWAY = $filter('translate')('add_elements.SPILLWAY');
    thisCtrl.OUTSIDE = $filter('translate')('add_elements.OUTSIDE');
    thisCtrl.LOUVERS = $filter('translate')('add_elements.LOUVERS');
    thisCtrl.INSIDE = $filter('translate')('add_elements.INSIDE');
    thisCtrl.CONNECTORS = $filter('translate')('add_elements.CONNECTORS');
    thisCtrl.FAN = $filter('translate')('add_elements.FAN');
    thisCtrl.WINDOWSILL = $filter('translate')('add_elements.WINDOWSILL');
    thisCtrl.HANDLEL = $filter('translate')('add_elements.HANDLEL');
    thisCtrl.OTHERS = $filter('translate')('add_elements.OTHERS');
    //---- add elements pannel
    thisCtrl.NAME_LABEL = $filter('translate')('add_elements.NAME_LABEL');
    thisCtrl.TOTAL_PRICE_TXT = $filter('translate')('add_elements.TOTAL_PRICE_TXT');
    thisCtrl.LINK_BETWEEN_COUPLE = $filter('translate')('cart.LINK_BETWEEN_COUPLE');
    thisCtrl.LINK_BETWEEN_ALL = $filter('translate')('cart.LINK_BETWEEN_ALL');

    //------- set current Page
    GlobalStor.global.currOpenPage = 'cart';
    GlobalStor.global.productEditNumber = 0;
    //------- collect all AddElements of Order
    CartMenuServ.joinAllAddElements();
    //----------- start order price total calculation
    CartMenuServ.calculateOrderPrice();

    //console.log('cart +++++', JSON.stringify(OrderStor.order));

    //-------- return from Main Page
    if(GlobalStor.global.prevOpenPage === 'main') {
      //----- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
    }
    //------- set customer data per order dialogs
    if(!GlobalStor.global.orderEditNumber) {
      CartStor.cart.customer.customer_location = OrderStor.order.customer_location;
    }





    /**============ METHODS ================*/


    //============= AddElements detail block
    //------- Show AddElements detail block for product
    function showAddElementDetail(productIndex) {
      if(CartStor.cart.allAddElements[productIndex].length > 0) {
        //playSound('switching');
        thisCtrl.config.detailProductIndex = productIndex;
        thisCtrl.config.isAddElementDetail = true;
      }
    }

    //--------- Close AddElements detail block
    function closeAddElementDetail() {
      thisCtrl.config.isAddElementDetail = false;
    }

    //--------- Full/Light View switcher
    function viewSwitching() {
      //playSound('swip');
      thisCtrl.config.isCartLightView = !thisCtrl.config.isCartLightView;
    }


    function switchProductComment(index) {
      var commId = index+1;
      thisCtrl.config.isProductComment = (thisCtrl.config.isProductComment === commId) ? 0 : commId;
    }



    function openDiscInput(type) {
      //------- discount x add element
      if(type) {
        thisCtrl.config.isShowDiscInput = 0;
        thisCtrl.config.isShowDiscInputAdd = 1;
      } else {
        //------- discount x construction
        thisCtrl.config.isShowDiscInput = 1;
        thisCtrl.config.isShowDiscInputAdd = 0;
      }
    }


    function pressEnterInDisc(keyEvent) {
      //--------- Enter
      if (keyEvent.which === 13) {
        CartMenuServ.closeDiscountBlock();
      }
    }



    /**========== FINISH ==========*/

      //------ clicking
    thisCtrl.decreaseProductQty = CartServ.decreaseProductQty;
    thisCtrl.increaseProductQty = CartServ.increaseProductQty;
    thisCtrl.addNewProductInOrder = CartServ.addNewProductInOrder;
    thisCtrl.clickDeleteProduct = CartServ.clickDeleteProduct;
    thisCtrl.editProduct = CartServ.editProduct;
    thisCtrl.showAddElementDetail = showAddElementDetail;
    thisCtrl.closeAddElementDetail = closeAddElementDetail;
    thisCtrl.viewSwitching = viewSwitching;
    thisCtrl.switchProductComment = switchProductComment;

    thisCtrl.showAllAddElements = CartServ.showAllAddElements;

    thisCtrl.openDiscountBlock = CartMenuServ.openDiscountBlock;
    thisCtrl.closeDiscountBlock = CartMenuServ.closeDiscountBlock;
    thisCtrl.approveNewDisc = CartMenuServ.approveNewDisc;
    thisCtrl.openDiscInput = openDiscInput;
    thisCtrl.pressEnterInDisc = pressEnterInDisc;
  });
})();