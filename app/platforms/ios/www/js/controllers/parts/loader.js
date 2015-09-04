
// controllers/parts/loader.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('LoaderCtrl', loaderCtrl);

  function loaderCtrl(GlobalStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

  }
})();
