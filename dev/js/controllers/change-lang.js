(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('ChangeLangCtrl', changeLangCtrl);

  function changeLangCtrl($scope, $translate, $timeout, globalConstants, localStorage, UserStor, NavMenuServ) {

    $scope.global = localStorage.storage;
    $scope.userInfo = UserStor.userInfo;
    $scope.language = {
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };

    $scope.switchLang = function (languageId) {
      $translate.use($scope.global.languages[languageId].label);
      UserStor.userInfo.langLabel = $scope.global.languages[languageId].label;
      UserStor.userInfo.langName = $scope.global.languages[languageId].name;
      //----- if Voice Helper switch on
      if($scope.global.isVoiceHelper) {
        $scope.global.voiceHelperLanguage = NavMenuServ.setLanguageVoiceHelper();
      }
      $timeout(function() {
        $scope.global.isOpenSettingsPage = false;
        $scope.global.startProgramm = false;
        $scope.global.isReturnFromDiffPage = true;
        $scope.global.gotoMainPage();
      }, 200);
    };

  }
})();