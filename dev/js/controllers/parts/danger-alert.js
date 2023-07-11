(function () {
  'use strict';
  /**@ngInject*/
  angular.module('MainModule').controller(
    'DangerAlertCtrl',

    function ($filter, GlobalStor, HistoryStor) {
      /*jshint validthis:true */
      var thisCtrl = this;
      thisCtrl.G = GlobalStor;
      thisCtrl.H = HistoryStor;
      thisCtrl.DANGER_ALERT_FIRST_PAGE = $filter('translate')(
        'danger-alert.DANGER_ALERT_FIRST_PAGE'
      );
      thisCtrl.DANGER_ALERT_SECOND_PAGE = $filter('translate')(
        'danger-alert.DANGER_ALERT_SECOND_PAGE'
      );
      thisCtrl.IGNORE = $filter('translate')('danger-alert.IGNORE');
      thisCtrl.PRODUCT = $filter('translate')('danger-alert.PRODUCT');

      /**============ METHODS ================*/

      function close() {
        GlobalStor.global.nameAddElem = [];
        GlobalStor.global.dangerAlert = 0;
      }

      function continued() {
        GlobalStor.global.nameAddElem = [];
        GlobalStor.global.dangerAlert = 0;
        GlobalStor.global.continued = 1;
      }

      /**========== FINISH ==========*/
      thisCtrl.close = close;
      thisCtrl.continued = continued;
    }
  );
})();
