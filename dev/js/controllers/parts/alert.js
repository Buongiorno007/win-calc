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

    /**============ METHODS ================*/

    function clickYes() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.confirmAction();
    }

    function clickCopy() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.confirmInActivity();
    }
    /**========== FINISH ==========*/

    thisCtrl.clickYes = clickYes;
    thisCtrl.clickCopy = clickCopy;
  });
})();