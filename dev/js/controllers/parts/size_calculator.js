(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('sizeCalculatorCtrl',

  function(
    GlobalStor,
    DesignStor,
    AddElementMenuServ,
    DesignServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.isDesignPage = false;
    thisCtrl.D = DesignStor;



    //------ clicking
    //------ for Add Elements Panel
    if(GlobalStor.global.currOpenPage === 'main') {
      thisCtrl.isDesignPage = false;
      thisCtrl.setValueSize = AddElementMenuServ.setValueSize;
      thisCtrl.deleteLastNumber = AddElementMenuServ.deleteLastNumber;
      thisCtrl.closeSizeCaclulator = AddElementMenuServ.closeSizeCaclulator;
    //------ for Design Page
    } else {
      thisCtrl.isDesignPage = true;
      thisCtrl.setValueSize = DesignServ.setValueSize;
      thisCtrl.deleteLastNumber = DesignServ.deleteLastNumber;
      thisCtrl.closeSizeCaclulator = DesignServ.closeSizeCaclulator;
    }
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;


  });
})();