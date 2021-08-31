(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('qtyCalculatorCtrl',

  function($filter, AddElementMenuServ, EditAddElementCartServ, GlobalStor, UserStor) {
    /*jshint validthis:true */
    var thisCtrl = this;

    //------- translate
    thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');

    //------ clicking
    if(GlobalStor.global.currOpenPage === 'cart') {
      thisCtrl.setValueQty = EditAddElementCartServ.setValueQty;
      thisCtrl.closeQtyCaclulator = EditAddElementCartServ.closeQtyCaclulator;
      thisCtrl.pressCulculator = EditAddElementCartServ.pressCulculator;
    } else {
      thisCtrl.setValueQty = AddElementMenuServ.setValueQty;
      thisCtrl.closeQtyCaclulator = AddElementMenuServ.closeQtyCaclulator;
      thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
    }
  });
})();