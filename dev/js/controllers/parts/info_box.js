(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('infoBoxCtrl', infoBoxCtrl);

  function infoBoxCtrl(GlobalStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

    //------ clicking
    thisCtrl.closeInfoBox = closeInfoBox;


    //============ methods ================//
    /** close Info Box */
    function closeInfoBox() {
      GlobalStor.global.isInfoBox = 0;
      GlobalStor.global.infoTitle = '';
      GlobalStor.global.infoImg =  '';
      GlobalStor.global.infoLink = '';
      GlobalStor.global.infoDescrip = '';
    }



  }
})();