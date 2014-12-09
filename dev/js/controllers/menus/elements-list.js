/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ElementsListCtrl', ['$scope', 'localStorage', '$timeout', function ($scope, localStorage, $timeout) {

  var sourceAddElement, cloneAddElement;

  $scope.global = localStorage;

  $scope.addElementsMenu = {
    DELAY_START: STEP,
    DELAY_SHOW_ELEMENTS_MENU: STEP * 6,

    tempSize: [],
    typing: 'on'
  };

  // Select AddElement
  $scope.chooseAddElement = function(typeId, elementId) {
    if(typeId === undefined && elementId === undefined) {
      $scope.global.desactiveAddElementParameters();
      $scope.global.isAddElement = false;

      switch($scope.global.isFocusedAddElement) {
        case 1:
          $scope.global.chosenAddElements.selectedGrids.length = 0;
          break;
        case 2:
          $scope.global.chosenAddElements.selectedVisors.length = 0;
          break;
        case 3:
          $scope.global.chosenAddElements.selectedSpillways.length = 0;
          break;
        case 4:
          $scope.global.chosenAddElements.selectedOutsideSlope.length = 0;
          break;
        case 5:
          $scope.global.chosenAddElements.selectedLouvers.length = 0;
          break;
        case 6:
          $scope.global.chosenAddElements.selectedInsideSlope.length = 0;
          break;
        case 7:
          $scope.global.chosenAddElements.selectedConnectors.length = 0;
          break;
        case 8:
          $scope.global.chosenAddElements.selectedFans.length = 0;
          break;
        case 9:
          $scope.global.chosenAddElements.selectedWindowSill.length = 0;
          break;
        case 10:
          $scope.global.chosenAddElements.selectedHandles.length = 0;
          break;
        case 11:
          $scope.global.chosenAddElements.selectedOthers.length = 0;
          break;
      }

    } else {
      $scope.global.isAddElement = typeId+'-'+elementId;

      sourceAddElement = $scope.global.addElementsList[typeId][elementId];
      cloneAddElement = angular.copy(sourceAddElement);

      // Show current add element price
      $scope.addElementsMenu.isAddElementPrice = true;
      $scope.currAddElementPrice = sourceAddElement.elementPrice;

      switch($scope.global.isFocusedAddElement) {
        case 1:
          cloneAddElement.elementId = 1;
          $scope.global.chosenAddElements.selectedGrids.push(cloneAddElement);
          break;
        case 2:
          cloneAddElement.elementId = 2;
          $scope.global.chosenAddElements.selectedVisors.push(cloneAddElement);
          break;
        case 3:
          cloneAddElement.elementId = 3;
          $scope.global.chosenAddElements.selectedSpillways.push(cloneAddElement);
          break;
        case 4:
          cloneAddElement.elementId = 4;
          $scope.global.chosenAddElements.selectedOutsideSlope.push(cloneAddElement);
          break;
        case 5:
          cloneAddElement.elementId = 5;
          $scope.global.chosenAddElements.selectedLouvers.push(cloneAddElement);
          break;
        case 6:
          cloneAddElement.elementId = 6;
          $scope.global.chosenAddElements.selectedInsideSlope.push(cloneAddElement);
          break;
        case 7:
          cloneAddElement.elementId = 7;
          $scope.global.chosenAddElements.selectedConnectors.push(cloneAddElement);
          break;
        case 8:
          cloneAddElement.elementId = 8;
          $scope.global.chosenAddElements.selectedFans.push(cloneAddElement);
          break;
        case 9:
          cloneAddElement.elementId = 9;
          $scope.global.chosenAddElements.selectedWindowSill.push(cloneAddElement);
          break;
        case 10:
          cloneAddElement.elementId = 10;
          $scope.global.chosenAddElements.selectedHandles.push(cloneAddElement);
          break;
        case 11:
          cloneAddElement.elementId = 11;
          $scope.global.chosenAddElements.selectedOthers.push(cloneAddElement);
          break;
      }
      if($scope.global.isAddElementListView) {
        $scope.global.isAddElement = 1;
      }
    }
    //Set Total Product Price
    $scope.setAddElementsTotalPrice();
  };

  $scope.setAddElementsTotalPrice = function() {
    $scope.global.addElementsPriceTOTAL = 0;
    for (var prop in $scope.global.chosenAddElements) {
      if (!$scope.global.chosenAddElements.hasOwnProperty(prop)) {
        continue;
      } else {
        if ($scope.global.chosenAddElements[prop].length > 0) {
          for (var elem = 0; elem < $scope.global.chosenAddElements[prop].length; elem++) {
            $scope.global.addElementsPriceTOTAL += $scope.global.chosenAddElements[prop][elem].elementQty * $scope.global.chosenAddElements[prop][elem].elementPrice;
          }
        }
      }
    }
    $scope.global.setProductPriceTOTAL();
  };

  // Select Add Element when open List View
  $scope.selectElementListView = function(typeId, elementId, clickEvent) {
    if(typeId === undefined && elementId === undefined) {
      $scope.global.isAddElement = false;
    } else if($scope.global.isAddElement === typeId+'-'+elementId) {
      $scope.global.isAddElement = 1;
    } else if($scope.global.isAddElement === false || $scope.global.isAddElement === 1) {
      var coord = $(clickEvent.target).offset();
      $scope.addElementsMenu.coordinats = {'top': coord.top-34};
      $timeout(function() {
        $scope.global.isAddElement = typeId + '-' + elementId;
      }, 500);
    } else {
      $scope.global.isAddElement = 1;
      $timeout(function() {
        var coord = $(clickEvent.target).offset();
        $scope.addElementsMenu.coordinats = {'top': coord.top-34};
      }, 500);
      $timeout(function() {
        $scope.global.isAddElement = typeId + '-' + elementId;
      }, 1000);
    }
  };

  // Show Tabs
  $scope.showFrameTabs = function() {
      $scope.global.isTabFrame = !$scope.global.isTabFrame;
  };

  // Delete AddElement from global object
  $scope.global.deleteAddElement = function(typeId, elementId) {
    switch(typeId) {
      case 1:
        $scope.global.chosenAddElements.selectedGrids.splice(elementId, 1);
        break;
      case 2:
        $scope.global.chosenAddElements.selectedVisors.splice(elementId, 1);
        break;
      case 3:
        $scope.global.chosenAddElements.selectedSpillways.splice(elementId, 1);
        break;
      case 4:
        $scope.global.chosenAddElements.selectedOutsideSlope.splice(elementId, 1);
        break;
      case 5:
        $scope.global.chosenAddElements.selectedLouvers.splice(elementId, 1);
        break;
      case 6:
        $scope.global.chosenAddElements.selectedInsideSlope.splice(elementId, 1);
        break;
      case 7:
        $scope.global.chosenAddElements.selectedConnectors.splice(elementId, 1);
        break;
      case 8:
        $scope.global.chosenAddElements.selectedFans.splice(elementId, 1);
        break;
      case 9:
        $scope.global.chosenAddElements.selectedWindowSill.splice(elementId, 1);
        break;
      case 10:
        $scope.global.chosenAddElements.selectedHandles.splice(elementId, 1);
        break;
      case 11:
        $scope.global.chosenAddElements.selectedOthers.splice(elementId, 1);
        break;
    }
    $scope.global.desactiveAddElementParameters();
    //Set Total Product Price
    $scope.setAddElementsTotalPrice();
  };

  // Close AddElements Menu
  $scope.closeAddElementsMenu = function() {
    $scope.global.isFocusedAddElement = false;
    $scope.global.isTabFrame = false;
    $scope.global.showAddElementsMenu = false;
    $scope.global.desactiveAddElementParameters();
    $timeout(function() {
      $scope.global.isAddElement = false;
      $scope.global.addElementsMenuStyle = false;
    }, $scope.addElementsMenu.DELAY_SHOW_ELEMENTS_MENU);
  };


  // Change Qty parameter
  $scope.setValueQty = function(newValue) {
    var elementId = $scope.global.currentAddElementId;
    switch($scope.global.isFocusedAddElement) {
      case 2:
        if($scope.global.chosenAddElements.selectedVisors[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.chosenAddElements.selectedVisors[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.chosenAddElements.selectedVisors[elementId].elementQty += newValue;
        }
        break;
      case 3:
        if($scope.global.chosenAddElements.selectedSpillways[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.chosenAddElements.selectedSpillways[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.chosenAddElements.selectedSpillways[elementId].elementQty += newValue;
        }
        break;
      case 5:
        if($scope.global.chosenAddElements.selectedLouvers[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.chosenAddElements.selectedLouvers[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.chosenAddElements.selectedLouvers[elementId].elementQty += newValue;
        }
        break;
      case 7:
        if($scope.global.chosenAddElements.selectedConnectors[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.chosenAddElements.selectedConnectors[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.chosenAddElements.selectedConnectors[elementId].elementQty += newValue;
        }
        break;
      case 9:
        if($scope.global.chosenAddElements.selectedWindowSill[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.chosenAddElements.selectedWindowSill[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.chosenAddElements.selectedWindowSill[elementId].elementQty += newValue;
        }
        break;
      case 10:
        if($scope.global.chosenAddElements.selectedHandles[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.chosenAddElements.selectedHandles[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.chosenAddElements.selectedHandles[elementId].elementQty += newValue;
        }
        break;
    }
    //Set Total Product Price
    $scope.setAddElementsTotalPrice();
  };

  // Close Qty Calculator
  $scope.closeQtyCaclulator = function() {
    $scope.global.desactiveAddElementParameters();
  };

  // Change Size parameter
  $scope.setValueSize = function(newValue) {
    //console.log($scope.addElementsMenu.tempSize);
    if($scope.addElementsMenu.tempSize.length == 1 && $scope.addElementsMenu.tempSize[0] === 0) {
      $scope.addElementsMenu.tempSize.length = 0;
    }

    if($scope.addElementsMenu.tempSize.length < 4) {
      if(newValue === '00'){
        $scope.addElementsMenu.tempSize.push(0, 0);
      } else {
        $scope.addElementsMenu.tempSize.push(newValue);
      }
    }
    changeElementSize();
  };
  // Delete last number
  $scope.deleteLastNumber = function() {
    $scope.addElementsMenu.tempSize.pop();
    if($scope.addElementsMenu.tempSize.length < 1) {
      $scope.addElementsMenu.tempSize.push(0);
    }
    changeElementSize();
  };
  // Close Size Calculator
  $scope.closeSizeCaclulator = function() {
    $scope.global.isWidthCalculator = false;
    $scope.addElementsMenu.tempSize.length = 0;
    $scope.global.desactiveAddElementParameters();
  };

  function changeElementSize(){
    var newElementSize = '';
    for(var numer = 0; numer < $scope.addElementsMenu.tempSize.length; numer++) {
      newElementSize += $scope.addElementsMenu.tempSize[numer].toString();
    }
    var elementId = $scope.global.currentAddElementId;

    if($scope.global.isWidthCalculator) {
      switch($scope.global.isFocusedAddElement) {
        case 2:
          $scope.global.chosenAddElements.selectedVisors[elementId].elementWidth = newElementSize;
          break;
        case 3:
          $scope.global.chosenAddElements.selectedSpillways[elementId].elementWidth = newElementSize;
          break;
        case 5:
          $scope.global.chosenAddElements.selectedLouvers[elementId].elementWidth = newElementSize;
          break;
        case 7:
          //$scope.global.chosenAddElements.selectedConnectors[elementId].elementWidth = newElementSize;
          break;
        case 9:
          $scope.global.chosenAddElements.selectedWindowSill[elementId].elementWidth = newElementSize;
          break;
      }
    } else {
      if($scope.global.isFocusedAddElement === 5) {
        $scope.global.chosenAddElements.selectedLouvers[elementId].elementHeight = newElementSize;
      }
    }
  }


  // Select Add Element Lamination
  $scope.selectAddElementColor = function(id) {
    $scope.global.isAddElementColor = id;
    var elementId = $scope.global.currentAddElementId;
    if(id === 'matt') {
      $scope.global.chosenAddElements.selectedWindowSill[elementId].elementColor = $scope.global.addElementLaminatWhiteMatt.laminationUrl;
      $scope.global.chosenAddElements.selectedWindowSill[elementId].elementColorId = 'matt';
    } else if(id === 'glossy') {
      $scope.global.chosenAddElements.selectedWindowSill[elementId].elementColor = $scope.global.addElementLaminatWhiteGlossy.laminationUrl;
      $scope.global.chosenAddElements.selectedWindowSill[elementId].elementColorId = 'glossy';
    } else {
      $scope.global.chosenAddElements.selectedWindowSill[elementId].elementColor = $scope.global.addElementLaminatColor[id].laminationUrl;
      $scope.global.chosenAddElements.selectedWindowSill[elementId].elementColorId = id;
    }
  };

  $scope.clearSelectedAddElement = function() {

    $scope.global.isAddElement = false;

  };

}]);
