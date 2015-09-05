
// storages/product_stor.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .factory('ProductStor', productStorageFactory);

  function productStorageFactory($filter) {
    var thisFactory = this;

    thisFactory.publicObj = {
      productSource: {
//        order_number: 0,
        product_id: 0,
        is_addelem_only: 0,
        room_id: 4,
        construction_type: 1, // 1 - window; 2 - windowDoor; 3 - balcony; 4 - door
        heat_coef_total: 0,

        templateIndex: 0, //*
        template_id: 0,
        template_source: {},
        template: {}, //*
        templateIcon: {}, //*
        templateWidth: 0, //*
        templateHeight: 0, //*

        profile: {},
        glass: {},
        hardware: {},

        lamination_out_id: 0,
        laminationOutName: $filter('translate')('mainpage.WHITE_LAMINATION'), //*
        lamination_in_id: 0,
        laminationInName: $filter('translate')('mainpage.WHITE_LAMINATION'), //*

        chosenAddElements: [
          [], // 0 - grids
          [], // 1 - visors
          [], // 2 - spillways
          [], // 3 - outSlope
          [], // 4 - louvers
          [], // 5 - inSlope
          [], // 6 - connectors
          [], // 7 - fans
          [], // 8 - windowSill
          [], // 9 - handles
          [] // 10 - others
        ],

        door_shape_id: 0,
        door_sash_shape_id: 0,
        door_handle_shape_id: 0,
        door_lock_shape_id: 0,

        template_price: 0,
        addelem_price: 0,
        product_price: 0,

        addElementsPriceSELECTDis: 0, //*
        productPriceTOTALDis: 0, //*
        comment: '',
        product_qty: 1

      },

      setDefaultProduct: setDefaultProduct
    };

    thisFactory.publicObj.product = setDefaultProduct();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultProduct() {
      var publicObj = angular.copy(thisFactory.publicObj.productSource);
      return publicObj;
    }

  }
})();

