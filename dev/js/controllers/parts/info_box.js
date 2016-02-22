(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('infoBoxCtrl', infoBoxCtrl);

  function infoBoxCtrl(GlobalStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;



    /**============ METHODS ================*/

    /** close Info Box */
    function closeInfoBox() {
      GlobalStor.global.isInfoBox = 0;
      GlobalStor.global.infoTitle = '';
      GlobalStor.global.infoImg =  '';
      GlobalStor.global.infoLink = '';
      GlobalStor.global.infoDescrip = '';
    }


    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.closeInfoBox = closeInfoBox;


  }
})();