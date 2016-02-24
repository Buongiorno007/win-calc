(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('SettingsModule')
    .controller('ChangeLangCtrl',

  function(
    $location,
    $translate,
    $timeout,
    globalConstants,
    GlobalStor,
    UserStor,
    NavMenuServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };




    /**============ METHODS ================*/

    function switchLang(languageId) {
      $translate.use(globalConstants.languages[languageId].label);
      UserStor.userInfo.langLabel = globalConstants.languages[languageId].label;
      UserStor.userInfo.langName = globalConstants.languages[languageId].name;
      //----- if Voice Helper switch on
      if(GlobalStor.global.isVoiceHelper) {
        GlobalStor.global.voiceHelperLanguage = NavMenuServ.setLanguageVoiceHelper();
      }
      $timeout(function() {
        $location.path('/main');
      }, 200);
    }

    function gotoSettingsPage() {
      $location.path('/settings');
    }



    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.switchLang = switchLang;
    thisCtrl.gotoSettingsPage = gotoSettingsPage;

  });
})();