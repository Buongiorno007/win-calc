
// services/cart_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartServ', cartFactory);

  function cartFactory(CartStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      showOrderDialog: showOrderDialog,
      setDefaultUserInfoXOrder: setDefaultUserInfoXOrder,
      closeOrderDialog: closeOrderDialog
    };

    return thisFactory.publicObj;




    //============ methods ================//

    function showOrderDialog() {
      //TODO globalStor
      /*
      if($scope.global.order.isInstalment !== 'false') {
        CartStor.showCreditDialog = true;
      } else if() {
        CartStor.showOrderDialog = true;
      } else if() {
        CartStor.showMasterDialog = true;
      }
      */
    }

    //--------- this function uses into Order/Credit Dialog for create user object and set default values for select fields
    function setDefaultUserInfoXOrder() {
      return {
        sex: ''
      };
    }

    //---------- Close any Order Dialog
    function closeOrderDialog() {
      CartStor.showMasterDialog = false;
      CartStor.showOrderDialog = false;
      CartStor.showCreditDialog = false;
    }

  }
})();

