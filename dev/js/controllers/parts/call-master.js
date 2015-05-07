(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CallMasterCtrl', callMasterCtrl);

  function callMasterCtrl($scope, $location, globalConstants, optionsServ, OrderStor, UserStor, CartStor, CartMenuServ) {

    var thisCtrl = this;
    thisCtrl.order = OrderStor.order;
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