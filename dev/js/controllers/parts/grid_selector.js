(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('GridSelectorCtrl',

  function(
    $filter,
    AddElementMenuServ,
    globalConstants,
    ProductStor,
    AuxStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.P = ProductStor;
    thisCtrl.A = AuxStor;

    //------ translate
    thisCtrl.SELECT_ALL = $filter('translate')('mainpage.SELECT_ALL');
    thisCtrl.SELECT_GLASS_WARN = $filter('translate')('mainpage.SELECT_GLASS_WARN');


    /**============ METHODS ================*/


    /**========== FINISH ==========*/

    thisCtrl.confirmGrid = AddElementMenuServ.confirmGrid;
    thisCtrl.setGridToAll = AddElementMenuServ.setGridToAll;
    thisCtrl.closeGridSelectorDialog = AddElementMenuServ.closeGridSelectorDialog;

  });
})();