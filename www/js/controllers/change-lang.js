
// controllers/change-lang.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('ChangeLangCtrl', changeLangCtrl);

  function changeLangCtrl($location, $translate, $timeout, globalConstants, GlobalStor, UserStor, NavMenuServ) {

    var thisCtrl = this;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.userInfo = UserStor.userInfo;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };

    //------ clicking
    thisCtrl.switchLang = switchLang;


    //============ methods ================//

    function switchLang(languageId) {
      $translate.use(globalConstants.languages[languageId].label);
      UserStor.userInfo.langLabel = globalConstants.languages[languageId].label;
      UserStor.userInfo.langName = globalConstants.languages[languageId].name;
      //----- if Voice Helper switch on
      if(GlobalStor.global.isVoiceHelper) {
        GlobalStor.global.voiceHelperLanguage = NavMenuServ.setLanguageVoiceHelper();
      }
      $timeout(function() {
        //$scope.global.isOpenSettingsPage = false;
        //$scope.global.startProgramm = false;
        //$scope.global.isReturnFromDiffPage = true;
        $location.path('/main');
      }, 200);
    }

  }
})();
