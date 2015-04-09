(function(){
  'use strict';

  angular
    .module('SettingsModule')
    .controller('ChangeLangCtrl', changeLangCtrl);

  changeLangCtrl.$inject = ['$scope', 'globalConstants', 'localStorage', '$translate', '$timeout'];

  function changeLangCtrl($scope, globalConstants, localStorage, $translate, $timeout) {

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