(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('AddElementsServ',

  function(
    $filter,
    $timeout,
    $location,
    globalConstants,
    GeneralServ,
    AddElementMenuServ,
    GlobalStor,
    ProductStor,
    AuxStor,
    DesignServ,
    DesignStor
  ) {
    /*jshint validthis:true */
    var thisFactory = this,
      delayShowElementsMenu = globalConstants.STEP * 12;
    /**============ METHODS ================*/


    function downloadAddElementsData(id) {
      var index = (id - 1), gridsSort;
      AuxStor.aux.addElementsMenuStyle = GeneralServ.addElementDATA[index].typeClass + '-theme';
      AuxStor.aux.addElementsType = angular.copy(GlobalStor.global.addElementsAll[index].elementType);

      /** if Grids */
      if (AuxStor.aux.isFocusedAddElement === 1) {
        if(ProductStor.product.is_addelem_only) {
          /** without window */
          gridsSort = angular.copy(GlobalStor.global.addElementsAll[index].elementsList)[0].filter(function(item) {
            return !item.profile_id;
          });
          AuxStor.aux.addElementsList = [gridsSort];
        } else {
          gridsSort = angular.copy(GlobalStor.global.addElementsAll[index].elementsList)[0].filter(function(item) {
            return item.profile_id === ProductStor.product.profile.id;
          });
          AuxStor.aux.addElementsList = [gridsSort];
        }
      } else {
        AuxStor.aux.addElementsList = angular.copy(GlobalStor.global.addElementsAll[index].elementsList);
      }
      //console.log(AuxStor.aux.addElementsList);
    }


    function showingAddElemMenu(id) {
      AuxStor.aux.isFocusedAddElement = id;
      AuxStor.aux.currAddElementPrice = 0;
      //playSound('swip');
      downloadAddElementsData(id);
      //------ if add elements list is not empty show menu
      if(AuxStor.aux.addElementsList.length) {
        if(AuxStor.aux.addElementsList[0].length) {
          AuxStor.aux.showAddElementsMenu = globalConstants.activeClass;
        }
      }
      hideMenu('close');
    }

    function hideMenu(elementId) {
      if(elementId === 'close') {
        if(AuxStor.aux.addElementsList.length>1) {
        for(var x=0; x<AuxStor.aux.addElementsList.length; x+=1) {
          $('#'+x).css({
                      'width' : 100 + '%',
                      'height' : 7 + '%'
                       })
          $('#'+x+'open').css({
                      'visibility' : 'visible'
                       })
          $('#'+x+'close').css({
                      'visibility' : 'hidden'
                       })
          AuxStor.aux.truefalse = 0;
        }
      } else {
        $('#'+ 0).css({
                      'width' : 100+'%',
                      'height' : 'auto'
                    })
        $('#'+ 0 + 'open').css({
                      'visibility' : 'hidden'
                       })
        $('#'+ 0 + 'close').css({
                      'visibility' : 'visible'
                       })
          AuxStor.aux.truefalse = 1;
      }
      } else {
        if (AuxStor.aux.truefalse === 1) {
          $('#'+AuxStor.aux.trfal+'prod').css({
              'color' : '#363636'
               }),
          $('#'+elementId).css({
                      'width' : 100 + '%',
                      'height' : 7 + '%'
                       })
        $('#'+elementId + 'open').css({
                      'visibility' : 'visible'
                       })
        $('#'+elementId + 'close').css({
                      'visibility' : 'hidden'
                       })
          AuxStor.aux.truefalse = 0;
        } else {
          $('#'+AuxStor.aux.trfal+'prod').css({
              'color' : '#363636'
               }),
          $('#'+elementId).css({
                      'width' : 100+'%',
                      'height' : 'auto'
                    })
        $('#'+elementId + 'open').css({
                      'visibility' : 'hidden'
                       })
        $('#'+elementId + 'close').css({
                      'visibility' : 'visible'
                       })
          AuxStor.aux.truefalse = 1;
        }
      }
    }

    /**--------- Select additional element group -----------*/

    function selectAddElement(id) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
      /** if AddElem Menu is opened yet */
      if(AuxStor.aux.showAddElementsMenu) {
        if (AuxStor.aux.isFocusedAddElement === id) {
          //-------- close menu
          AddElementMenuServ.closeAddElementsMenu();
        } else {
          //-------- close menu
          AddElementMenuServ.closeAddElementsMenu();
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

    /**------------- Select Add Element Parameter --------------*/

    function initAddElementTools(groupId, toolsId, elementIndex) {
      var currElem;
      DesignStor.design.minSizeLimit = 0;
      if(ProductStor.product.chosenAddElements[groupId-1][elementIndex].max_size) {
        DesignStor.design.maxSizeLimit = ProductStor.product.chosenAddElements[groupId-1][elementIndex].max_size;
        GlobalStor.global.maxSizeAddElem = ProductStor.product.chosenAddElements[groupId-1][elementIndex].max_size;
      } else {
        DesignStor.design.maxSizeLimit = 5000;
        GlobalStor.global.maxSizeAddElem = 5000;
      };
      
      /** click to the same parameter => calc Price and close caclulators */
      if(AuxStor.aux.auxParameter === groupId+'-'+toolsId+'-'+elementIndex) {
        AddElementMenuServ.finishCalculators();
      } else {
        /** click another parameter */
        if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
          /** calc Price previous parameter and close caclulators */
          AddElementMenuServ.finishCalculators();
        }
        currElem = ProductStor.product.chosenAddElements[groupId-1][elementIndex];
        AuxStor.aux.auxParameter = groupId + '-' + toolsId + '-' + elementIndex;
        AuxStor.aux.currentAddElementId = elementIndex;
        /** set css theme for calculator */
        AuxStor.aux.calculatorStyle = GeneralServ.addElementDATA[groupId-1].typeClass + '-theme';
        switch (toolsId) {
          case 1:
            GlobalStor.global.isQtyCalculator = 1;
            break;
          case 2:
            GlobalStor.global.isSizeCalculator = 1;
            GlobalStor.global.isWidthCalculator = 1;
            break;
          case 3:
            GlobalStor.global.isSizeCalculator = 1;
            GlobalStor.global.isWidthCalculator = 0;
            break;
        }
      }
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
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
    }
    function openAddElementListView() {
      AuxStor.aux.isAddElementListView = 1;
      viewSwitching();
    }

    function closeAddElementListView() {
      AuxStor.aux.isAddElementListView = 0;
      viewSwitching();
    }
    //----------- create AddElement Groups for Searching
    function createAddElementGroups() {
      var groupNamesQty = GeneralServ.addElementDATA.length,
          allElems = GlobalStor.global.addElementsAll,
          searchWord = AuxStor.aux.searchingWord.toLowerCase(),
          groupsArr = [],
          groupObj, elemObj, g, elementsQty, elemQty, wordPart, elementsList;
      AuxStor.aux.addElementGroups.length = 0;
      for(g = 0; g < groupNamesQty; g+=1){
        if(allElems[g].elementsList) {
          /** collect existed group */
          groupObj = {type: {}, elems: []};
          groupObj.type.groupId = (g+1);
          groupObj.type.groupName = $filter('translate')(GeneralServ.addElementDATA[g].name);
          groupObj.type.groupClass = GeneralServ.addElementDATA[g].typeClass + '-theme';

          /** search element */
          /** if Grids */
          if (!g) {
            if(ProductStor.product.is_addelem_only) {
              /** without window */
              elementsList = [angular.copy(allElems[g].elementsList)[0].filter(function(item) {
                return !item.profile_id;
              })];
            } else {
              /** grid filtering as ot profile id */
              elementsList = [angular.copy(allElems[g].elementsList)[0].filter(function(item) {
                return item.profile_id === ProductStor.product.profile.id;
              })];
            }
          } else {
            elementsList = allElems[g].elementsList;
          }
          elementsQty = elementsList.length;
          while(--elementsQty > -1) {
            elemQty = elementsList[elementsQty].length;
            while(--elemQty > -1) {
              /** if grids, needs filter as to profile Id */
              //wordPart = elementsList[elementsQty][elemQty].name.substr(0, searchWord.length).toLowerCase();
              wordPart = elementsList[elementsQty][elemQty].name.toLowerCase();
              if(wordPart.indexOf(searchWord)+1) {
                elemObj = {
                  typeInd: elementsQty,
                  index: elemQty,
                  name: elementsList[elementsQty][elemQty].name
                };
                groupObj.elems.push(elemObj);
              }
            }
          }
          groupsArr.push(groupObj);
        }
      }
      //-------- delete empty group
      AuxStor.aux.addElementGroups = groupsArr.filter(function(item) {
        return item.elems.length > 0;
      });
      //console.info(AuxStor.aux.addElementGroups);
    }

    //---------selected addElem
    function selectAddElem(typeId, elementId, clickEvent) {
      if (typeId+'prod'+elementId === AuxStor.aux.trfal || AuxStor.aux.trfal === -1) {
        $('#'+typeId+'prod'+elementId).css({
                    'color' : '#0079ff'
                     })
      } else if (elementId !== AuxStor.aux.trfal) {
        $('#'+AuxStor.aux.trfal).css({
                    'color' : '#363636'
                     }),
        $('#'+typeId+'prod'+elementId).css({
              'color' : '#0079ff'
                     })
      }
          AuxStor.aux.trfal = typeId+'prod'+elementId

      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
      /** if grid, show grid selector dialog */
      if((GlobalStor.global.currOpenPage === 'main') || ($location.path() === '/light') && AuxStor.aux.isFocusedAddElement === 1) {
        if(ProductStor.product.is_addelem_only) {
          /** without window */
          AddElementMenuServ.chooseAddElement(typeId, elementId);
        } else {
          /** show Grid Selector Dialog */
          AuxStor.aux.selectedGrid = [typeId, elementId];
          AuxStor.aux.isGridSelectorDialog = 1;
          AuxStor.aux.isAddElement = typeId+'-'+elementId;
          DesignServ.initAllGlassXGrid();
        }
      } else {
        /** if ListView is opened */
        if (AuxStor.aux.isAddElementListView) {
          selectAddElementList(typeId, elementId, clickEvent);
        } else {
          AddElementMenuServ.chooseAddElement(typeId, elementId);
        }
      }
    }
    /**----------- Select Add Element when open List View ------------*/

    function selectAddElementList(typeId, elementId, clickEvent) {
      var coord;
      if(AuxStor.aux.isAddElement === typeId+'-'+elementId) {
        AuxStor.aux.isAddElement = false;
      } else if(AuxStor.aux.isAddElement === false) {
        coord = $(clickEvent.target).offset();
        //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
        AuxStor.aux.coordinats = {'top': coord.top-17};
        $timeout(function() {
          AddElementMenuServ.getAddElementPrice(typeId, elementId);
          //AuxStor.aux.isAddElement = typeId + '-' + elementId;
        }, 500);
      } else {
        AuxStor.aux.isAddElement = false;
        $timeout(function() {
          coord = $(clickEvent.target).offset();
          //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
          AuxStor.aux.coordinats = {'top': coord.top-11};
        }, 500);
        $timeout(function() {
          AddElementMenuServ.getAddElementPrice(typeId, elementId);
        }, 1000);
      }
    }
    /**========== FINISH ==========*/

    thisFactory.publicObj = {
      selectAddElementList: selectAddElementList,
      selectAddElement: selectAddElement,
      initAddElementTools: initAddElementTools,
      selectAddElem: selectAddElem,
      openAddElementListView: openAddElementListView,
      closeAddElementListView: closeAddElementListView,
      createAddElementGroups: createAddElementGroups,
      hideMenu: hideMenu,
      downloadAddElementsData: downloadAddElementsData
    };

    return thisFactory.publicObj;

  });
})();
