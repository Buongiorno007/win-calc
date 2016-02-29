(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElementsCtrl',

  function(
    globalConstants,
    GeneralServ,
    AddElementsServ,
    AddElementMenuServ,
    GlobalStor,
    AuxStor,
    ProductStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.A = AuxStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      addElementDATA: GeneralServ.addElementDATA,
      DELAY_SHOW_INSIDESLOPETOP: globalConstants.STEP * 20,
      DELAY_SHOW_INSIDESLOPERIGHT: globalConstants.STEP * 22,
      DELAY_SHOW_INSIDESLOPELEFT: globalConstants.STEP * 21,
      DELAY_SHOW_FORCECONNECT: globalConstants.STEP * 30,
      DELAY_SHOW_BALCONCONNECT: globalConstants.STEP * 35,
      DELAY_SHOW_BUTTON: globalConstants.STEP * 40,
      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 12,
      typing: 'on'
    };



    /**============ METHODS ================*/

    // Show Window Scheme Dialog
    function showWindowScheme() {
      //playSound('fly');
      AuxStor.aux.isWindowSchemeDialog = true;
    }

    function closeWindowScheme() {
      //playSound('fly');
      AuxStor.aux.isWindowSchemeDialog = false;
    }


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
    thisCtrl.openAddElementListView = AddElementsServ.openAddElementListView;
    thisCtrl.showWindowScheme = showWindowScheme;
    thisCtrl.closeWindowScheme = closeWindowScheme;

  });
})();
