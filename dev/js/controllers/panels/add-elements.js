(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('AddElementsCtrl', addElementsCtrl);

  function addElementsCtrl(globalConstants, GlobalStor, ProductStor, AddElementsServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.product = ProductStor.product;

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
    thisCtrl.initAddElementMenuTools = AddElementsServ.initAddElementMenuTools;
    thisCtrl.viewSwitching = AddElementsServ.viewSwitching;
    thisCtrl.showWindowScheme = showWindowScheme;
    thisCtrl.closeWindowScheme = closeWindowScheme;



    //============ methods ================//

    // Show Window Scheme Dialog
    function showWindowScheme() {
      //playSound('fly');
      GlobalStor.global.isWindowSchemeDialog = true;
    }

    function closeWindowScheme() {
      //playSound('fly');
      GlobalStor.global.isWindowSchemeDialog = false;
    }

  }
})();
