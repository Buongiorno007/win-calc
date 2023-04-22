(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('LoaderCtrl',

  function(GlobalStor, globalConstants) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.consts = globalConstants;
  });
})();