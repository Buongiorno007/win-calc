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
    AuxStor.aux.coordinats = 0;
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




    /**============ METHODS ================*/

    /**------- Show Tabs -------*/

    function showFrameTabs() {
      // console.log("ProductStor.product",ProductStor.product);
      //playSound('swip');
      AuxStor.aux.isTabFrame = !AuxStor.aux.isTabFrame;
    }



    /**========== FINISH ==========*/

      //------ clicking
    thisCtrl.selectAddElementList = AddElementsServ.selectAddElementList;
    thisCtrl.closeAddElementsMenu = AddElementMenuServ.closeAddElementsMenu;
    thisCtrl.selectAddElement = AddElementsServ.selectAddElem;
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
    thisCtrl.hideMenu = AddElementsServ.hideMenu;


  });
})();
