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

      $auxContainer = $('.auxiliaries-container'),
      $auxiliaryItem = $auxContainer.find('.auxiliary-item'),
      $auxChooseButton = $auxContainer.find('.aux-choose-but'),

      showElementsListClass = 'show-elements-list',
      hideElementsListClass = 'hide-elements-list',
      showTabBlockClass = 'show-tab-block',
      hideTabBlockClass = 'hide-tab-block',
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
    // Close Tabs
    if($frameTab.hasClass(activeClass)) {
      closeTab($('.frame-tab.active'));
      deselectTabParamsBTN();
    }
    // Close right menu
    $elementsListContainer.removeClass(showElementsListClass).addClass(hideElementsListClass);
    addClassWithDelay($elementsListContainer, unvisibleClass, DELAY_HIDE_LIST);

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
    $parentBlock.addClass(showTabBlockClass);
    addClassWithDelay($parentBlock, activeClass, 5.2*STEP);
  }
  function closeTab(tab) {
    var $parentBlock = $(tab).closest(tabBlockClass);
    $parentBlock.removeClass(showTabBlockClass).removeClass(activeClass).addClass(hideTabBlockClass);
    removeClassWithDelay($parentBlock, hideTabBlockClass, 5*STEP);
    removeClassWithDelay($(tab), activeClass, 5*STEP);
  }

  // Delete auxiliary row in tabs
  $auxTabDeleteBTN.click(function () {
    $(this).closest('.tab-aux-row').remove();
  });


  //------Select parameters
  $auxTabParamsBTN.click(function () {
    deselectTabParamsBTN();
    $(this).addClass(selectClass);
  });

  function deselectTabParamsBTN() {
    $auxTabParamsBTN.each(function() {
      $(this).removeClass(selectClass);
    });
  }
}]);
