(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('AddElementsServ', addElemFactory);

  function addElemFactory($timeout, globalConstants, GeneralServ, AddElementMenuServ, GlobalStor, ProductStor, AuxStor) {

    var thisFactory = this,
      delayShowElementsMenu = globalConstants.STEP * 12;

    thisFactory.publicObj = {
      selectAddElement: selectAddElement,
      initAddElementTools: initAddElementTools,
      openAddElementListView: openAddElementListView,
      closeAddElementListView: closeAddElementListView,
      createAddElementGroups: createAddElementGroups
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //--------- Select additional element group
    function selectAddElement(id) {
      if(!GlobalStor.global.isQtyCalculator && !GlobalStor.global.isSizeCalculator) {//TODO ?????
        /** if AddElem Menu is opened yet */
        if(AuxStor.aux.showAddElementsMenu) {
          if (AuxStor.aux.isFocusedAddElement === id) {
            //-------- close menu
            closingAddElemMenu();
          } else {
            //-------- close menu
            closingAddElemMenu();
            //-------- next open new menu
            $timeout(function () {
              showingAddElemMenu(id);
            }, delayShowElementsMenu);
          }
        } else {
          /** first open of AddElem Menu */
          showingAddElemMenu(id);
        }
      }
    }


    function showingAddElemMenu(id) {
      AuxStor.aux.isFocusedAddElement = id;
      //playSound('swip');
      AuxStor.aux.showAddElementsMenu = globalConstants.activeClass;
      downloadAddElementsData(id);
    }

    function closingAddElemMenu() {
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AddElementMenuServ.desactiveAddElementParameters();
      AuxStor.aux.isAddElement = 0;
    }



    function downloadAddElementsData(id) {
      var index = (id - 1);
      AuxStor.aux.addElementsMenuStyle = GeneralServ.addElementDATA[index].typeClass + '-theme';
      AuxStor.aux.addElementsType = angular.copy(GlobalStor.global.addElementsAll[index].elementType);
      AuxStor.aux.addElementsList = angular.copy(GlobalStor.global.addElementsAll[index].elementsList);
    }


    //------- Select Add Element Parameter
    function initAddElementTools(groupId, toolsId, elementIndex) {
      //console.log('Tools!+', AuxStor.aux.auxParameter, '====', groupId, toolsId, elementIndex);
      //----- close caclulator if opened
      if(AuxStor.aux.auxParameter === groupId+'-'+toolsId+'-'+elementIndex) {
        if(AuxStor.aux.tempSize.length) {
          AddElementMenuServ.changeElementSize();
          if(GlobalStor.global.isSizeCalculator) {
            AddElementMenuServ.closeSizeCaclulator();
          } else if(GlobalStor.global.isQtyCalculator) {
            AddElementMenuServ.closeQtyCaclulator();
          }
        }
        //AddElementMenuServ.desactiveAddElementParameters();
        AuxStor.aux.currentAddElementId = 0;
        //console.log('close-'+$scope.global.auxParameter);
      } else {
        if(!GlobalStor.global.isQtyCalculator && !GlobalStor.global.isSizeCalculator) {
          if(AuxStor.aux.isFocusedAddElement === groupId) {
            var currElem = ProductStor.product.chosenAddElements[groupId-1][elementIndex];
            AddElementMenuServ.desactiveAddElementParameters();
            AuxStor.aux.auxParameter = groupId + '-' + toolsId + '-' + elementIndex;
            AuxStor.aux.currentAddElementId = elementIndex;
            switch (toolsId) {
              case 1:
                if(currElem.element_qty) {
                  AuxStor.aux.tempSize = currElem.element_qty.toString().split('');
                }
                GlobalStor.global.isQtyCalculator = 1;
                break;
              case 2:
                if(currElem.element_width) {
                  AuxStor.aux.tempSize = currElem.element_width.toString().split('');
                }
                GlobalStor.global.isSizeCalculator = 1;
                GlobalStor.global.isWidthCalculator = 1;
                break;
              case 3:
                if(currElem.element_height) {
                  AuxStor.aux.tempSize = currElem.element_height.toString().split('');
                }
                GlobalStor.global.isSizeCalculator = 1;
                GlobalStor.global.isWidthCalculator = 0;
                break;
            }
          }
        }
      }
    }

    function openAddElementListView() {
      if(!GlobalStor.global.isQtyCalculator && !GlobalStor.global.isSizeCalculator) {//TODO ?????
        AuxStor.aux.isAddElementListView = 1;
        viewSwitching();
      }
    }

    function closeAddElementListView() {
      AuxStor.aux.isAddElementListView = 0;
      viewSwitching();
    }


    // Open Add Elements in List View
    function viewSwitching() {
      //playSound('swip');
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AuxStor.aux.isAddElement = 0;
      //------ close Grid Selector Dialog
      AuxStor.aux.isGridSelectorDialog = 0;
      AddElementMenuServ.desactiveAddElementParameters();
    }


    //----------- create AddElement Groups for Searching
    function createAddElementGroups() {
      var groupNamesQty = GeneralServ.addElementDATA.length,
          g = 0;
      AuxStor.aux.addElementGroups.length = 0;
      for(; g < groupNamesQty; g++){
        if(GlobalStor.global.addElementsAll[g].elementsList) {
          var groupTempObj = {};
          groupTempObj.groupId = (g+1);
          groupTempObj.groupName = angular.copy(GeneralServ.addElementDATA[g].name);
          groupTempObj.groupClass = GeneralServ.addElementDATA[g].typeClass + '-theme';
          AuxStor.aux.addElementGroups.push(groupTempObj);
          //AuxStor.aux.addElementGroups.push(angular.copy(GeneralServ.addElementDATA[g]));
        }
      }
    }


  }
})();
