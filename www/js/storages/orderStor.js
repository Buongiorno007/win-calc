
// storages/orderStor.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .factory('OrderStor', orderStorageFactory);

  orderStorageFactory.$inject = [];

  function orderStorageFactory() {

    return {

      orderSource: {
        orderId: 0,
        orderType: '',
        orderStyle: '',
        productsQty: 0,
        products: [],
        productsPriceTOTAL: 0,
        deliveryDate: '',
        newDeliveryDate: '',
        deliveryPrice: 0,
        isDatePriceLess: false,
        isDatePriceMore: false,
        selectedFloor: 'free',
        selectedFloorPrice: 0,
        selectedAssembling: 'free',
        selectedAssemblingPrice: 0,
        isInstalment: 'false',
        selectedInstalmentPeriod: 0,
        selectedInstalmentPercent: 0,
        isOldPrice: false,
        paymentFirst: 0,
        paymentMonthly: 0,
        paymentFirstPrimary: 0,
        paymentMonthlyPrimary: 0,
        orderPriceTOTAL: 0,
        orderPriceTOTALPrimary: 0,

        name: '',
        location: '',
        address: '',
        mail: '',
        phone: '',
        phone2: '',
        itn: 0,
        starttime: '',
        endtime: '',
        target: ''

      },

      order: {},
      orders: [],

      fullOrderType: 'complete',
      draftOrderType: 'draft'

    }


  }
})();

