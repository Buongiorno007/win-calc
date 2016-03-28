(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .controller('EditOrderCtrl',

  function(
    $filter,
    OrderStor,
    HistoryStor,
    CartStor,
    GlobalStor,
    HistoryServ,
    RecOrderServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.G = GlobalStor;


    /**============ METHODS ================*/
    function box1() {
var rerere = RecOrderServ.box()
console.log('rerere', rerere)
}
    /**========== FINISH ==========*/

    //------ clicking
thisCtrl.box = RecOrderServ.box;
thisCtrl.box1 = box1;

  });
})();