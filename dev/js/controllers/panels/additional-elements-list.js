/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, movePanelClass, showElementWithDelay, removeClassWithDelay, addClassWithDelay */

'use strict';

BauVoiceApp.controller('AdditionalElementsListCtrl', ['$scope', 'globalData', function ($scope, globalData) {
  var $auxListContainer = $('.additional-list-container'),
      $auxListDeleteBTN = $auxListContainer.find('.aux-delete'),
      $auxListParamsBTN = $auxListContainer.find('.aux-params-but'),
      $searchInput = $auxListContainer.find('.search-input'),
      $cancelSearchBTN = $auxListContainer.find('.cancel-search'),
      $auxSearchContent = $auxListContainer.find('.aux-search-content'),
      $auxListGroup = $auxListContainer.find('.aux-list-group'),

      $viewSwitcher = $auxListContainer.find('.view-switch-tab'),
      $auxContainer = $('.auxiliaries-container');

  // Search elements
  $searchInput.click(function () {
    $cancelSearchBTN.removeClass(unvisibleClass);
    $auxSearchContent.addClass(activeClass);
  });
  $cancelSearchBTN.click(function () {
    $auxSearchContent.removeClass(activeClass);
    $(this).addClass(unvisibleClass);
  });

  //Select group
  $auxListGroup.click(function () {
    $auxListGroup.each(function() {
      $(this).removeClass(selectClass);
      $(this).find('.group-indicator').removeClass(activeClass);
    });
    $(this).addClass(selectClass);
    $(this).find('.group-indicator').addClass(activeClass);
  });

  // Delete auxiliary row
  $auxListDeleteBTN.click(function () {
    $(this).closest('.aux-list-row').remove();
  });

  //------Select parameters
  $auxListParamsBTN.click(function () {
    //deselectTabParamsBTN();
    deselectListParamsBTN();
    $(this).addClass(selectClass);

    // Activation calculators
    /*
    hideElementsTools();
    if($(this).hasClass('size-calc')){
      $sizeCalculator.addClass(activeClass);
    }
    if($(this).hasClass('qty-calc')){
      $qtyCalculator.addClass(activeClass);
    }
    */
  });

  function deselectListParamsBTN() {
    $auxListParamsBTN.each(function() {
      $(this).removeClass(selectClass);
    });
  }

  // Open additional Scheme View
  $viewSwitcher.click(function() {
    $auxListContainer.removeClass(movePanelClass);
    removeClassWithDelay($auxListContainer, activeClass, 5*STEP);
    addClassWithDelay($auxContainer, activeClass, 5*STEP);
    addClassWithDelay($auxContainer, movePanelClass, 6*STEP);
  });



  $scope.global = globalData;

  $scope.addElementsList = {
    DELAY_START: STEP,
    DELAY_SHOW_ELEMENTS_MENU: STEP * 6,
    typing: 'on'
  };


  // Close Add Elements in List View
  $scope.viewSwitching = function() {
    $scope.global.isAddElementListView = false;
  };

}]);
