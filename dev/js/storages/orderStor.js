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
        orderId: 0,
        orderDate: new Date().getTime(),
        //------- current Geolocation
        currCityId: 0,
        currCityName: '',
        currRegionName: '',
        currCountryName: '',
        currClimaticZone: 0,
        currHeatTransfer: 0,
        currFullLocation: '',

        orderType: '',
        orderStyle: '',
        productsQty: 0,
        products: [],
        productsPriceTOTAL: 0,
        deliveryDate: 0,
        newDeliveryDate: 0,
        deliveryPrice: 0,
        isDatePriceLess: 0,
        isDatePriceMore: 0,
        selectedFloor: 'free',
        selectedFloorPrice: 0,
        selectedAssembling: 'free',
        selectedAssemblingPrice: 0,
        isInstalment: 0,
        selectedInstalmentPeriod: 0,
        selectedInstalmentPercent: 0,
        isOldPrice: 0,
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

      fullOrderType: 'complete',
      draftOrderType: 'draft',

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
