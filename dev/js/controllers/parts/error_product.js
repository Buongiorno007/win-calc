(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ErrorProdCtrl',

  function($filter, GlobalStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.BUTTON_N = $filter('translate')('common_words.DELETE_ORDER_TITLE');

    /**============ METHODS ================*/

    function close() {
      GlobalStor.global.isErrorProd = 0;
      GlobalStor.global.isErrorProdTitle = 'title';
    }
    /**========== FINISH ==========*/
    thisCtrl.close = close;
  });
})();
