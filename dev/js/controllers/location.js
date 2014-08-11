/* globals BauVoiceApp, STEP, typingTextByChar, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('LocationCtrl', ['$scope', function ($scope) {
  var $locationPage = $('.location-page'),
      $locCurr = $locationPage.find('.location-current'),
      $locList = $locationPage.find('.list'),
      $locLabel = $locationPage.find('.location-label'),


      DELAY_SHOW_LOC = 10 * STEP;

  typingTextByChar($locCurr);
  showElementWithDelay($locList, DELAY_SHOW_LOC);
  typingTextWithDelay($locLabel, DELAY_SHOW_LOC);
}]);