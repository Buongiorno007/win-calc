
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
        product_id: 0,
        is_addelem_only: 0,
        room_id: 0,
        construction_type: 1, // 1 - window; 2 - windowDoor; 3 - balcony; 4 - door
        heat_coef_total: 0,

        template_id: 0,
        template_source: {},
        template: {},
        templateIcon: {},
        template_width: 0,
        template_height: 0,
        template_square: 0,

        profile: {},
        glass: [],
        hardware: {},

        profileDepths: {
          frameDepth: {},
          frameStillDepth: {},
          sashDepth: {},
          impostDepth: {},
          shtulpDepth: {}
        },

        lamination_out_id: 0,
        laminationOutName: $filter('translate')('mainpage.WHITE_LAMINATION'),
        lamination_in_id: 0,
        laminationInName: $filter('translate')('mainpage.WHITE_LAMINATION'),

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

        door_shape_id: 1,
        door_sash_shape_id: 1,
        door_handle_shape_id: 1,
        door_lock_shape_id: 1,

        template_price: 0,
        addelem_price: 0,
        addelemPriceDis: 0,
        product_price: 0,
        productPriceDis: 0,

        report: [],
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

