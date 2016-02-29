(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('CartModule')
    .factory('CartStor', cartStorageFactory);

  function cartStorageFactory($filter, OrderStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      cartSource: {
        allAddElements: [],
        isShowDiscount: 0,
        tempConstructDisc: 0,
        tempAddelemDisc: 0,
        discountPriceDiff: 0,
        discountDeliveyPlant: 0,
        marginDeliveyPlant: 0,
        squareTotal: 0,
        perimeterTotal: 0,
        qtyTotal: 0,

        isExistAddElems: 0,
        isAllAddElems: 0,
        allAddElemsOrder: [],
        addElemsOrderPriceTOTAL: 0,
        isSelectedProduct: 0,
        selectedProducts: [],

        isMasterDialog: 0,
        isOrderDialog: 0,
        isCreditDialog: 0,
        submitted: 0,
        isCityBox: 0,
        customer: {
          customer_sex: 0 //1-m, 2-f
        }
      },

      //------- data x order dialogs
      optionAge: [
        {id: 1, name: '20-30'},
        {id: 2, name: '31-40'},
        {id: 3, name: '41-50'},
        {id: 4, name: '51-60'},
        {id: 5, name: $filter('translate')('cart.CLIENT_AGE_OLDER') +' 61'}
      ],
      optionEductaion: [
        {id: 1, name: $filter('translate')('cart.CLIENT_EDUC_MIDLE')},
        {id: 2, name: $filter('translate')('cart.CLIENT_EDUC_SPEC')},
        {id: 3, name: $filter('translate')('cart.CLIENT_EDUC_HIGH')},
        {id: 4, name: $filter('translate')('cart.CLIENT_EDUC_4')}
      ],
      optionOccupation: [
        {id: 1, name: $filter('translate')('cart.CLIENT_OCCUP_WORKER')},
        {id: 2, name: $filter('translate')('cart.CLIENT_OCCUP_HOUSE')},
        {id: 3, name: $filter('translate')('cart.CLIENT_OCCUP_BOSS')},
        {id: 4, name: $filter('translate')('cart.CLIENT_OCCUP_STUD')},
        {id: 5, name: $filter('translate')('cart.CLIENT_OCCUP_PENSION')},
        {id: 6, name: $filter('translate')('cart.UNKNOWN')}
      ],
      optionInfo: [
        {id: 1, name: 'TV'},
        {id: 2, name: 'InterNET'},
        {id: 3, name: $filter('translate')('cart.CLIENT_INFO_PRESS')},
        {id: 4, name: $filter('translate')('cart.CLIENT_INFO_FRIEND')},
        {id: 5, name: $filter('translate')('cart.CLIENT_INFO_ADV')}
      ],

      setDefaultCart: setDefaultCart,
      fillOrderForm: fillOrderForm
    };


    thisFactory.publicObj.cart = setDefaultCart();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultCart() {
      var publicObj = angular.copy(thisFactory.publicObj.cartSource);
      return publicObj;
    }

    //------- filling order form
    function fillOrderForm() {
      thisFactory.publicObj.cart.customer.customer_name = angular.copy(OrderStor.order.customer_name);
      thisFactory.publicObj.cart.customer.customer_location = angular.copy(OrderStor.order.customer_location);
      thisFactory.publicObj.cart.customer.customer_address = angular.copy(OrderStor.order.customer_address);
      thisFactory.publicObj.cart.customer.customer_city = angular.copy(OrderStor.order.customer_city);
      thisFactory.publicObj.cart.customer.customer_city_id = angular.copy(OrderStor.order.customer_city_id);
      thisFactory.publicObj.cart.customer.customer_email = angular.copy(OrderStor.order.customer_email);
      thisFactory.publicObj.cart.customer.customer_phone = angular.copy(OrderStor.order.customer_phone);
      thisFactory.publicObj.cart.customer.customer_phone_city = angular.copy(OrderStor.order.customer_phone_city);
      thisFactory.publicObj.cart.customer.customer_itn = angular.copy(OrderStor.order.customer_itn);
      thisFactory.publicObj.cart.customer.customer_starttime = angular.copy(OrderStor.order.customer_starttime);
      thisFactory.publicObj.cart.customer.customer_endtime = angular.copy(OrderStor.order.customer_endtime);
      thisFactory.publicObj.cart.customer.customer_target = angular.copy(OrderStor.order.customer_target);
      thisFactory.publicObj.cart.customer.customer_sex = angular.copy(OrderStor.order.customer_sex);
      thisFactory.publicObj.cart.customer.customer_age = angular.copy(OrderStor.order.customer_age);
      thisFactory.publicObj.cart.customer.customer_education = angular.copy(OrderStor.order.customer_education);
      thisFactory.publicObj.cart.customer.customer_occupation = angular.copy(OrderStor.order.customer_occupation);
      thisFactory.publicObj.cart.customer.customer_infoSource = angular.copy(OrderStor.order.customer_infoSource);
    }

  }
})();
