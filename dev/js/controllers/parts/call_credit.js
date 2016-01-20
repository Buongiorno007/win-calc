(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .controller('CallCreditCtrl', callCreditCtrl);

  function callCreditCtrl($filter, GlobalStor, OrderStor, UserStor, CartStor, CartMenuServ) {

    var thisCtrl = this;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      month: $filter('translate')('common_words.MONTH_LABEL'),
      montha: $filter('translate')('common_words.MONTHA_LABEL'),
      months: $filter('translate')('common_words.MONTHS_LABEL')

      //DELAY_START: globalConstants.STEP,
      //typing: 'on'
    };

    /** база городов и регионов долны быть только одной страны завода */
    thisCtrl.locations = GlobalStor.locations.mergerLocation.filter(function(item) {
      return item.countryId === UserStor.userInfo.countryId;
    });

    //------ clicking
    thisCtrl.submitForm = submitForm;
    thisCtrl.changeLocation = CartMenuServ.changeLocation;
    thisCtrl.selectCity = CartMenuServ.selectCity;
    thisCtrl.closeOrderDialog = CartMenuServ.closeOrderDialog;


    //============ methods ================//


    //--------- Send Form Data
    function submitForm(form) {
      //------- Trigger validation flag.
      CartStor.cart.submitted = true;
      if(form.$valid) {
        CartMenuServ.sendOrder();
      }
    }



  }
})();