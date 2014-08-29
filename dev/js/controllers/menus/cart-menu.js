/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, movePanelClass, typingTextByChar, showElementWithDelay, removeClassWithDelay, addClassWithDelay, initTemplateContainer, initProfileContainer, initGlassContainer, initHardwareContainer, initLaminationContainer, initAuxContainer */

'use strict';

BauVoiceApp.controller('CartMenuCtrl', ['$scope', function ($scope) {
  var $cartMenu = $('.cart-menu'),
      $calendar = $cartMenu.find('.calendar-box');

  $calendar.pickmeup({
    flat	: true
  });

}]);