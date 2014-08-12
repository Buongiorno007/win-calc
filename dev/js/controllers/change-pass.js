/* globals BauVoiceApp, STEP, typingTextByChar, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('ChangePassCtrl', ['$scope', function ($scope) {
  var $pswPage = $('.password-page'),
      $pswTitle = $pswPage.find('.title'),
      $pswList = $pswPage.find('.list'),
      $pswLabel = $pswPage.find('.psw-label'),
      $pswData = $pswPage.find('.psw-data'),

      DELAY_SHOW_PSW = 10 * STEP;

  typingTextByChar($pswTitle);
  showElementWithDelay($pswList, DELAY_SHOW_PSW);
  typingTextWithDelay($pswLabel, DELAY_SHOW_PSW);
  typingTextWithDelay($pswData, DELAY_SHOW_PSW);
}]);
