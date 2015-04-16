(function(){
  'use strict';

  angular
    .module('MainModule')
    .controller('AddElementsCtrl', addElementsCtrl);

  addElementsCtrl.$inject = ['$scope', 'globalConstants', 'globalDB', 'constructService', 'localStorage', '$timeout'];

  function addElementsCtrl($scope, globalConstants, globalDB, constructService, localStorage, $timeout) {
    var activeClass = 'active';

    $scope.global = localStorage;

    $scope.addElementsPanel = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_GRID: globalConstants.STEP * 5,
      DELAY_SHOW_VISOR: globalConstants.STEP * 6,
      DELAY_SHOW_SPILLWAY: globalConstants.STEP * 6,
      DELAY_SHOW_OUTSIDE: globalConstants.STEP * 10,
      DELAY_SHOW_WINDOWSILL: globalConstants.STEP * 13,
      DELAY_SHOW_LOUVER: globalConstants.STEP * 15,
      DELAY_SHOW_INSIDESLOPE: globalConstants.STEP * 20,
      DELAY_SHOW_INSIDESLOPETOP: globalConstants.STEP * 20,
      DELAY_SHOW_INSIDESLOPERIGHT: globalConstants.STEP * 22,
      DELAY_SHOW_INSIDESLOPELEFT: globalConstants.STEP * 21,
      DELAY_SHOW_CONNECTORS: globalConstants.STEP * 30,
      DELAY_SHOW_FORCECONNECT: globalConstants.STEP * 30,
      DELAY_SHOW_BALCONCONNECT: globalConstants.STEP * 35,
      DELAY_SHOW_HANDLE: globalConstants.STEP * 28,
      DELAY_SHOW_FAN: globalConstants.STEP * 31,
      DELAY_SHOW_OTHERS: globalConstants.STEP * 31,
      DELAY_SHOW_BUTTON: globalConstants.STEP * 40,

      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 12,
      typing: 'on'
    };

    //Select additional element
    $scope.global.selectAddElement = function(id) {
      if($scope.global.isFocusedAddElement !== id && $scope.global.showAddElementsMenu) {
        $scope.global.isFocusedAddElement = id;
        $scope.global.isTabFrame = false;
        //playSound('swip');
        $scope.global.showAddElementsMenu = false;
        $scope.global.desactiveAddElementParameters();
        $timeout(function() {
          $scope.global.isAddElement = false;
          $scope.global.addElementsMenuStyle = false;
          //playSound('swip');
          $scope.global.showAddElementsMenu = activeClass;
          $scope.global.downloadAddElementsData(id);
        }, $scope.addElementsPanel.DELAY_SHOW_ELEMENTS_MENU);
      } else {
        $scope.global.isFocusedAddElement = id;
        //playSound('swip');
        $scope.global.showAddElementsMenu = activeClass;
        $scope.global.downloadAddElementsData(id);
      }
    };

    $scope.global.downloadAddElementsData = function(id) {
      switch(id) {
        case 1:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[0];
  /*
          globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'list_group_id': $scope.global.gridDBId}, function (results) {
            if (results.status) {
              $scope.global.addElementsList = [angular.copy(results.data)];
            } else {
              console.log(results);
            }
          });
  */
          constructService.getAllGrids(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 2:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[1];
  /*
          globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'list_group_id': $scope.global.visorDBId}, function (results) {
            if (results.status) {
              $scope.global.addElementsList = [angular.copy(results.data)];
            } else {
              console.log(results);
            }
          });
  */
          constructService.getAllVisors(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 3:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[2];
  /*
          globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'list_group_id': $scope.global.spillwayDBId}, function (results) {
            if (results.status) {
              $scope.global.addElementsList = [angular.copy(results.data)];
            } else {
              console.log(results);
            }
          });
  */
          constructService.getAllSpillways(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 4:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[3];
          constructService.getAllOutsideSlope(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 5:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[4];
          constructService.getAllLouvers(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 6:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[5];
          constructService.getAllInsideSlope(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 7:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[6];
          constructService.getAllConnectors(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 8:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[7];
          constructService.getAllFans(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 9:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[8];
  /*
          globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'list_group_id': $scope.global.windowsillDBId}, function (results) {
            if (results.status) {
              $scope.global.addElementsList = [angular.copy(results.data)];
            } else {
              console.log(results);
            }
          });
  */
          constructService.getAllWindowSills(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 10:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[9];
          constructService.getAllHandles(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
        case 11:
          $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[10];
          constructService.getAllOthers(function (results) {
            if (results.status) {
              $scope.global.addElementsType = results.data.elementType;
              $scope.global.addElementsList = results.data.elementsList;
            } else {
              console.log(results);
            }
          });
          break;
      }
    };

    // Select Add Element Parameter
    //$scope.changeAddElementParameter = function(focusedElementId, parameterId) {
    $scope.global.initAddElementMenuTools = function(toolsId, addElementId) {
      if($scope.global.auxParameter === $scope.global.isFocusedAddElement+'-'+toolsId+'-'+addElementId) {
        $scope.global.desactiveAddElementParameters();
        $scope.global.currentAddElementId = false;
        //console.log('close-'+$scope.global.auxParameter);
      } else {
        $scope.global.desactiveAddElementParameters();
        $scope.global.auxParameter = $scope.global.isFocusedAddElement+'-'+toolsId+'-'+addElementId;
        //console.log($scope.global.auxParameter);
        $scope.global.currentAddElementId = addElementId;
        switch(toolsId) {
          case 1:
            $scope.global.isQtyCalculator = true;
            break;
          case 2:
            $scope.global.isSizeCalculator = true;
            $scope.global.isWidthCalculator = true;
            break;
          case 3:
            $scope.global.isSizeCalculator = true;
            $scope.global.isWidthCalculator = false;
            break;
          case 4:
            $scope.global.isColorSelector = false;
            constructService.getLaminationAddElements(function (results) {
              if (results.status) {
                $scope.global.addElementLaminatWhiteMatt = results.data.laminationWhiteMatt;
                $scope.global.addElementLaminatWhiteGlossy = results.data.laminationWhiteGlossy;
                $scope.global.addElementLaminatColor = results.data.laminations;
              } else {
                console.log(results);
              }
            });
            $scope.global.isColorSelector = true;
            $scope.global.isAddElementColor = $scope.global.product.chosenAddElements.selectedWindowSill[addElementId].elementColorId;
            break;
        }
      }
    };

    $scope.global.desactiveAddElementParameters = function () {
      $scope.global.auxParameter = false;
      $scope.global.isQtyCalculator = false;
      $scope.global.isSizeCalculator = false;
      $scope.global.isColorSelector = false;
    };

    // Open Add Elements in List View
    $scope.viewSwitching = function() {
      //playSound('swip');
      $scope.global.isAddElementListView = true;
      $scope.global.isFocusedAddElement = false;
      $scope.global.isTabFrame = false;
      $scope.global.showAddElementsMenu = false;
      $scope.global.isAddElement = false;
      $scope.global.desactiveAddElementParameters();
      $timeout(function() {
        $scope.global.addElementsMenuStyle = false;
      }, $scope.addElementsPanel.DELAY_SHOW_ELEMENTS_MENU);
    };

    // Show Window Scheme Dialog
    $scope.showWindowScheme = function() {
      //playSound('fly');
      $scope.global.isWindowSchemeDialog = true;
    };

    $scope.closeWindowScheme = function() {
      //playSound('fly');
      $scope.global.isWindowSchemeDialog = false;
    };

  }
})();
