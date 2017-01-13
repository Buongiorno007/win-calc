(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AlertCtrl',

  function($filter, GlobalStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.BUTTON_N = $filter('translate')('common_words.BUTTON_N');
    thisCtrl.BUTTON_Y = $filter('translate')('common_words.BUTTON_Y');
    thisCtrl.BUTTON_C = $filter('translate')('common_words.BUTTON_C');
    thisCtrl.BUTTON_E = $filter('translate')('common_words.BUTTON_E');
    thisCtrl.OK       = $filter('translate')('common_words.OK');


    /**============ METHODS ================*/

    function clickYes() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isSyncAlert = 0;
      GlobalStor.global.confirmAction();
    }
    function clickCopy() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isSyncAlert = 0;
      GlobalStor.global.confirmInActivity();
    }
    function isAlert() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isBox = 0;
    }

    function syncNow() {
      console.log("sync");
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isSyncAlert = 0;
      GlobalStor.global.confirmAction();
      $("#updateDBcheck").prop("checked", true);
    }

    function noSync() {
      console.log("no sync");
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isSyncAlert = 0;
      GlobalStor.global.confirmAction();
      $("#updateDBcheck").prop("checked", false);
    }
    /**========== FINISH ==========*/
    thisCtrl.isAlert = isAlert;
    thisCtrl.clickYes = clickYes;
    thisCtrl.clickCopy = clickCopy;
    thisCtrl.syncNow = syncNow;
    thisCtrl.noSync = noSync;
  });
})();
