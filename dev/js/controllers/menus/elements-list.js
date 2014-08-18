/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, focuseClass, showElementWithDelay, removeClassWithDelay, addClassWithDelay, createPrice */

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
      $sizeCalculator = $elementsListContainer.find('.size-calculator'),
      $qtyCalculator = $elementsListContainer.find('.qty-calculator'),

      $auxContainer = $('.auxiliaries-container'),
      $auxiliaryItem = $auxContainer.find('.auxiliary-item'),
      $auxChooseButton = $auxContainer.find('.aux-choose-but'),
      $auxParams = $auxContainer.find('.aux-params'),

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
    createPrice($price);
  });

  // Close Elements Lists
  $closeElementsMenuBTN.click(function () {
    //Close all calculators
    $sizeCalculator.removeClass(activeClass);
    $qtyCalculator.removeClass(activeClass);
    // Close Tabs
    if($frameTab.hasClass(activeClass)) {
      closeTab($('.frame-tab.active'));
      deselectTabParamsBTN();
    }
    // Close right menu
    $elementsListContainer.removeClass(activeClass);

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
    $auxParams.each(function() {
      $(this).removeClass(selectClass);
    });
    $(this).addClass(selectClass);

    // Activation calculators
    if($(this).hasClass('size-calc')){
      $qtyCalculator.removeClass(activeClass);
      $sizeCalculator.addClass(activeClass);
    }
    if($(this).hasClass('qty-calc')){
      $sizeCalculator.removeClass(activeClass);
      $qtyCalculator.addClass(activeClass);
    }
  });

  function deselectTabParamsBTN() {
    $auxTabParamsBTN.each(function() {
      $(this).removeClass(selectClass);
    });
  }
}]);
