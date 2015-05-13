
// controllers/parts/call-master.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CallMasterCtrl', callMasterCtrl);

  function callMasterCtrl(OrderStor, UserStor, CartStor, CartMenuServ, SettingServ) {

    var thisCtrl = this;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.U = UserStor;

    //------ get all regions and cities
      //TODO база городов и регионов долны быть только одной страны завода
      SettingServ.downloadLocations().then(function(data) {
          thisCtrl.locations = data;
      });


      //------ clicking
      thisCtrl.submitForm = submitForm;
      thisCtrl.changeLocation = CartMenuServ.changeLocation;
      thisCtrl.selectCity = CartMenuServ.selectCity;
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
