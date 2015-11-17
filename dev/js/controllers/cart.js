(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CartCtrl', cartPageCtrl);

  function cartPageCtrl($filter, globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, CartStor, CartServ, CartMenuServ) {

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

    //------- set current Page
    GlobalStor.global.currOpenPage = 'cart';
    GlobalStor.global.productEditNumber = 0;
    //------- collect all AddElements of Order
    CartServ.joinAllAddElements();
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

    thisCtrl.swipeDiscountBlock = CartMenuServ.swipeDiscountBlock;
    thisCtrl.openDiscInput = openDiscInput;
    thisCtrl.setNewDiscont = setNewDiscont;
    thisCtrl.approveNewDisc = approveNewDisc;



    //============ methods ================//


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


    function setNewDiscont(type) {
      //------- discount x add element
      if(type) {
        if(!CartStor.cart.tempAddelemDisc) {
          CartStor.cart.tempAddelemDisc = UserStor.userInfo.discountAddElemMax*1;
        }
      //------- discount x construction
      } else {
        if(!CartStor.cart.tempConstructDisc) {
          CartStor.cart.tempConstructDisc = UserStor.userInfo.discountConstrMax*1;
        }
      }
    }


    function approveNewDisc(type) {
      if(type) {
        //------- discount x add element
        OrderStor.order.discount_addelem = CartStor.cart.tempAddelemDisc*1;
        CartMenuServ.changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);

      } else {
        //------- discount x construction
        OrderStor.order.discount_construct = CartStor.cart.tempConstructDisc*1;
        CartMenuServ.changeProductPriceAsDiscount(OrderStor.order.discount_construct);
      }
      //----------- start order price total calculation
      CartMenuServ.calculateOrderPrice();
    }

  }
})();