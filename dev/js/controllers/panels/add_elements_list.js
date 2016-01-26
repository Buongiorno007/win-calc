(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElementsListCtrl', addElementsListCtrl);

  function addElementsListCtrl(globalConstants, GeneralServ, AddElementsServ, AddElementMenuServ, GlobalStor, ProductStor, UserStor, AuxStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;


    thisCtrl.config = {
      addElementDATA: GeneralServ.addElementDATA,
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 6,
      filteredGroups: [],
      typing: 'on'
    };

    //------ clicking
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.deleteAddElement = AddElementMenuServ.deleteAddElement;
    thisCtrl.deleteAllAddElements = AddElementMenuServ.deleteAllAddElements;
    thisCtrl.closeAddElementListView = AddElementsServ.closeAddElementListView;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;

  }
})();
