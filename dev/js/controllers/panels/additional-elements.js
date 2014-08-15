/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, focuseClass, typingTextByChar, showElementWithDelay, makeButtonActive, removeClassWithDelay, addClassWithDelay */

'use strict';

BauVoiceApp.controller('AdditionalElementsCtrl', ['$scope', function ($scope) {
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

      $schemeInfo = $auxContainer.find('.scheme-info'),

      $elementsListContainer = $('.elements-list-container'),
      $frameTab = $elementsListContainer.find('.frame-tab'),
      $auxTabParamsBTN = $elementsListContainer.find('.aux-params-but'),

      showElementsListClass = 'show-elements-list',
      hideElementsListClass = 'hide-elements-list',
      showTabBlockClass = 'show-tab-block',
      hideTabBlockClass = 'hide-tab-block',
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

    // Button disabled
    $auxChooseButton.each(function() {
      $auxChooseButton.removeAttr('disabled');
    });
    $(this).attr('disabled', 'disabled');

    //Show/Close Element List
    var elementsListClass = $(this).data('elements-list-style');

    if($elementsListContainer.hasClass(unvisibleClass)) {
      $elementsListContainer.removeClass().addClass('elements-list-container').addClass(elementsListClass).addClass(showElementsListClass);
    } else {

      //close tab
      if($frameTab.hasClass(activeClass)) {
        var activTab = $elementsListContainer.find('.frame-tab.active');
        var $parentBlock = activTab.closest(tabBlockClass);
        $parentBlock.removeClass(showTabBlockClass).removeClass(activeClass).addClass(hideTabBlockClass);
        removeClassWithDelay($parentBlock, hideTabBlockClass, 5*STEP);
        removeClassWithDelay(activTab, activeClass, 5*STEP);
        // deselect Tab Params buttons
        $auxTabParamsBTN.each(function() {
          $(this).removeClass(selectClass);
        });
      }

      // hide elements list
      $elementsListContainer.removeClass(showElementsListClass).addClass(hideElementsListClass);
      setTimeout(function() {
        $elementsListContainer.removeClass().addClass('elements-list-container').addClass(unvisibleClass).addClass(elementsListClass);
      }, 5 * STEP);
      removeClassWithDelay($elementsListContainer, unvisibleClass, 6 * STEP);
      addClassWithDelay($elementsListContainer, showElementsListClass, 6 * STEP);
    }



  });
  //------Select parameters
  $auxParamsBtn.click(function () {
    var selectClass = 'selected';
    $auxParams.each(function() {
      $(this).removeClass(selectClass);
    });
    $(this).closest('.aux-params').addClass(selectClass);
  });

  //  function initAuxContainer() {}
}]);
