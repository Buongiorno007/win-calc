(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .factory('PrintServ',
 
  function(
    $location,
    $filter,
    GeneralServ,
    MainServ,
    CartMenuServ,
    GlobalStor,
    HistoryStor
  ) {
    /*jshint validthis:true */
    var thisFactory = this;


    /**============ METHODS ================*/
       function getProducts(products) {
        HistoryStor.history.isTest = products;
        console.log(products, 'products=====')
      }
    /**========== FINISH ==========*/

    thisFactory.publicObj = {
      getProducts:getProducts
    };

    return thisFactory.publicObj;


  });
})();
