
// controllers/parts/call-order.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CallOrderCtrl', callOrderCtrl);

  function callOrderCtrl(globalConstants, optionsServ, localDB, OrderStor, UserStor, CartStor, CartMenuServ) {

    var thisCtrl = this;
    //thisCtrl.global = GlobalStor.global;
    thisCtrl.order = OrderStor.order;
    thisCtrl.cartStor = CartStor;
    thisCtrl.cart = CartStor.cart;
    thisCtrl.userInfo = UserStor.userInfo;


    //------ clicking
    thisCtrl.submitForm = submitForm;
    thisCtrl.closeOrderDialog = CartMenuServ.closeOrderDialog;


    //============ methods ================//

    //------- Send Form Data
    function submitForm(form) {
      //------- Trigger validation flag.
      CartStor.cart.submitted = true;
      if(form.$valid) {
        CartMenuServ.sendOrder();
      }
    }


  }
})();
