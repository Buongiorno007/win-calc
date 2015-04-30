
// controllers/panels/add-elements-list.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('AddElementsListCtrl', addElementsListCtrl);

  function addElementsListCtrl($filter, globalConstants, GlobalStor, ProductStor, UserStor, AuxStor, AddElementsServ, AddElementMenuServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.product = ProductStor.product;
    thisCtrl.userInfo = UserStor.userInfo;
    thisCtrl.aux = AuxStor.aux;

    thisCtrl.addElementsGroup = [];
    thisCtrl.addElementsGroupNames = [
      $filter('translate')('add_elements.GRIDS'),
      $filter('translate')('add_elements.VISORS'),
      $filter('translate')('add_elements.SPILLWAYS'),
      $filter('translate')('add_elements.OUTSIDE'),
      $filter('translate')('add_elements.INSIDE'),
      $filter('translate')('add_elements.LOUVERS'),
      $filter('translate')('add_elements.CONNECTORS'),
      $filter('translate')('add_elements.FAN'),
      $filter('translate')('add_elements.WINDOWSILLS'),
      $filter('translate')('add_elements.HANDLELS'),
      $filter('translate')('add_elements.OTHERS')
    ];
    for(var g = 0; g < thisCtrl.addElementsGroupNames.length; g++){
      var groupTempObj = {};
      groupTempObj.groupId = (g+1);
      groupTempObj.groupName = thisCtrl.addElementsGroupNames[g];
      groupTempObj.groupClass = globalConstants.addElementsGroupClass[g];
      thisCtrl.addElementsGroup.push(groupTempObj);
    }


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
    thisCtrl.deleteAllAddElements = deleteAllAddElements;
    thisCtrl.closeAddElementListView = AddElementsServ.closeAddElementListView;






    //============ methods ================//

    //--------- Delete All List of selected AddElements
    function deleteAllAddElements() {
      var elementsQty = ProductStor.product.chosenAddElements.length,
          index = 0;
      for(; index < elementsQty; index++) {
        ProductStor.product.chosenAddElements[index].length = 0;
      }
      ProductStor.product.addElementsPriceSELECT = 0;
    }


  }
})();

