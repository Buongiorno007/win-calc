(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('GlassSelectorCtrl', glassSelectorCtrl);

  function glassSelectorCtrl(globalConstants, GeneralServ, MainServ, GlobalStor, ProductStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.constants = globalConstants;

    thisCtrl.config = {
      DELAY_SHOW_ROOM: 2*globalConstants.STEP
    };



    //------ clicking
//    thisCtrl.selectRoom = selectRoom;
//    thisCtrl.closeRoomSelectorDialog = closeRoomSelectorDialog;

    //============ methods ================//


  }
})();