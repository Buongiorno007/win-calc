(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('DoorCheckCtrl',

  function($filter, DesignStor, HistoryStor, GlobalStor, DesignServ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.D = DesignStor;
    thisCtrl.G = GlobalStor;

    //------- translate
    thisCtrl.TEXT1 = $filter('translate')('natification.TEXT1');
    thisCtrl.TEXT2 = $filter('translate')('natification.TEXT2');
    thisCtrl.TEXT3 = $filter('translate')('natification.TEXT3');
    /**============ METHODS ================*/

    /**========== FINISH ==========*/
      //------ clicking
    // thisCtrl. = ;

  });
})();