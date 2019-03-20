(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('LoaderCtrl',

  function(GlobalStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

  });
})();