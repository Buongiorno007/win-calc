(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('qtyCalculatorCtrl',

  function($filter, AddElementMenuServ) {
    /*jshint validthis:true */
    var thisCtrl = this;

    //------- translate
    thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');

    //------ clicking
    thisCtrl.setValueQty = AddElementMenuServ.setValueQty;
    thisCtrl.closeQtyCaclulator = AddElementMenuServ.closeQtyCaclulator;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;

  });
})();