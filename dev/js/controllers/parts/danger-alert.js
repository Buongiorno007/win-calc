(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('DangerAlertCtrl',

  function($filter, GlobalStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.DANGER_ALERT_FIRST_PAGE = $filter('translate')('danger-alert.DANGER_ALERT_FIRST_PAGE');
    thisCtrl.DANGER_ALERT_SECOND_PAGE = $filter('translate')('danger-alert.DANGER_ALERT_SECOND_PAGE');


    /**============ METHODS ================*/

    function close() {
      GlobalStor.global.dangerAlert=0;
    }


    /**========== FINISH ==========*/
    thisCtrl.close = close;

  });
})();