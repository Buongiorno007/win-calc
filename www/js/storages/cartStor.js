
// storages/cartStor.js

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
        productsPriceTOTALDis: 0,
        orderPriceTOTALDis: 0,
        orderPriceTOTALPrimaryDis: 0,
        paymentFirstDis: 0,
        paymentMonthlyDis: 0,
        paymentFirstPrimaryDis: 0,
        paymentMonthlyPrimaryDis: 0,
        discountPriceDiff: 0,
        isMasterDialog: 0,
        isOrderDialog: 0,
        isCreditDialog: 0,
        submitted: 0,
        isCityBox: 0,
        customer: {
          customer_location: OrderStor.order.customer_city +', '+ OrderStor.order.currRegionName,
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
        {id: 3, name: $filter('translate')('cart.CLIENT_EDUC_HIGH')}
      ],
      optionOccupation: [
        {id: 1, name: $filter('translate')('cart.CLIENT_OCCUP_WORKER')},
        {id: 2, name: $filter('translate')('cart.CLIENT_OCCUP_HOUSE')},
        {id: 3, name: $filter('translate')('cart.CLIENT_OCCUP_BOSS')},
        {id: 4, name: $filter('translate')('cart.CLIENT_OCCUP_STUD')},
        {id: 5, name: $filter('translate')('cart.CLIENT_OCCUP_PENSION')}
      ],
      optionInfo: [
        {id: 1, name: 'TV'},
        {id: 2, name: 'InterNET'},
        {id: 3, name: $filter('translate')('cart.CLIENT_INFO_PRESS')},
        {id: 4, name: $filter('translate')('cart.CLIENT_INFO_FRIEND')},
        {id: 5, name: $filter('translate')('cart.CLIENT_INFO_ADV')}
      ],

      setDefaultCart: setDefaultCart,
      setDefaultUser: setDefaultUser,
      fillOrderForm: fillOrderForm
    };


    thisFactory.publicObj.cart = setDefaultCart();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultCart() {
      var publicObj = angular.copy(thisFactory.publicObj.cartSource);
      return publicObj;
    }

    function setDefaultUser() {
      var publicObj = angular.copy(thisFactory.publicObj.cartSource.user);
      return publicObj;
    }

    //------- filling order form
    function fillOrderForm() {
      thisFactory.publicObj.cart.user.name = angular.copy(OrderStor.order.name);
      thisFactory.publicObj.cart.user.location = angular.copy(OrderStor.order.location);
      thisFactory.publicObj.cart.user.address = angular.copy(OrderStor.order.address);
      thisFactory.publicObj.cart.user.mail = angular.copy(OrderStor.order.mail);
      thisFactory.publicObj.cart.user.phone = angular.copy(OrderStor.order.phone);
      thisFactory.publicObj.cart.user.phone2 = angular.copy(OrderStor.order.phone2);
      thisFactory.publicObj.cart.user.itn = angular.copy(OrderStor.order.itn);
      thisFactory.publicObj.cart.user.starttime = angular.copy(OrderStor.order.starttime);
      thisFactory.publicObj.cart.user.endtime = angular.copy(OrderStor.order.endtime);
      thisFactory.publicObj.cart.user.target = angular.copy(OrderStor.order.target);
      thisFactory.publicObj.cart.user.sex = angular.copy(OrderStor.order.sex);
      thisFactory.publicObj.cart.user.age = angular.copy(OrderStor.order.age);
      thisFactory.publicObj.cart.user.education = angular.copy(OrderStor.order.education);
      thisFactory.publicObj.cart.user.occupation = angular.copy(OrderStor.order.occupation);
      thisFactory.publicObj.cart.user.infoSource = angular.copy(OrderStor.order.infoSource);
    }

  }
})();

