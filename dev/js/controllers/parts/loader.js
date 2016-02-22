(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('LoaderCtrl', loaderCtrl);

  function loaderCtrl(GlobalStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

  }
})();