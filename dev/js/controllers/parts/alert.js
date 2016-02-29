(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AlertCtrl', alertCtrl);

  function alertCtrl(GlobalStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

    thisCtrl.clickYes = clickYes;

    function clickYes() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.confirmAction();
    }

  }
})();