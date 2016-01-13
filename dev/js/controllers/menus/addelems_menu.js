/* globals d3 */
(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('addElementMenuCtrl', addElementMenuCtrl);

  function addElementMenuCtrl(
    $timeout,
    globalConstants,
    GlobalStor,
    ProductStor,
    UserStor,
    AuxStor,
    MainServ,
    AddElementMenuServ,
    AddElementsServ,
    DesignServ
  ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;


    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ELEMENTS_MENU: 10 * globalConstants.STEP,
      typing: 'on'
    };



    /**============ clicking ============*/
    thisCtrl.closeAddElementsMenu = AddElementMenuServ.closeAddElementsMenu;
    thisCtrl.selectAddElement = selectAddElement;
    thisCtrl.chooseAddElement = AddElementMenuServ.chooseAddElement;
    thisCtrl.chooseAddElementList = AddElementMenuServ.chooseAddElementList;
    thisCtrl.deleteAddElement = AddElementMenuServ.deleteAddElement;
    thisCtrl.showFrameTabs = showFrameTabs;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.showInfoBox = MainServ.showInfoBox;
    //------- culculator
    thisCtrl.closeQtyCaclulator = AddElementMenuServ.closeQtyCaclulator;
    thisCtrl.setValueQty = AddElementMenuServ.setValueQty;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
    //------- grid
    thisCtrl.confirmGrid = AddElementMenuServ.confirmGrid;
    thisCtrl.setGridToAll = AddElementMenuServ.setGridToAll;
    thisCtrl.closeGridSelectorDialog = AddElementMenuServ.closeGridSelectorDialog;








    /**============ methods ================*/

    /**------- Show Tabs -------*/

    function showFrameTabs() {
      //playSound('swip');
      AuxStor.aux.isTabFrame = !AuxStor.aux.isTabFrame;
    }



    /**---------- common function to select addElem in 2 cases --------*/

    function selectAddElement(typeId, elementId, clickEvent) {
      if(!GlobalStor.global.isQtyCalculator && !GlobalStor.global.isSizeCalculator) {
        /** if isAddElementListView = 1 is list view otherwise is common view */
        if (AuxStor.aux.isAddElementListView) {
          selectAddElementList(typeId, elementId, clickEvent);
        } else {
          /** if grid,  show grid selector dialog */
          if(AuxStor.aux.isFocusedAddElement === 1) {
            if(ProductStor.product.is_addelem_only) {
              //------ without window
              AddElementMenuServ.chooseAddElement(typeId, elementId);
            } else {
              //------- show Grid Selector Dialog
              AuxStor.aux.selectedGrid = [typeId, elementId];
              AuxStor.aux.isGridSelectorDialog = 1;
              DesignServ.initAllGlassXGrid();
            }
          } else {
            AddElementMenuServ.chooseAddElement(typeId, elementId);
          }
        }
      }
    }


    /**----------- Select Add Element when open List View ------------*/

    function selectAddElementList(typeId, elementId, clickEvent) {
      if(AuxStor.aux.isAddElement === typeId+'-'+elementId) {
        AuxStor.aux.isAddElement = false;
      } else if(AuxStor.aux.isAddElement === false) {
        var coord = $(clickEvent.target).offset();
        //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
        thisCtrl.coordinats = {'top': coord.top-17};
        $timeout(function() {
          AddElementMenuServ.getAddElementPrice(typeId, elementId);
          //AuxStor.aux.isAddElement = typeId + '-' + elementId;
        }, 500);
      } else {
        AuxStor.aux.isAddElement = false;
        $timeout(function() {
          var coord = $(clickEvent.target).offset();
          //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
          thisCtrl.coordinats = {'top': coord.top-17};
        }, 500);
        $timeout(function() {
          AddElementMenuServ.getAddElementPrice(typeId, elementId);
        }, 1000);
      }
    }



  }
})();
