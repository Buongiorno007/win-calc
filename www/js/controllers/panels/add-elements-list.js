
// controllers/panels/add-elements-list.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('AddElementsListCtrl', addElementsListCtrl);

  function addElementsListCtrl(globalConstants, GlobalStor, ProductStor, UserStor, AuxStor, AddElementsServ, AddElementMenuServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;


    thisCtrl.config = {
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


  }
})();

