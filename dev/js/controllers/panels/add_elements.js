(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('AddElementsCtrl', addElementsCtrl);

  function addElementsCtrl(globalConstants, GlobalStor, AuxStor, ProductStor, AddElementsServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.A = AuxStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_GRID: globalConstants.STEP * 5,
      DELAY_SHOW_VISOR: globalConstants.STEP * 6,
      DELAY_SHOW_SPILLWAY: globalConstants.STEP * 6,
      DELAY_SHOW_OUTSIDE: globalConstants.STEP * 10,
      DELAY_SHOW_WINDOWSILL: globalConstants.STEP * 13,
      DELAY_SHOW_LOUVER: globalConstants.STEP * 15,
      DELAY_SHOW_INSIDESLOPE: globalConstants.STEP * 20,
      DELAY_SHOW_INSIDESLOPETOP: globalConstants.STEP * 20,
      DELAY_SHOW_INSIDESLOPERIGHT: globalConstants.STEP * 22,
      DELAY_SHOW_INSIDESLOPELEFT: globalConstants.STEP * 21,
      DELAY_SHOW_CONNECTORS: globalConstants.STEP * 30,
      DELAY_SHOW_FORCECONNECT: globalConstants.STEP * 30,
      DELAY_SHOW_BALCONCONNECT: globalConstants.STEP * 35,
      DELAY_SHOW_HANDLE: globalConstants.STEP * 28,
      DELAY_SHOW_FAN: globalConstants.STEP * 31,
      DELAY_SHOW_OTHERS: globalConstants.STEP * 31,
      DELAY_SHOW_BUTTON: globalConstants.STEP * 40,

      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 12,
      typing: 'on'
    };



    //------ clicking
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
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
