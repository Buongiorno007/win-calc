(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('ProductStor',

      function () {
        /*jshint validthis:true */
        var thisFactory = this;

        function setDefaultProduct() {
          return angular.copy(thisFactory.publicObj.productSource);
        }

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
            locales_names: {},
            glass: [],
            hardware: {},
            beadsData: [],

            profileDepths: {
              frameDepth: {},
              frameStillDepth: {},
              sashDepth: {},
              impostDepth: {},
              shtulpDepth: {}
            },
            lamination: {
              id: 0,
              lamination_in_id: 1,
              lamination_out_id: 1,
              laminat_in_name: 'mainpage.WHITE_LAMINATION',
              laminat_out_name: 'mainpage.WHITE_LAMINATION',
              img_in_id: 1,
              img_out_id: 1
            },
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
              [], // 10 - others
              [], // 11 - shutters
              [], // 12 - grating
              [], // 13 - blind
              [], // 14 - shut
              [], // 15 - grat
              [], // 16 - vis
              []  // 17 - spil
            ],

            door_type_index: 0,
            door_shape_id: 0,
            door_sash_shape_id: 0,
            door_handle_shape_id: 0,
            door_lock_shape_id: 0,
            doorName: '',
            doorSashName: '',
            doorHandle: {},
            doorLock: {},

            template_price: 0,
            addelem_price: 0,
            addelemPriceDis: 0,
            product_price: 0,
            productPriceDis: 0,

            report: [],
            comment: '',
            product_qty: 1,
            services_price_arr: [0, 0, 0, 0, 0],
            service_price: 0,
            service_price_dis: 0

          },

          setDefaultProduct: setDefaultProduct
        };
        thisFactory.publicObj.product = setDefaultProduct();

        return thisFactory.publicObj;

      });
})();
