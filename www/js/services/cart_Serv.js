
// services/cart_Serv.js

(function(){
  'use strict';

  angular
    .module('CartModule')
    .factory('CartServ', cartFactory);

  cartFactory.$inject = ['CartStor'];

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
        sex: '',
        age: CartStor.optionAge[0],
        education: CartStor.optionEductaion[0],
        occupation: CartStor.optionOccupation[0],
        infoSource: CartStor.optionInfo[0]
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

