(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AttantCtrl',

  function(DesignStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.D = DesignStor;


    /**============ METHODS ================*/

    function closeAttantion() {
      DesignStor.design.isGlassExtra = 0;
    }



    /**========== FINISH ==========*/
      //------ clicking
    thisCtrl.closeAttantion = closeAttantion;

  });
})();