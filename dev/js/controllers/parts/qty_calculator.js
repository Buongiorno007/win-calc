(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('qtyCalculatorCtrl',

  function(AddElementMenuServ) {
    /*jshint validthis:true */
    var thisCtrl = this;

    //------ clicking
    thisCtrl.setValueQty = AddElementMenuServ.setValueQty;
    thisCtrl.closeQtyCaclulator = AddElementMenuServ.closeQtyCaclulator;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;

  });
})();