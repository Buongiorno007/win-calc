(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('infoBoxCtrl',

  function(GlobalStor, InfoBoxServ, $filter) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

    thisCtrl.ASKING_PRICE = $filter('translate')('natification.ASKING_PRICE');


    /**============ METHODS ================*/

    /** close Info Box */
    function closeInfoBox() {
      if(GlobalStor.global.showApply === 1) {
        GlobalStor.global.inform = 1;
      }
      GlobalStor.global.showApply = 0
      GlobalStor.global.isInfoBox = 0;
      GlobalStor.global.infoTitle = '';
      GlobalStor.global.infoImg =  '';
      GlobalStor.global.infoLink = '';
      GlobalStor.global.infoDescrip = '';
    }


    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.closeInfoBox = closeInfoBox;
    thisCtrl.isApply = InfoBoxServ.isApply;


  });
})();