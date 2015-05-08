(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CallCreditCtrl', callCreditCtrl);

  function callCreditCtrl($filter, $location, globalConstants, localDB, GlobalStor, OrderStor, UserStor, CartStor, SettingServ, CartMenuServ) {

    var thisCtrl = this;
    //thisCtrl.global = GlobalStor.global;
    thisCtrl.order = OrderStor.order;
    thisCtrl.cartStor = CartStor;
    thisCtrl.cart = CartStor.cart;
    thisCtrl.userInfo = UserStor.userInfo;

    thisCtrl.config = {
      month: $filter('translate')('common_words.MONTH_LABEL'),
      montha: $filter('translate')('common_words.MONTHA_LABEL'),
      months: $filter('translate')('common_words.MONTHS_LABEL')

      //DELAY_START: globalConstants.STEP,
      //typing: 'on'
    };

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