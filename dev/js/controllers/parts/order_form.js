(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .controller('OrderFormCtrl',

  function(
    $filter,
    globalConstants,
    GlobalStor,
    OrderStor,
    UserStor,
    CartStor,
    CartMenuServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.U = UserStor;
    thisCtrl.globalConstants = globalConstants;

    thisCtrl.config = {
      month: $filter('translate')('common_words.MONTH_LABEL'),
      montha: $filter('translate')('common_words.MONTHA_LABEL'),
      months: $filter('translate')('common_words.MONTHS_LABEL')
    };


    //------- translate
    thisCtrl.CALL_ORDER = $filter('translate')('cart.CALL_ORDER');
    thisCtrl.CALL_ORDER_DESCRIP = $filter('translate')('cart.CALL_ORDER_DESCRIP');
    thisCtrl.CALL_ORDER_CLIENT_INFO = $filter('translate')('cart.CALL_ORDER_CLIENT_INFO');
    thisCtrl.CALL_ORDER_CLIENT_INFO_light = $filter('translate')('cart.CALL_ORDER_CLIENT_INFO_light');
    thisCtrl.CLIENT_NAME = $filter('translate')('cart.CLIENT_NAME');
    thisCtrl.EMPTY_FIELD = $filter('translate')('login.EMPTY_FIELD');
    thisCtrl.MOBILE = $filter('translate')('login.MOBILE');
    thisCtrl.WRONG_NUMBER = $filter('translate')('login.WRONG_NUMBER');
    thisCtrl.CALL_ORDER_DELIVERY = $filter('translate')('cart.CALL_ORDER_DELIVERY');
    thisCtrl.CLIENT_LOCATION = $filter('translate')('cart.CLIENT_LOCATION');
    thisCtrl.CLIENT_ADDRESS = $filter('translate')('cart.CLIENT_ADDRESS');
    thisCtrl.CLIENT_HOUSE = $filter('translate')('cart.CLIENT_HOUSE');
    thisCtrl.CLIENT_FLAT = $filter('translate')('cart.CLIENT_FLAT');
    thisCtrl.CLIENT_FLOOR = $filter('translate')('cart.CLIENT_FLOOR');
    thisCtrl.CALL_ORDER_TOTAL_PRICE = $filter('translate')('cart.CALL_ORDER_TOTAL_PRICE');
    thisCtrl.CALL_ORDER_ADD_INFO = $filter('translate')('cart.CALL_ORDER_ADD_INFO');
    thisCtrl.CLIENT_EMAIL_ORDER = $filter('translate')('cart.CLIENT_EMAIL_ORDER');
    thisCtrl.WRONG_EMAIL = $filter('translate')('cart.WRONG_EMAIL');
    thisCtrl.ADD_PHONE = $filter('translate')('cart.ADD_PHONE');
    thisCtrl.CLIENT_SEX = $filter('translate')('cart.CLIENT_SEX');
    thisCtrl.CLIENT_SEX_M = $filter('translate')('cart.CLIENT_SEX_M');
    thisCtrl.CLIENT_SEX_F = $filter('translate')('cart.CLIENT_SEX_F');
    thisCtrl.CLIENT_AGE = $filter('translate')('cart.CLIENT_AGE');
    thisCtrl.EMPTY_FIELD_LOCATION = $filter('translate')('login.EMPTY_FIELD_LOCATION');
    thisCtrl.SELECT_PLACEHOLD = $filter('translate')('cart.SELECT_PLACEHOLD');
    thisCtrl.CLIENT_EDUCATION = $filter('translate')('cart.CLIENT_EDUCATION');
    thisCtrl.CLIENT_OCCUPATION = $filter('translate')('cart.CLIENT_OCCUPATION');
    thisCtrl.CLIENT_INFO_SOURCE = $filter('translate')('cart.CLIENT_INFO_SOURCE');
    thisCtrl.READY = $filter('translate')('cart.READY');
    thisCtrl.CALL_MASTER = $filter('translate')('cart.CALL_MASTER');
    thisCtrl.CALL_MASTER_DESCRIP = $filter('translate')('cart.CALL_MASTER_DESCRIP');
    thisCtrl.CALL_CREDIT = $filter('translate')('cart.CALL_CREDIT');
    thisCtrl.CALL_CREDIT_DESCRIP = $filter('translate')('cart.CALL_CREDIT_DESCRIP');
    thisCtrl.CALL_CREDIT_CLIENT_INFO = $filter('translate')('cart.CALL_CREDIT_CLIENT_INFO');
    thisCtrl.CREDIT_TARGET = $filter('translate')('cart.CREDIT_TARGET');
    thisCtrl.CLIENT_ITN = $filter('translate')('cart.CLIENT_ITN');
    thisCtrl.CALL_START_TIME = $filter('translate')('cart.CALL_START_TIME');
    thisCtrl.CALL_END_TIME = $filter('translate')('cart.CALL_END_TIME');
    thisCtrl.CALL_CREDIT_PARTIAL_PRICE = $filter('translate')('cart.CALL_CREDIT_PARTIAL_PRICE');

    thisCtrl.BACK = $filter('translate')('common_words.BACK');
    thisCtrl.CALL_ORDER_CLIENT_INFO_SHORT = $filter('translate')('cart.CALL_ORDER_CLIENT_INFO_SHORT');
    thisCtrl.CALL_ORDER_CLIENT_INFO_SHORT_1 = $filter('translate')('cart.CALL_ORDER_CLIENT_INFO_SHORT_1');


    //SettingServ.downloadLocations().then(function(data) {
    //    thisCtrl.locations = data;
    //});
    /** база городов и регионов долны быть только одной страны завода */
    // thisCtrl.locations = GlobalStor.global.locations.cities.filter(function(item) {
    //   return item.country_id === UserStor.userInfo.country_id;
    // });
    thisCtrl.locations = _.where(GlobalStor.global.locations.cities, {country_id : UserStor.userInfo.country_id});


    /**============ METHODS ================*/

    //------- Send Form Data
    function submitForm(form) {
      //------- Trigger validation flag.
      CartStor.cart.submitted = true;
      if(form.$valid && GlobalStor.global.changeLocation === 1) {
        CartMenuServ.sendOrder();
      } else if(GlobalStor.global.changeLocation === 0) {
        CartStor.cart.customer.customer_location = undefined;
        $('#impLocation').val('');
        form.location.$viewValue = "";
        form.location.$modelValue = "";
        form.location.$valid = false;
        $('.cart-dialogs').animate({scrollTop: 0},500);
      }
      else {
        $('.cart-dialogs').animate({scrollTop: 0},500);
      }
    }


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.submitForm = submitForm;
    thisCtrl.changeLocation = CartMenuServ.changeLocation;
    thisCtrl.selectCity = CartMenuServ.selectCity;
    thisCtrl.closeOrderDialog = CartMenuServ.closeOrderDialog;

  });
})();
