(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('addElementMenuCtrl', addElementMenuCtrl);

  function addElementMenuCtrl($timeout, globalConstants, GlobalStor, ProductStor, UserStor, AuxStor, DesignStor, GeneralServ, MainServ, AddElementMenuServ, AddElementsServ, DesignServ, SVGServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;


    thisCtrl.config = {
      selectedGrid: 0,
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ELEMENTS_MENU: 10 * globalConstants.STEP,
      typing: 'on'
    };



    //------ clicking
    thisCtrl.selectAddElement = selectAddElement;
    thisCtrl.closeAddElementsMenu = AddElementMenuServ.closeAddElementsMenu;
    thisCtrl.chooseAddElement = AddElementMenuServ.chooseAddElement;
    thisCtrl.chooseAddElementList = AddElementMenuServ.chooseAddElementList;
    thisCtrl.deleteAddElement = AddElementMenuServ.deleteAddElement;
    thisCtrl.showFrameTabs = showFrameTabs;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.showInfoBox = MainServ.showInfoBox;

    thisCtrl.closeQtyCaclulator = AddElementMenuServ.closeQtyCaclulator;
    thisCtrl.setValueQty = AddElementMenuServ.setValueQty;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;

    thisCtrl.confirmGrid = confirmGrid;
    thisCtrl.setGridToAll = setGridToAll;
    thisCtrl.closeGridSelectorDialog = closeGridSelectorDialog;








    //============ methods ================//

    //------- Show Tabs
    function showFrameTabs() {
      //playSound('swip');
      AuxStor.aux.isTabFrame = !AuxStor.aux.isTabFrame;
    }



    /** common function to select addElem in 2 cases*/
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
              thisCtrl.config.selectedGrid = [typeId, elementId];
              AuxStor.aux.isGridSelectorDialog = 1;
              DesignServ.initAllGlassXGrid();
            }
          } else {
            AddElementMenuServ.chooseAddElement(typeId, elementId);
          }
        }
      }
    }


    // Select Add Element when open List View
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


    /**================ Grid Selector Dialog ================*/

    /** set Selected Grids */
    function confirmGrid() {
      var selectBlockQty = DesignStor.design.selectedGlass.length;
      if(selectBlockQty) {
        while (--selectBlockQty > -1) {
          var blockId = DesignStor.design.selectedGlass[selectBlockQty].attributes.block_id.nodeValue;
          setGridToTemplateBlocks(blockId, thisCtrl.config.selectedGrid);
        }
        changeSVGTemplateAsNewGrid();
        closeGridSelectorDialog();
      }
    }



    /** set Grids for all Sashes */
    function setGridToAll() {
      setGridToTemplateBlocks(0, thisCtrl.config.selectedGrid);
      changeSVGTemplateAsNewGrid();
      closeGridSelectorDialog();
    }




    function setGridToTemplateBlocks(blockId, gridIndex) {
      var blocksQty = ProductStor.product.template_source.details.length;
      while(--blocksQty > 0) {
        if(blockId) {
          /** set grid to template block by its Id */
          if(ProductStor.product.template_source.details[blocksQty].id === blockId) {
            /** check block to old grid
             * delete in product.choosenAddElements if exist
             * */
            deleteOldGridInList(blocksQty);
            setCurrGridToBlock(blockId, blocksQty, gridIndex);
            break;
          }
        } else {
          /** set grid to all template blocks */
          if(ProductStor.product.template_source.details[blocksQty].blockType === 'sash') {
            deleteOldGridInList(blocksQty);
            setCurrGridToBlock(ProductStor.product.template_source.details[blocksQty].id, blocksQty, gridIndex);
          }
        }
      }
    }



    function deleteOldGridInList(blockIndex) {
      if(ProductStor.product.template_source.details[blockIndex].gridId) {
        var chosenGridsQty = ProductStor.product.chosenAddElements[0].length;
        while(--chosenGridsQty > -1) {
          if(ProductStor.product.chosenAddElements[0][chosenGridsQty].block_id === ProductStor.product.template_source.details[blockIndex].id) {
            if (ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty === 1) {
              ProductStor.product.chosenAddElements[0].splice(chosenGridsQty, 1);
            } else if (ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty > 1) {
              ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty -= 1;
            }
          }
        }
      }
    }



    function setCurrGridToBlock(blockId, blockIndex, gridIndex) {
      ProductStor.product.template_source.details[blockIndex].gridId = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].id;
      ProductStor.product.template_source.details[blockIndex].gridTxt = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].name;
      var sizeGridX = ProductStor.product.template.details[blockIndex].pointsIn.map(function(item) {
            return item.x;
          }),
          sizeGridY = ProductStor.product.template.details[blockIndex].pointsIn.map(function(item) {
            return item.y;
          });
      AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].element_width = (d3.max(sizeGridX) - d3.min(sizeGridX));
      AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].element_height = (d3.max(sizeGridY) - d3.min(sizeGridY));
      AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].block_id = blockId;
      AddElementMenuServ.chooseAddElement(gridIndex[0], gridIndex[1]);
    }



    function changeSVGTemplateAsNewGrid () {
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
        ProductStor.product.template = angular.copy(result);
        //------ save analytics data
        //TODO ?? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 2);
      });
    }




    function closeGridSelectorDialog() {
      DesignServ.removeGlassEventsInSVG();
      DesignStor.design.selectedGlass.length = 0;
      thisCtrl.config.selectedGrid = 0;
      AuxStor.aux.isGridSelectorDialog = !AuxStor.aux.isGridSelectorDialog;
    }

  }
})();
