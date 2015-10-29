
// controllers/parts/glass_selector.js

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
    thisCtrl.closeGlassSelectorDialog = closeGlassSelectorDialog;

    //============ methods ================//

    function closeGlassSelectorDialog() {
      GlobalStor.global.showGlassSelectorDialog = !GlobalStor.global.showGlassSelectorDialog;
    }
  }
})();
