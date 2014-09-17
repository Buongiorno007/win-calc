/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('TemplateSelectorCtrl', ['$scope', 'globalData', function ($scope, globalData) {
  var $templateContainer = $('.template-container'),
      $templateTitle = $templateContainer.find('.template-title'),
      $templateDescr = $templateContainer.find('.template-discr'),
      $tempEditBTN = $templateContainer.find('.template-edit'),
      $tempDefaultBTN = $templateContainer.find('.template-default'),
      $tempOtherIMG = $templateContainer.find('.other-template-img'),

      DELAY_SHOW_CONTENT = 5 * STEP;

  showElementWithDelay($templateTitle, DELAY_SHOW_CONTENT);
  typingTextWithDelay($templateDescr, DELAY_SHOW_CONTENT);
  showElementWithDelay($tempEditBTN, 2 * DELAY_SHOW_CONTENT);
  showElementWithDelay($tempDefaultBTN, 2 * DELAY_SHOW_CONTENT);
  showElementWithDelay($tempOtherIMG, 2 * DELAY_SHOW_CONTENT);

  // click on Buttons
  $templateTitle.click(function () {
    $(this).toggleClass(selectClass);
  });



  $scope.global = globalData;

  $scope.templatePanel = {
    DELAY_SHOW_CONFIG_LIST: 5 * STEP,
    DELAY_SHOW_FOOTER: 5 * STEP,
    DELAY_TYPE_ITEM_TITLE: 10 * STEP,
    DELAY_SHOW_ORDERS: 40 * STEP,
    typing: 'on'
  };

}]);