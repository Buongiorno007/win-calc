(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AlertCtrl', alertCtrl);

  function alertCtrl($filter, GlobalStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

    thisCtrl.BUTTON_N = $filter('translate')('common_words.BUTTON_N');
    thisCtrl.BUTTON_Y = $filter('translate')('common_words.BUTTON_Y');
    thisCtrl.clickYes = clickYes;

    function clickYes() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.confirmAction();
    }

  }
})();