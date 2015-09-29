(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .factory('OrderStor', orderStorageFactory);

  function orderStorageFactory() {
    var thisFactory = this;


    thisFactory.publicObj = {
      orderSource: {
        id: 0,
        order_number: 0,
        order_hz: '---',
        order_type: 1, // 0 - draft
        order_date: new Date().getTime(),
        order_style: '',

        delivery_date: 0,
        new_delivery_date: 0,
        discount_construct: 0,
        discount_addelem: 0,

        //------- current Geolocation
        currCityId: 0,//*
        currRegionName: '',//*
        currCountryName: '',//*
        currFullLocation: '',
        climatic_zone: 0,
        heat_coef_min: 0,
        customer_city: '',

        products_qty: 0,
        products: [],
        products_price_total: 0,

        delivery_price: 0,
        is_date_price_less: 0,
        is_date_price_more: 0,

        floor_id: 0,
        floor_price: 0,
        mounting_id: 0,
        mounting_price: 0,
        is_instalment: 0,
        instalment_id: 0,
        selectedInstalmentPeriod: 0, //*
        selectedInstalmentPercent: 0, //*

        construct_price_total: 0,
        addelem_price_total: 0,

        is_old_price: 0,
        payment_first: 0,
        payment_monthly: 0,
        payment_first_primary: 0,
        payment_monthly_primary: 0,
        order_price_total: 0,
        order_price_total_dis: 0,
        order_price_total_primary: 0,

        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_phone_city: '',
        customer_address: '',
        customer_location: '',
        customer_itn: 0,
        customer_starttime: '',
        customer_endtime: '',
        customer_target: '',
        customer_sex: 0,
        customer_age: 0,
        customer_education: 0,
        customer_occupation: 0,
        customer_infoSource: 0

      },

      setDefaultOrder: setDefaultOrder
    };

    thisFactory.publicObj.order = setDefaultOrder();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultOrder() {
      var publicObj = angular.copy(thisFactory.publicObj.orderSource);
      return publicObj;
    }

  }
})();
