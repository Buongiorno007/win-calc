
// controllers/change-lang.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ChangeLangCtrl', ['$scope', 'localStorage', '$translate', '$timeout', function ($scope, localStorage, $translate, $timeout) {

  $scope.global = localStorage;

  $scope.language = {
    DELAY_START: STEP,
    typing: 'on'
  };

  $scope.switchLang = function (languageId) {
    $translate.use($scope.global.languages[languageId].label);
    $scope.global.userInfo.langLabel = $scope.global.languages[languageId].label;
    $scope.global.userInfo.langName = $scope.global.languages[languageId].name;
    $timeout(function() {
      $scope.global.isOpenSettingsPage = false;
      $scope.global.startProgramm = false;
      $scope.global.isReturnFromDiffPage = true;
      $scope.global.gotoMainPage();
    }, 200);
  };

}]);
