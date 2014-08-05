/* globals STEP, typingTextByChar, showElementWithDelay, makeButtonActive */

(function ($) {
  'use strict';

  var $auxContainer = $('.auxiliaries-container'),
      $auxGrid = $('.aux-grid'),
      $auxVisor = $('.aux-visor'),
      $auxSpillway = $('.aux-spillway'),
      $auxOutside = $('.aux-outside'),
      $auxWindowsill = $('.aux-windowsill'),
      $auxLouver = $('.aux-louver'),
      $auxInsideSlope = $('.aux-inside-slope'),
      $auxInsideSlopeTop = $('.aux-inside-slope-top'),
      $auxInsideSlopeLeft = $('.aux-inside-slope-left'),
      $auxInsideSlopeRight = $('.aux-inside-slope-right'),
      $auxConnectors = $('.aux-connectors'),
      $auxForceConnect = $('.aux-force-connect'),
      $auxBalconConnect = $('.aux-balcon-connect'),
      $auxHandle = $('.aux-handle'),
      $auxFan = $('.aux-fan'),
      $auxOthers = $('.aux-others'),
      $auxChooseButton = $('.aux-choose-but'),
      $auxLabel = $('.aux-label'),
      $auxParamsBtn = $('.aux-params-but'),

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
      DELAY_SHOW_AUX_CONNECTORS = STEP * 24,
      DELAY_SHOW_AUX_FORCECONNECT = STEP * 24,
      DELAY_SHOW_AUX_BALCONCONNECT = STEP * 25,
      DELAY_SHOW_AUX_HANDLE = STEP * 28,
      DELAY_SHOW_AUX_FAN = STEP * 31,
      DELAY_SHOW_AUX_OTHERS = STEP * 31,
      DELAY_SHOW_AUX_CHOOSEBUTTON = STEP * 50,
      DELAY_SHOW_AUX_LABEL = STEP * 50;

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
  showElementWithDelay($auxChooseButton, DELAY_SHOW_AUX_CHOOSEBUTTON);
  showElementWithDelay($auxLabel, DELAY_SHOW_AUX_LABEL);

  setTimeout(function () {
    $auxLabel.each(function () {
      typingTextByChar($(this));
    });
  }, DELAY_SHOW_AUX_LABEL);

  //------Select additional element
  // TODO: Переделать на назначение класса родителю
  $auxChooseButton.click(function () {
    var $auxTxtBox = $('.aux-txt-box'),
        $title = $(this).parent().find('.aux-title'),
        $params = $(this).find('.aux-params > .aux-params-label'),
        $more = $(this).parent().find('.aux-more');

    //change button color
    makeButtonActive.call($(this));

    $auxTxtBox.each(function () {
      $(this).children().each(function () {
        var classCheck = $(this).attr('class');

        if (classCheck.indexOf('aux-choose-but') + 1 === 0 && classCheck.indexOf('aux-label') + 1 === 0) {
          $(this).hide();
        }
      });
    });

    $(this).parent().children().each(function () {
      $(this).show();
    });

    typingTextByChar($title);

    if ($params.length > 0) {
      $params.each(function () {
        typingTextByChar(this);
      });
    }

    if ($more.length > 0) {
      typingTextByChar($more);
    }
  });

  $auxParamsBtn.click(function () {
    makeButtonActive.call($(this));
  });

  //$('#start').click(function(){
  //$('.aux-fan').delay(2500).queue( function(){
  //$(this).toggle();
  //$(this).dequeue();
  //});
  //});
})(jQuery);