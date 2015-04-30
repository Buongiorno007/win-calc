
// controllers/menus/addelements-menu.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('addElementMenuCtrl', addElementMenuCtrl);

  function addElementMenuCtrl($timeout, globalConstants, GlobalStor, ProductStor, UserStor, AuxStor, AddElementMenuServ, AddElementsServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.product = ProductStor.product;
    thisCtrl.userInfo = UserStor.userInfo;
    thisCtrl.aux = AuxStor.aux;


    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ELEMENTS_MENU: 10 * globalConstants.STEP,
      typing: 'on'
    };



    //------ clicking
    thisCtrl.closeAddElementsMenu = AddElementMenuServ.closeAddElementsMenu;
    thisCtrl.chooseAddElement = AddElementMenuServ.chooseAddElement;
    thisCtrl.deleteAddElement = AddElementMenuServ.deleteAddElement;
    thisCtrl.showFrameTabs = showFrameTabs;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;

    thisCtrl.closeQtyCaclulator = closeQtyCaclulator;
    thisCtrl.setValueQty = AddElementMenuServ.setValueQty;
    thisCtrl.selectAddElementColor = AddElementMenuServ.selectAddElementColor;

    thisCtrl.selectElementListView = selectElementListView;






    //============ methods ================//

    //------- Show Tabs
    function showFrameTabs() {
      //playSound('swip');
      AuxStor.aux.isTabFrame = !AuxStor.aux.isTabFrame;
    }

    //--------- Close Qty Calculator
    function closeQtyCaclulator() {
      AddElementsServ.desactiveAddElementParameters();
    }

    // Select Add Element when open List View
    function selectElementListView(typeId, elementId, clickEvent) {
      if(typeId === undefined && elementId === undefined) {
        AuxStor.aux.isAddElement = false;
      } else if(AuxStor.aux.isAddElement === typeId+'-'+elementId) {
        AuxStor.aux.isAddElement = 1;
      } else if(AuxStor.aux.isAddElement === false || AuxStor.aux.isAddElement === 1) {
        var coord = $(clickEvent.target).offset();
        //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
        thisCtrl.coordinats = {'top': coord.top-17};
        $timeout(function() {
          AuxStor.aux.isAddElement = typeId + '-' + elementId;
        }, 500);
      } else {
        AuxStor.aux.isAddElement = 1;
        $timeout(function() {
          var coord = $(clickEvent.target).offset();
          //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
          thisCtrl.coordinats = {'top': coord.top-17};
        }, 500);
        $timeout(function() {
          AuxStor.aux.isAddElement = typeId + '-' + elementId;
        }, 1000);
      }
    }


    //    function clearSelectedAddElement() {
    //      AuxStor.aux.isAddElement = false;
    //    }

  }
})();

