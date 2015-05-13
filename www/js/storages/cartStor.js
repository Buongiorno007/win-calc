
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

        isMasterDialog: false,
        isOrderDialog: false,
        isCreditDialog: false,
        submitted: false,
        isCityBox: false,
        user: {
          location: OrderStor.order.currCityName +', '+ OrderStor.order.currRegionName,
          sex: ''
        }
      },

      //------- data x order dialogs
      optionAge: [
        '20-30',
        '31-40',
        '41-50',
        '51-60',
        $filter('translate')('cart.CLIENT_AGE_OLDER') +' 61'
      ],
      optionEductaion: [
        $filter('translate')('cart.CLIENT_EDUC_MIDLE'),
        $filter('translate')('cart.CLIENT_EDUC_SPEC'),
        $filter('translate')('cart.CLIENT_EDUC_HIGH')
      ],
      optionOccupation: [
        $filter('translate')('cart.CLIENT_OCCUP_WORKER'),
        $filter('translate')('cart.CLIENT_OCCUP_HOUSE'),
        $filter('translate')('cart.CLIENT_OCCUP_BOSS'),
        $filter('translate')('cart.CLIENT_OCCUP_STUD'),
        $filter('translate')('cart.CLIENT_OCCUP_PENSION')
      ],
      optionInfo: [
        'TV',
        'InterNET',
        $filter('translate')('cart.CLIENT_INFO_PRESS'),
        $filter('translate')('cart.CLIENT_INFO_FRIEND'),
        $filter('translate')('cart.CLIENT_INFO_ADV')
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

