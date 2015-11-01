
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
    thisCtrl.confirmGlass = confirmGlass;
    thisCtrl.setGlassToAll = MainServ.setGlassToAllTemplateBlocks(glassId, glassName);
    thisCtrl.closeGlassSelectorDialog = closeGlassSelectorDialog;

    //============ methods ================//

    function confirmGlass() {

    }
    function setGlassToAll() {

    }
    function closeGlassSelectorDialog() {
      GlobalStor.global.showGlassSelectorDialog = !GlobalStor.global.showGlassSelectorDialog;
    }
  }
})();
