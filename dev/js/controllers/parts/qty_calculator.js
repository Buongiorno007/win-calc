(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('qtyCalculatorCtrl', qtyCalcCtrl);

  function qtyCalcCtrl(AddElementMenuServ) {

    var thisCtrl = this;

    //------ clicking
    thisCtrl.setValueSize = AddElementMenuServ.setValueSize;
    thisCtrl.deleteLastNumber = AddElementMenuServ.deleteLastNumber;
    thisCtrl.closeSizeCaclulator = AddElementMenuServ.closeSizeCaclulator;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;

  }
})();