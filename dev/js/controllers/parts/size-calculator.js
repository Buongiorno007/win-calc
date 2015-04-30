(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('sizeCalculatorCtrl', sizeCalcCtrl);

  function sizeCalcCtrl(GlobalStor, AddElementMenuServ) {

    var thisCtrl = this;
    thisCtrl.isConstructionPage = false;
    thisCtrl.global = GlobalStor.global;



    //------ clicking

    if(GlobalStor.global.currOpenPage === 'main') {
      thisCtrl.setValueSize = AddElementMenuServ.setValueSize;
      thisCtrl.deleteLastNumber = AddElementMenuServ.deleteLastNumber;
      thisCtrl.closeSizeCaclulator = AddElementMenuServ.closeSizeCaclulator;
    } else {
      thisCtrl.isConstructionPage = true;
    }



  }
})();