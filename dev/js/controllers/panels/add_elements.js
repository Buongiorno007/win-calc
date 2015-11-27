(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('AddElementsCtrl', addElementsCtrl);

  function addElementsCtrl(globalConstants, GlobalStor, AuxStor, ProductStor, AddElementsServ, AddElementMenuServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.A = AuxStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      delays: [
        globalConstants.STEP * 5, //GRID
        globalConstants.STEP * 6, //VISOR
        globalConstants.STEP * 6, //SPILLWAY
        globalConstants.STEP * 10, //OUTSIDE
        globalConstants.STEP * 13, //WINDOWSILL
        globalConstants.STEP * 15, //LOUVER
        globalConstants.STEP * 20, //INSIDESLOPE
        globalConstants.STEP * 30, //CONNECTORS
        globalConstants.STEP * 28, //HANDLE
        globalConstants.STEP * 31, //FAN
        globalConstants.STEP * 31 //OTHERS
      ],

      DELAY_SHOW_INSIDESLOPETOP: globalConstants.STEP * 20,
      DELAY_SHOW_INSIDESLOPERIGHT: globalConstants.STEP * 22,
      DELAY_SHOW_INSIDESLOPELEFT: globalConstants.STEP * 21,
      DELAY_SHOW_FORCECONNECT: globalConstants.STEP * 30,
      DELAY_SHOW_BALCONCONNECT: globalConstants.STEP * 35,
      DELAY_SHOW_BUTTON: globalConstants.STEP * 40,

      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 12,
      typing: 'on'
    };



    //------ clicking
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
    thisCtrl.openAddElementListView = AddElementsServ.openAddElementListView;
    thisCtrl.showWindowScheme = showWindowScheme;
    thisCtrl.closeWindowScheme = closeWindowScheme;



    //============ methods ================//

    // Show Window Scheme Dialog
    function showWindowScheme() {
      //playSound('fly');
      AuxStor.aux.isWindowSchemeDialog = true;
    }

    function closeWindowScheme() {
      //playSound('fly');
      AuxStor.aux.isWindowSchemeDialog = false;
    }

  }
})();
