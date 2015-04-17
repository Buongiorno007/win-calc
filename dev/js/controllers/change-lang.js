(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('ChangeLangCtrl', changeLangCtrl);

  function changeLangCtrl($scope, $translate, $timeout, globalConstants, localStorage) {

    $scope.global = localStorage;

    $scope.language = {
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };

    $scope.switchLang = function (languageId) {
      $translate.use($scope.global.languages[languageId].label);
      $scope.global.userInfo.langLabel = $scope.global.languages[languageId].label;
      $scope.global.userInfo.langName = $scope.global.languages[languageId].name;
      $scope.global.setLanguageVoiceHelper($scope.global.userInfo.langLabel);
      $timeout(function() {
        $scope.global.isOpenSettingsPage = false;
        $scope.global.startProgramm = false;
        $scope.global.isReturnFromDiffPage = true;
        $scope.global.gotoMainPage();
      }, 200);
    };

  }
})();