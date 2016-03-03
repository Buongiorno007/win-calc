(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('addElementMenuCtrl',

  function(
    $timeout,
    $filter,
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

    //------- translate
    thisCtrl.TIP = $filter('translate')('add_elements_menu.TIP');
    thisCtrl.EMPTY_ELEMENT = $filter('translate')('add_elements_menu.EMPTY_ELEMENT');
    thisCtrl.NAME_LABEL = $filter('translate')('add_elements.NAME_LABEL');
    thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');
    thisCtrl.WIDTH_LABEL = $filter('translate')('add_elements.WIDTH_LABEL');
    thisCtrl.HEIGHT_LABEL = $filter('translate')('add_elements.HEIGHT_LABEL');
    thisCtrl.ADD = $filter('translate')('add_elements.ADD');
    thisCtrl.TAB_NAME_SIMPLE_FRAME = $filter('translate')('add_elements_menu.TAB_NAME_SIMPLE_FRAME');
    thisCtrl.TAB_NAME_HARD_FRAME = $filter('translate')('add_elements_menu.TAB_NAME_HARD_FRAME');
    thisCtrl.TAB_EMPTY_EXPLAIN = $filter('translate')('add_elements_menu.TAB_EMPTY_EXPLAIN');
    //------ grid selector
    thisCtrl.SELECT_ALL = $filter('translate')('mainpage.SELECT_ALL');
    thisCtrl.SELECT_GLASS_WARN = $filter('translate')('mainpage.SELECT_GLASS_WARN');






    /**============ METHODS ================*/

    /**------- Show Tabs -------*/

    function showFrameTabs() {
      //playSound('swip');
      AuxStor.aux.isTabFrame = !AuxStor.aux.isTabFrame;
    }


    /**----------- Select Add Element when open List View ------------*/

    function selectAddElementList(typeId, elementId, clickEvent) {
      var coord;
      if(AuxStor.aux.isAddElement === typeId+'-'+elementId) {
        AuxStor.aux.isAddElement = false;
      } else if(AuxStor.aux.isAddElement === false) {
        coord = $(clickEvent.target).offset();
        //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
        thisCtrl.coordinats = {'top': coord.top-17};
        $timeout(function() {
          AddElementMenuServ.getAddElementPrice(typeId, elementId);
          //AuxStor.aux.isAddElement = typeId + '-' + elementId;
        }, 500);
      } else {
        AuxStor.aux.isAddElement = false;
        $timeout(function() {
          coord = $(clickEvent.target).offset();
          //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
          thisCtrl.coordinats = {'top': coord.top-17};
        }, 500);
        $timeout(function() {
          AddElementMenuServ.getAddElementPrice(typeId, elementId);
        }, 1000);
      }
    }


    /**---------- common function to select addElem in 2 cases --------*/

    function selectAddElement(typeId, elementId, clickEvent) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
      /** if ListView is opened */
      if (AuxStor.aux.isAddElementListView) {
        selectAddElementList(typeId, elementId, clickEvent);
      } else {
        /** if grid,  show grid selector dialog */
        if(AuxStor.aux.isFocusedAddElement === 1) {
          if(ProductStor.product.is_addelem_only) {
            /** without window */
            AddElementMenuServ.chooseAddElement(typeId, elementId);
          } else {
            /** show Grid Selector Dialog */
            AuxStor.aux.selectedGrid = [typeId, elementId];
            AuxStor.aux.isGridSelectorDialog = 1;
            DesignServ.initAllGlassXGrid();
          }
        } else {
          AddElementMenuServ.chooseAddElement(typeId, elementId);
        }
      }
    }






    /**========== FINISH ==========*/

      //------ clicking
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


  });
})();
