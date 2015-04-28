
// services/addElements_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('AddElementsServ', navFactory);

  function navFactory($timeout, globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, optionsServ) {

    var thisFactory = this,
      delayShowElementsMenu = globalConstants.STEP * 12;

    thisFactory.publicObj = {
      selectAddElement: selectAddElement,
      initAddElementMenuTools: initAddElementMenuTools,
      viewSwitching: viewSwitching
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //Select additional element
    function selectAddElement(id) {
      if(GlobalStor.global.isFocusedAddElement !== id && GlobalStor.global.showAddElementsMenu) {
        GlobalStor.global.isFocusedAddElement = id;
        GlobalStor.global.isTabFrame = false;
        //playSound('swip');
        GlobalStor.global.showAddElementsMenu = false;

        //desactiveAddElementParameters();

        $timeout(function() {
//          $scope.global.isAddElement = false;
//          $scope.global.addElementsMenuStyle = false;
          //playSound('swip');
          GlobalStor.global.showAddElementsMenu = globalConstants.activeClass;
          downloadAddElementsData(id);
        }, delayShowElementsMenu);
      } else {
        GlobalStor.global.isFocusedAddElement = id;
        //playSound('swip');
        GlobalStor.global.showAddElementsMenu = globalConstants.activeClass;
        downloadAddElementsData(id);
      }
    }

    //
    //    //Select additional element
    //    function selectAddElement(id) {
    //      if($scope.global.isFocusedAddElement !== id && $scope.global.showAddElementsMenu) {
    //        $scope.global.isFocusedAddElement = id;
    //        $scope.global.isTabFrame = false;
    //        //playSound('swip');
    //        $scope.global.showAddElementsMenu = false;
    //        $scope.global.desactiveAddElementParameters();
    //        $timeout(function() {
    //          $scope.global.isAddElement = false;
    //          $scope.global.addElementsMenuStyle = false;
    //          //playSound('swip');
    //          $scope.global.showAddElementsMenu = globalConstants.activeClass;
    //          $scope.global.downloadAddElementsData(id);
    //        }, $scope.addElementsPanel.DELAY_SHOW_ELEMENTS_MENU);
    //      } else {
    //        $scope.global.isFocusedAddElement = id;
    //        //playSound('swip');
    //        $scope.global.showAddElementsMenu = globalConstants.activeClass;
    //        $scope.global.downloadAddElementsData(id);
    //      }
    //    }




    function downloadAddElementsData(id) {
      GlobalStor.global.addElementsMenuStyle = globalConstants.addElementsGroupClass[ (id - 1) ];
      switch(id) {
        case 1:
          /*
           globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'list_group_id': $scope.global.gridDBId}, function (results) {
           if (results.status) {
           $scope.global.addElementsList = [angular.copy(results.data)];
           } else {
           console.log(results);
           }
           });
           */
          optionsServ.getAllGrids(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 2:
          /*
           globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'list_group_id': $scope.global.visorDBId}, function (results) {
           if (results.status) {
           $scope.global.addElementsList = [angular.copy(results.data)];
           } else {
           console.log(results);
           }
           });
           */
          optionsServ.getAllVisors(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 3:
          /*
           globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'list_group_id': $scope.global.spillwayDBId}, function (results) {
           if (results.status) {
           $scope.global.addElementsList = [angular.copy(results.data)];
           } else {
           console.log(results);
           }
           });
           */
          optionsServ.getAllSpillways(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 4:
          optionsServ.getAllOutsideSlope(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 5:
          optionsServ.getAllLouvers(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 6:
          optionsServ.getAllInsideSlope(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 7:
          optionsServ.getAllConnectors(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 8:
          optionsServ.getAllFans(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 9:
          /*
           globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'list_group_id': $scope.global.windowsillDBId}, function (results) {
           if (results.status) {
           $scope.global.addElementsList = [angular.copy(results.data)];
           } else {
           console.log(results);
           }
           });
           */
          optionsServ.getAllWindowSills(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 10:
          optionsServ.getAllHandles(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 11:
          optionsServ.getAllOthers(function (results) {
            if (results.status) {
              GlobalStor.global.addElementsType = results.data.elementType;
              GlobalStor.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
      }
    }


    //------- Select Add Element Parameter
    function initAddElementMenuTools(toolsId, addElementId) {
      if(GlobalStor.global.auxParameter === GlobalStor.global.isFocusedAddElement+'-'+toolsId+'-'+addElementId) {
        desactiveAddElementParameters();
        GlobalStor.global.currentAddElementId = false;
        //console.log('close-'+$scope.global.auxParameter);
      } else {
        desactiveAddElementParameters();
        GlobalStor.global.auxParameter = GlobalStor.global.isFocusedAddElement+'-'+toolsId+'-'+addElementId;
        //console.log($scope.global.auxParameter);
        GlobalStor.global.currentAddElementId = addElementId;
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
            GlobalStor.global.isColorSelector = false;
            optionsServ.getLaminationAddElements(function (results) {
              if (results.status) {
                GlobalStor.global.addElementLaminatWhiteMatt = results.data.laminationWhiteMatt;
                GlobalStor.global.addElementLaminatWhiteGlossy = results.data.laminationWhiteGlossy;
                GlobalStor.global.addElementLaminatColor = results.data.laminations;
              } else {
                console.log(results);
              }
            });
            GlobalStor.global.isColorSelector = true;
            GlobalStor.global.isAddElementColor = GlobalStor.product.chosenAddElements.selectedWindowSill[addElementId].elementColorId;
            break;
        }
      }
    }


    // Open Add Elements in List View
    function viewSwitching() {
      //playSound('swip');
      GlobalStor.global.isAddElementListView = true;
      GlobalStor.global.isFocusedAddElement = false;
      GlobalStor.global.isTabFrame = false;
      GlobalStor.global.showAddElementsMenu = false;
      GlobalStor.global.isAddElement = false;
      desactiveAddElementParameters();
      $timeout(function() {
        GlobalStor.global.addElementsMenuStyle = false;
      }, delayShowElementsMenu);
    }


    function desactiveAddElementParameters() {
      GlobalStor.global.auxParameter = false;
      GlobalStor.global.isQtyCalculator = false;
      GlobalStor.global.isSizeCalculator = false;
      GlobalStor.global.isColorSelector = false;
    }


  }
})();

