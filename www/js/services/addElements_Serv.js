
// services/addElements_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('AddElementsServ', addElemFactory);

  function addElemFactory($filter, $timeout, globalConstants, GlobalStor, ProductStor, AuxStor, globalDB, optionsServ) {

    var thisFactory = this,
      delayShowElementsMenu = globalConstants.STEP * 12;

    thisFactory.publicObj = {
      selectAddElement: selectAddElement,
      initAddElementTools: initAddElementTools,
      desactiveAddElementParameters: desactiveAddElementParameters,
      openAddElementListView: openAddElementListView,
      closeAddElementListView: closeAddElementListView,
      createAddElementGroups: createAddElementGroups
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //--------- Select additional element
    function selectAddElement(id) {
      if(AuxStor.aux.isFocusedAddElement !== id && AuxStor.aux.showAddElementsMenu) {
        AuxStor.aux.isFocusedAddElement = id;
        AuxStor.aux.isTabFrame = false;
        //playSound('swip');
        AuxStor.aux.showAddElementsMenu = false;

        desactiveAddElementParameters();
        AuxStor.aux.isAddElement = false;
        $timeout(function() {
          AuxStor.aux.addElementsMenuStyle = false;
          //playSound('swip');
          AuxStor.aux.showAddElementsMenu = globalConstants.activeClass;
          downloadAddElementsData(id);
        }, delayShowElementsMenu);
      } else {
        AuxStor.aux.isFocusedAddElement = id;
        //playSound('swip');
        AuxStor.aux.showAddElementsMenu = globalConstants.activeClass;
        downloadAddElementsData(id);
      }
    }




    function downloadAddElementsData(id) {
      var index = (id - 1);
      AuxStor.aux.addElementsMenuStyle = globalConstants.addElementsGroupClass[ index ];

      //TODO download form GlobalDB
//      globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'list_group_id': globalDB.addElementDBId[index]}).then(function (result) {
//        if (result) {
//          AuxStor.aux.addElementsList = angular.copy(result);
//        } else {
//          console.log(result);
//        }
//      });

      switch(id) {
        case 1:
          optionsServ.getAllGrids(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 2:
          optionsServ.getAllVisors(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 3:
          optionsServ.getAllSpillways(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 4:
          optionsServ.getAllOutsideSlope(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 5:
          optionsServ.getAllLouvers(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 6:
          optionsServ.getAllInsideSlope(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 7:
          optionsServ.getAllConnectors(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 8:
          optionsServ.getAllFans(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 9:
          optionsServ.getAllWindowSills(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 10:
          optionsServ.getAllHandles(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 11:
          optionsServ.getAllOthers(function (results) {
            if (results.status) {
              AuxStor.aux.addElementsType = results.data.elementType;
              AuxStor.aux.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
      }
    }


    //------- Select Add Element Parameter
    function initAddElementTools(toolsId, elementIndex) {
      console.log('Tools!+', toolsId, elementIndex);
      if(AuxStor.aux.auxParameter === AuxStor.aux.isFocusedAddElement+'-'+toolsId+'-'+elementIndex) {
        desactiveAddElementParameters();
        AuxStor.aux.currentAddElementId = false;
        //console.log('close-'+$scope.global.auxParameter);
      } else {
        desactiveAddElementParameters();
        AuxStor.aux.auxParameter = AuxStor.aux.isFocusedAddElement+'-'+toolsId+'-'+elementIndex;
        //console.log($scope.global.auxParameter);
        AuxStor.aux.currentAddElementId = elementIndex;
        switch(toolsId) {
          case 1:
            GlobalStor.global.isQtyCalculator = true;
            break;
          case 2:
            GlobalStor.global.isSizeCalculator = true;
            GlobalStor.global.isWidthCalculator = true;
            break;
          case 3:
            GlobalStor.global.isSizeCalculator = true;
            GlobalStor.global.isWidthCalculator = false;
            break;
          case 4:
            //GlobalStor.global.isColorSelector = false;
            optionsServ.getLaminationAddElements(function (results) {
              if (results.status) {
                AuxStor.aux.addElementLaminatWhiteMatt = results.data.laminationWhiteMatt;
                AuxStor.aux.addElementLaminatWhiteGlossy = results.data.laminationWhiteGlossy;
                AuxStor.aux.addElementLaminatColor = results.data.laminations;
              } else {
                console.log(results);
              }
            });
            GlobalStor.global.isColorSelector = true;
            AuxStor.aux.isAddElementColor = ProductStor.product.chosenAddElements[8][elementIndex].elementColorId;
            break;
        }
      }
    }

    function openAddElementListView() {
      AuxStor.aux.isAddElementListView = true;
      viewSwitching();
    }

    function closeAddElementListView() {
      AuxStor.aux.isAddElementListView = false;
      viewSwitching();
    }


    // Open Add Elements in List View
    function viewSwitching() {
      //playSound('swip');
      AuxStor.aux.isFocusedAddElement = false;
      AuxStor.aux.isTabFrame = false;
      AuxStor.aux.showAddElementsMenu = false;
      AuxStor.aux.isAddElement = false;
      desactiveAddElementParameters();
      $timeout(function() {
        AuxStor.aux.addElementsMenuStyle = false;
      }, delayShowElementsMenu);
    }


    function desactiveAddElementParameters() {
      AuxStor.aux.auxParameter = false;
      GlobalStor.global.isQtyCalculator = false;
      GlobalStor.global.isSizeCalculator = false;
      GlobalStor.global.isWidthCalculator = false;
      GlobalStor.global.isColorSelector = false;
    }


    //----------- create AddElement Groups for Searching

    function createAddElementGroups() {
      var groups = [],
          groupNames = [
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
          ],
          groupNamesQty = groupNames.length,
          g = 0;

      for(; g < groupNamesQty; g++){
        var groupTempObj = {};
        groupTempObj.groupId = (g+1);
        groupTempObj.groupName = groupNames[g];
        groupTempObj.groupClass = globalConstants.addElementsGroupClass[g];
        groups.push(groupTempObj);
      }
      return groups;
    }

  }
})();

