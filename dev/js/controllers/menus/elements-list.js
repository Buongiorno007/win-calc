/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, focuseClass, showElementWithDelay, removeClassWithDelay, addClassWithDelay, createPrice, hideElementsTools */

'use strict';

BauVoiceApp.controller('ElementsListCtrl', ['$scope', 'globalData', '$timeout', function ($scope, globalData, $timeout) {
  var $elementsListContainer = $('.elements-list-container'),
      $closeElementsMenuBTN = $elementsListContainer.find('.close-elements-menu'),
      $elementsListItem = $elementsListContainer.find('.item'),
      $frameTab = $elementsListContainer.find('.frame-tab'),
      $auxTabDeleteBTN = $elementsListContainer.find('.aux-delete'),
      $auxTabParamsBTN = $elementsListContainer.find('.aux-params-but'),
      $priceElement = $elementsListContainer.find('.price-element'),
      $price = $elementsListContainer.find('#price'),
      $elementsTools = $elementsListContainer.find('.elements-tools'),
      $sizeCalculator = $elementsListContainer.find('.size-calculator'),
      $qtyCalculator = $elementsListContainer.find('.qty-calculator'),
      $auxColor = $elementsListContainer.find('.color-img'),
      $calculatorEqualBTN = $elementsListContainer.find('.calc-equal'),

      $auxListItem = $elementsListContainer.find('.aux-list-item'),
      $auxListRow = $elementsListContainer.find('.aux-list-row'),

      $auxContainer = $('.auxiliaries-container'),
      $auxiliaryItem = $auxContainer.find('.auxiliary-item'),
      $auxChooseButton = $auxContainer.find('.aux-choose-but'),
      $auxParams = $auxContainer.find('.aux-params'),

      $auxListContainer = $('.additional-list-container'),

      tabBlockClass = '.tab-block',

      DELAY_HIDE_LIST = 5 * STEP;

  // Click on Elements Lists
  $elementsListItem.click(function () {
    /*
    $elementsListItem.each(function () {
      $(this).removeClass(activeClass);
    });
    $(this).addClass(activeClass);

    // show element price
    $priceElement.removeClass(unvisibleClass);
    //createPrice($price);
     */
    // update additional element
    //$auxContainer.find('.'+focuseClass).removeClass(focuseClass).addClass(selectClass);

    // Open element if additional List View ia active
    if($auxListContainer.hasClass(activeClass)) {
      $auxListRow.each(function() {
        $(this).addClass(unvisibleClass);
      });
      $auxListItem.each(function() {
        $(this).removeClass(selectClass);
      });
      var currListItem = $(this).find('.aux-list-item');
      currListItem.addClass(selectClass);
      removeClassWithDelay(currListItem.find('.aux-list-row'), unvisibleClass, 5*STEP);
    }
  });
/*
  // Close Elements Lists
  $closeElementsMenuBTN.click(function () {
    //Close all calculators and color selector
    hideElementsTools();
    // Close Tabs
    if($frameTab.hasClass(activeClass)) {
      closeTab($('.frame-tab.active'));
      deselectTabParamsBTN();
    }
    // Close right menu
    $elementsListContainer.removeClass(activeClass);
    // deselect all parameters buttons
    deselectParamsBTN();
    // Choose Buttons deactivation
    $auxChooseButton.removeAttr('disabled');
    $auxiliaryItem.removeClass(focuseClass);
  });


  // Click on Elements Lists Tabs
    $frameTab.click(function () {
      if($frameTab.hasClass(activeClass) && !$(this).hasClass(activeClass)) {
        closeTab($('.frame-tab.active'));
        deselectTabParamsBTN();
        openTab($(this));
      } else if($(this).hasClass(activeClass)) {
        closeTab($(this));
        deselectTabParamsBTN();
      } else {
        openTab($(this));
      }
  });

  function openTab(tab) {
    var $parentBlock = $(tab).closest(tabBlockClass);
    $(tab).addClass(activeClass);
    $parentBlock.addClass(activeClass);
  }
  function closeTab(tab) {
    var $parentBlock = $(tab).closest(tabBlockClass);
    $parentBlock.removeClass(activeClass);
    $(tab).removeClass(activeClass);
  }

  // Delete auxiliary row in tabs
  $auxTabDeleteBTN.click(function () {
    $(this).closest('.tab-aux-row').remove();
  });


  //------Select parameters

  $auxTabParamsBTN.click(function () {
    deselectTabParamsBTN();
    deselectParamsBTN();
    $(this).addClass(selectClass);

    // Activation calculators
    hideElementsTools();
    if($(this).hasClass('size-calc')){
      $sizeCalculator.addClass(activeClass);
    }
    if($(this).hasClass('qty-calc')){
      $qtyCalculator.addClass(activeClass);
    }
  });

  // Click on Calculator Equal Button
  $calculatorEqualBTN.click(function () {
    hideElementsTools();
  });

  // Select colors
  $auxColor.click(function () {
    $auxColor.each(function() {
      $(this).removeClass(selectClass);
    });
    $(this).addClass(selectClass);
  });

  function deselectParamsBTN() {
    $auxParams.each(function() {
      $(this).removeClass(selectClass);
    });
  }

  function deselectTabParamsBTN() {
    $auxTabParamsBTN.each(function() {
      $(this).removeClass(selectClass);
    });
  }

  function hideElementsTools() {
    $elementsTools.each(function() {
      $(this).removeClass(activeClass);
    });
  }
 */

  var sourceAddElement, cloneAddElement;

  $scope.global = globalData;

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

      // show element price
      $scope.addElementsMenu.isAddElementPrice = true;
      //$scope.price = $scope.global.addElementsList[typeId][elementId].elementPrice;

      sourceAddElement = $scope.global.addElementsList[typeId][elementId];
      cloneAddElement = $.extend(true, {}, sourceAddElement);

      switch($scope.global.isFocusedAddElement) {
        case 1:
          $scope.global.chosenAddElements.selectedGrids.push(cloneAddElement);
          break;
        case 2:
          $scope.global.chosenAddElements.selectedVisors.push(cloneAddElement);
          break;
        case 3:
          $scope.global.chosenAddElements.selectedSpillways.push(cloneAddElement);
          break;
        case 4:
          $scope.global.chosenAddElements.selectedOutsideSlope.push(cloneAddElement);
          break;
        case 5:
          $scope.global.chosenAddElements.selectedLouvers.push(cloneAddElement);
          break;
        case 6:
          $scope.global.chosenAddElements.selectedInsideSlope.push(cloneAddElement);
          break;
        case 7:
          $scope.global.chosenAddElements.selectedConnectors.push(cloneAddElement);
          break;
        case 8:
          $scope.global.chosenAddElements.selectedFans.push(cloneAddElement);
          break;
        case 9:
          $scope.global.chosenAddElements.selectedWindowSill.push(cloneAddElement);
          break;
        case 10:
          $scope.global.chosenAddElements.selectedHandles.push(cloneAddElement);
          break;
        case 11:
          $scope.global.chosenAddElements.selectedOthers.push(cloneAddElement);
          break;
      }

    }
  };

  // Show Tabs
  $scope.showFrameTabs = function(id) {
    if($scope.global.isTabFrame === id) {
      $scope.global.isTabFrame = false;
    } else {
      $scope.global.isTabFrame = id;
    }
  };

  // Delete AddElement in Tabs
  $scope.deleteAddElement = function(elementId) {
    switch($scope.global.isFocusedAddElement) {
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
  }

}]);
