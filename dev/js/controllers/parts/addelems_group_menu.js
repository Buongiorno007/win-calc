(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElemGroupMenuCtrl',

  function(
    AddElementsServ,
    AddElementMenuServ,
    DesignServ,
    GlobalStor,
    ProductStor,
    AuxStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.A = AuxStor;


    /**============ METHODS ================*/

    function takeAddElemFilt(groupId, typeId, elementId, clickEvent) {
      clickEvent.stopPropagation();
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
      /** if grid, show grid selector dialog */
      if(GlobalStor.global.currOpenPage === 'main' && groupId === 1) {
        if(ProductStor.product.is_addelem_only) {
          /** without window */
          AddElementMenuServ.chooseAddElementList(typeId, elementId);
        } else {
          /** show Grid Selector Dialog */
          AuxStor.aux.selectedGrid = [typeId, elementId];
          AuxStor.aux.isGridSelectorDialog = 1;
          AuxStor.aux.isAddElement = typeId+'-'+elementId;
          DesignServ.initAllGlassXGrid();
        }
      } else {
        AuxStor.aux.isFocusedAddElement = groupId;
        AuxStor.aux.addElementsList = angular.copy(GlobalStor.global.addElementsAll[groupId-1].elementsList);
        AddElementMenuServ.chooseAddElementList(typeId, elementId);
      }

    }


    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.selectAddElemMenu = AddElementsServ.selectAddElement;
    thisCtrl.takeAddElemFilt = takeAddElemFilt;

  });
})();