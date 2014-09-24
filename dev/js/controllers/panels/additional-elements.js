/* globals BauVoiceApp, STEP, activeClass */

'use strict';

BauVoiceApp.controller('AdditionalElementsCtrl', ['$scope', 'globalData', 'constructService', '$timeout', function ($scope, globalData, constructService, $timeout) {

  $scope.global = globalData;

  $scope.addElementsPanel = {
    DELAY_START: STEP,
    DELAY_SHOW_GRID: STEP * 5,
    DELAY_SHOW_VISOR: STEP * 6,
    DELAY_SHOW_SPILLWAY: STEP * 6,
    DELAY_SHOW_OUTSIDE: STEP * 10,
    DELAY_SHOW_WINDOWSILL: STEP * 13,
    DELAY_SHOW_LOUVER: STEP * 15,
    DELAY_SHOW_INSIDESLOPE: STEP * 20,
    DELAY_SHOW_INSIDESLOPETOP: STEP * 20,
    DELAY_SHOW_INSIDESLOPERIGHT: STEP * 22,
    DELAY_SHOW_INSIDESLOPELEFT: STEP * 21,
    DELAY_SHOW_CONNECTORS: STEP * 30,
    DELAY_SHOW_FORCECONNECT: STEP * 30,
    DELAY_SHOW_BALCONCONNECT: STEP * 35,
    DELAY_SHOW_HANDLE: STEP * 28,
    DELAY_SHOW_FAN: STEP * 31,
    DELAY_SHOW_OTHERS: STEP * 31,
    DELAY_SHOW_BUTTON: STEP * 40,

    DELAY_SHOW_ELEMENTS_MENU: STEP * 6,
    typing: 'on'
  };

  //Select additional element
  $scope.selectAddElement = function(id) {
    if($scope.global.isFocusedAddElement !== id && $scope.global.showAddElementsMenu) {
      $scope.global.isFocusedAddElement = id;
      $scope.global.isTabFrame = false;
      $scope.global.showAddElementsMenu = false;
      $scope.global.desactiveAddElementParameters();
      $timeout(function() {
        $scope.global.isAddElement = false;
        $scope.global.addElementsMenuStyle = false;
        $scope.global.showAddElementsMenu = activeClass;
        $scope.downloadAddElementsData(id);
      }, $scope.addElementsPanel.DELAY_SHOW_ELEMENTS_MENU);
    } else {
      $scope.global.isFocusedAddElement = id;
      $scope.global.showAddElementsMenu = activeClass;
      $scope.downloadAddElementsData(id);
    }
  };

  $scope.downloadAddElementsData = function(id) {
    switch(id) {
      case 1:
        $scope.global.addElementsMenuStyle = 'aux_color_connect';
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
        $scope.global.addElementsMenuStyle = 'aux_color_big';
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
        $scope.global.addElementsMenuStyle = 'aux_color_middle';
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
        $scope.global.addElementsMenuStyle = 'aux_color_slope';
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
        $scope.global.addElementsMenuStyle = 'aux_color_middle';
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
        $scope.global.addElementsMenuStyle = 'aux_color_slope';
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
        $scope.global.addElementsMenuStyle = 'aux_color_connect';
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
        $scope.global.addElementsMenuStyle = 'aux_color_small';
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
        $scope.global.addElementsMenuStyle = 'aux_color_big';
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
        $scope.global.addElementsMenuStyle = 'aux_color_middle';
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
        $scope.global.addElementsMenuStyle = 'aux_color_small';
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
          $scope.global.isAddElementColor = $scope.global.chosenAddElements.selectedWindowSill[addElementId].elementColorId;
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
    $scope.global.isAddElementListView = !$scope.global.isAddElementListView;
  };

}]);
