(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AttantCtrl',

  function($filter, DesignStor, HistoryStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.D = DesignStor;
    thisCtrl.H = HistoryStor;

    //------- translate
    thisCtrl.NO_PRINT = $filter('translate')('history.NO_PRINT');
    thisCtrl.EXTRA_SASH = $filter('translate')('design.EXTRA_SASH');
    thisCtrl.CHANGE_SIZE = $filter('translate')('design.CHANGE_SIZE') ;
    thisCtrl.DOOR_ERROR = $filter('translate')('design.DOOR_ERROR');

    /**============ METHODS ================*/

    function closeAttantion() {
      DesignStor.design.isGlassExtra = 0;
      DesignStor.design.isHardwareExtra = 0;
      HistoryStor.history.isNoPrint = 0;
      DesignStor.design.isNoDoors = 0;
    }



    /**========== FINISH ==========*/
      //------ clicking
    thisCtrl.closeAttantion = closeAttantion;

  });
})();