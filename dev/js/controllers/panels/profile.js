/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('ProfileCtrl', ['$scope', 'globalData', function ($scope, globalData) {
  var $profileContainer = $('.profile-container'),
      $profileBlock = $profileContainer.find('.profile-block'),
      $profileBox = $profileContainer.find('.profile-box'),
      $profileTitle = $profileContainer.find('.title'),

      DELAY_SHOW_PROFILES = 5 * STEP,
      prof, DELAY_SHOW_PROF;

  typingTextWithDelay($profileTitle, DELAY_SHOW_PROFILES);

  for (prof = 0; prof < $profileBox.length; prof++) {
    DELAY_SHOW_PROF = DELAY_SHOW_PROFILES + prof * 200;
    showElementWithDelay($profileBox.eq(prof), DELAY_SHOW_PROF);
  }


  // Select profile
  $profileBox.click(function () {
    $profileBlock.each(function () {
      $(this).removeClass(selectClass);
    });
    $profileBox.each(function () {
      $(this).removeClass(selectClass);
    });
    $(this).closest('.profile-block').addClass(selectClass);
    $(this).addClass(selectClass);
  });


  $scope.global = globalData;

  $scope.profilePanel = {
    DELAY_SHOW_CONFIG_LIST: 5 * STEP,
    DELAY_SHOW_FOOTER: 5 * STEP,
    DELAY_TYPE_ITEM_TITLE: 10 * STEP,
    DELAY_SHOW_ORDERS: 40 * STEP,
    typing: 'on'
  };

}]);
