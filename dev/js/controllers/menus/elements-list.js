/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, focuseClass, showElementWithDelay, removeClassWithDelay, addClassWithDelay, createPrice, hideElementsTools */

'use strict';

BauVoiceApp.controller('ElementsListCtrl', ['$scope', function ($scope) {
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
    $elementsListItem.each(function () {
      $(this).removeClass(activeClass);
    });
    $(this).addClass(activeClass);

    // show element price
    $priceElement.removeClass(unvisibleClass);
    //createPrice($price);

    // update additional element
    $auxContainer.find('.'+focuseClass).removeClass(focuseClass).addClass(selectClass);

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
}]);
