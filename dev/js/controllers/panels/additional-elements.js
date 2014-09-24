/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, focuseClass, movePanelClass*/

'use strict';

BauVoiceApp.controller('AdditionalElementsCtrl', ['$scope', 'globalData', 'constructService', '$timeout', function ($scope, globalData, constructService, $timeout) {
  var $auxContainer = $('.auxiliaries-container'),
      $auxItem = $auxContainer.find('.auxiliary-item'),
      $auxGrid = $auxContainer.find('.aux-grid'),
      $auxVisor = $auxContainer.find('.aux-visor'),
      $auxSpillway = $auxContainer.find('.aux-spillway'),
      $auxOutside = $auxContainer.find('.aux-outside'),
      $auxWindowsill = $auxContainer.find('.aux-windowsill'),
      $auxLouver = $auxContainer.find('.aux-louver'),
      $auxInsideSlope = $auxContainer.find('.aux-inside'),
      $auxInsideSlopeTop = $auxContainer.find('.aux-inside-top'),
      $auxInsideSlopeLeft = $auxContainer.find('.aux-inside-left'),
      $auxInsideSlopeRight = $auxContainer.find('.aux-inside-right'),
      $auxConnectors = $auxContainer.find('.aux-connectors'),
      $auxForceConnect = $auxContainer.find('.aux-force-connect'),
      $auxBalconConnect = $auxContainer.find('.aux-balcon-connect'),
      $auxHandle = $auxContainer.find('.aux-handle'),
      $auxFan = $auxContainer.find('.aux-fan'),
      $auxOthers = $auxContainer.find('.aux-others'),

      $auxChoosenBlock = $auxContainer.find('.choose-block'),
      $auxChooseButton = $auxContainer.find('.aux-choose-but'),
      $auxTitle = $auxContainer.find('.aux-title'),
      $auxLabel = $auxContainer.find('.aux-label'),
      $auxParams = $auxContainer.find('.aux-params'),
      $auxParamsBtn = $auxContainer.find('.aux-params-but'),
      $auxParamsLabel = $auxContainer.find('.aux-params-label'),
      $auxMore = $auxContainer.find('.aux-more'),
      $auxColor = $auxContainer.find('.aux-color'),

      $schemeInfo = $auxContainer.find('.scheme-info'),
      $viewSwitcher = $auxContainer.find('.view-switch-tab'),
      $auxListContainer = $('.additional-list-container'),

      $elementsListContainer = $('.elements-list-container'),
      $frameTab = $elementsListContainer.find('.frame-tab'),
      $auxTabParamsBTN = $elementsListContainer.find('.aux-params-but'),
      $elementsTools = $elementsListContainer.find('.elements-tools'),
      $sizeCalculator = $elementsListContainer.find('.size-calculator'),
      $qtyCalculator = $elementsListContainer.find('.qty-calculator'),
      $colorSelector = $elementsListContainer.find('.color-selector'),

      tabBlockClass = '.tab-block',

      DELAY_SHOW_AUX_CONTAINER = STEP * 4,
      DELAY_SHOW_AUX_GRID = STEP * 5,
      DELAY_SHOW_AUX_VISOR = STEP * 6,
      DELAY_SHOW_AUX_SPILLWAY = STEP * 6,
      DELAY_SHOW_AUX_OUTSIDE = STEP * 10,
      DELAY_SHOW_AUX_WINDOWSILL = STEP * 13,
      DELAY_SHOW_AUX_LOUVER = STEP * 15,
      DELAY_SHOW_AUX_INSIDESLOPE = STEP * 20,
      DELAY_SHOW_AUX_INSIDESLOPETOP = STEP * 20,
      DELAY_SHOW_AUX_INSIDESLOPELEFT = STEP * 21,
      DELAY_SHOW_AUX_INSIDESLOPERIGHT = STEP * 22,
      DELAY_SHOW_AUX_CONNECTORS = STEP * 50,
      DELAY_SHOW_AUX_FORCECONNECT = STEP * 50,
      DELAY_SHOW_AUX_BALCONCONNECT = STEP * 70,
      DELAY_SHOW_AUX_HANDLE = STEP * 28,
      DELAY_SHOW_AUX_FAN = STEP * 31,
      DELAY_SHOW_AUX_OTHERS = STEP * 31,
      DELAY_SHOW_AUX_CHOOSEBUTTON = STEP * 80,
      DELAY_SHOW_AUX_LABEL = STEP * 50,
      DELAY_SHOW_SCHEME_ICON = STEP * 80;


/*
  //  showElementWithDelay($auxContainer, DELAY_SHOW_AUX_CONTAINER);
  showElementWithDelay($auxGrid, DELAY_SHOW_AUX_GRID);
  showElementWithDelay($auxVisor, DELAY_SHOW_AUX_VISOR);
  showElementWithDelay($auxSpillway, DELAY_SHOW_AUX_SPILLWAY);
  showElementWithDelay($auxOutside, DELAY_SHOW_AUX_OUTSIDE);
  showElementWithDelay($auxWindowsill, DELAY_SHOW_AUX_WINDOWSILL);
  showElementWithDelay($auxLouver, DELAY_SHOW_AUX_LOUVER);
  showElementWithDelay($auxInsideSlope, DELAY_SHOW_AUX_INSIDESLOPE);
  showElementWithDelay($auxInsideSlopeTop, DELAY_SHOW_AUX_INSIDESLOPETOP);
  showElementWithDelay($auxInsideSlopeLeft, DELAY_SHOW_AUX_INSIDESLOPELEFT);
  showElementWithDelay($auxInsideSlopeRight, DELAY_SHOW_AUX_INSIDESLOPERIGHT);
  showElementWithDelay($auxConnectors, DELAY_SHOW_AUX_CONNECTORS);
  showElementWithDelay($auxForceConnect, DELAY_SHOW_AUX_FORCECONNECT);
  showElementWithDelay($auxBalconConnect, DELAY_SHOW_AUX_BALCONCONNECT);
  showElementWithDelay($auxHandle, DELAY_SHOW_AUX_HANDLE);
  showElementWithDelay($auxFan, DELAY_SHOW_AUX_FAN);
  showElementWithDelay($auxOthers, DELAY_SHOW_AUX_OTHERS);
  showElementWithDelay($auxChoosenBlock, DELAY_SHOW_AUX_CHOOSEBUTTON);
  showElementWithDelay($schemeInfo, DELAY_SHOW_SCHEME_ICON);

  setTimeout(function () {
    $auxLabel.each(function () {
      typingTextByChar($(this));
    });

    $auxTitle.each(function () {
      typingTextByChar($(this));
    });

    $auxParamsLabel.each(function () {
      typingTextByChar($(this));
    });

    $auxMore.each(function () {
      typingTextByChar($(this));
    });

  }, DELAY_SHOW_AUX_LABEL);


  //------Select additional element
  $auxChooseButton.click(function () {
    $auxItem.each(function() {
      $(this).removeClass(focuseClass);
    });
    $(this).closest('.auxiliary-item').addClass(focuseClass);
    $(this).closest('.aux-txt-box').find('.selected-block').removeClass('unvisible');
    deselectParamsBTN();

    // Button disabled
    $auxChooseButton.each(function() {
      $auxChooseButton.removeAttr('disabled');
    });
    $(this).attr('disabled', 'disabled');

    //Show/Close Element List
    var elementsListClass = $(this).data('elements-list-style');

    if(!$elementsListContainer.hasClass(activeClass)) {
      $elementsListContainer.removeClass().addClass('elements-list-container').addClass(elementsListClass).addClass(activeClass);
    } else {

      //close tab
      if($frameTab.hasClass(activeClass)) {
        var activTab = $elementsListContainer.find('.frame-tab.active');
        var $parentBlock = activTab.closest(tabBlockClass);
        $parentBlock.removeClass(activeClass);
        removeClassWithDelay(activTab, activeClass, 5*STEP);

        // deselect Tab Params buttons
        deselectTabParamsBTN();
      }

      //Close all calculators and color selector
      hideElementsTools();
      // hide elements list
      $elementsListContainer.removeClass(activeClass);
      setTimeout(function() {
        $elementsListContainer.removeClass().addClass('elements-list-container').addClass(elementsListClass);
      }, 5 * STEP);
      addClassWithDelay($elementsListContainer, activeClass, 6 * STEP);
    }



  });

  //------Select parameters
  $auxParamsBtn.click(function () {
    deselectTabParamsBTN();
    deselectParamsBTN();
    $(this).closest('.aux-params').addClass(selectClass);

    // Activation calculators
    hideElementsTools();
    if($(this).hasClass('size-calc')){
      $sizeCalculator.addClass(activeClass);
    }
    if($(this).hasClass('qty-calc')){
      $qtyCalculator.addClass(activeClass);
    }
  });

  // click on color
  $auxColor.click(function() {
    $(this).addClass('aux_big_but').addClass(activeClass);
    deselectParamsBTN();
    hideElementsTools();
    $colorSelector.addClass(activeClass);
  });

  function hideElementsTools() {
    $elementsTools.each(function() {
      $(this).removeClass(activeClass);
    });
  }

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
  */
  // Open additional List View
  $viewSwitcher.click(function() {
    $auxContainer.removeClass(movePanelClass);
    removeClassWithDelay($auxContainer, activeClass, 5*STEP);
    //$auxListContainer.addClass(activeClass);
    addClassWithDelay($auxListContainer, activeClass, 5*STEP);
    addClassWithDelay($auxListContainer, movePanelClass, 6*STEP);
  });



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
  }
}]);
