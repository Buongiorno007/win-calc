/* globals BauVoiceApp, STEP, unvisibleClass, addClassWithDelay, showElementWithDelay */

'use strict';

BauVoiceApp.controller('SchemeViewCtrl', ['$scope', function ($scope) {

  var $auxContainer = $('.auxiliaries-container'),
      $schemeDialog = $('.scheme-view-dialog'),
      $schemeInfo = $auxContainer.find('.scheme-info'),
      $closeDialog = $schemeDialog.find('.close-dialog'),
      $schemeView = $schemeDialog.find('.scheme-view'),

      showDialogClass = 'show-dialog',
      hideDialogClass = 'hide-dialog';

  // Showing Scheme View Dialog
  $schemeInfo.click(function () {
    $schemeDialog.removeClass(hideDialogClass).removeClass(unvisibleClass).addClass(showDialogClass);
    showElementWithDelay($schemeView, 5 * STEP);
  });
  // Hide Scheme View Dialog
  $closeDialog.click(function () {
    $schemeDialog.removeClass(showDialogClass).addClass(hideDialogClass);
    addClassWithDelay($schemeView, unvisibleClass, 5 * STEP);
  });

}]);
