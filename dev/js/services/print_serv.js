(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .factory('PrintServ',

      function ($location,
                $filter,
                GeneralServ,
                MainServ,
                CartMenuServ,
                GlobalStor,
                HistoryStor) {
        /*jshint validthis:true */
        var thisFactory = this;


        /**============ METHODS ================*/
        function getProducts(products,addEl) {
          HistoryStor.history.PrintProduct = products;
          HistoryStor.history.PrintAddEl = addEl;
          console.log(products, 'products=====');
          console.log(addEl, 'addEl=====');

          setTimeout(function () {
            window.print();
          }, 1000)
          //window.print();

        }

        /**========== FINISH ==========*/
        thisFactory.publicObj = {
          getProducts: getProducts,
        };

        return thisFactory.publicObj;


      });
})();
