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
    NavMenuServ,
    loginServ
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
        if ( GlobalStor.global.isRoomElements === 1) {
          $timeout(function() {
            $location.path("/main");
            GlobalStor.global.currOpenPage = "main";
          }, 200);
        } else {
          $timeout(function() {
            $location.path("/");
            GlobalStor.global.currOpenPage = "/";
          }, 200);
        }
      }

    function gotoSettingsPage() {
      $location.path("/settings");
    }



    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.getDeviceLanguage = loginServ.getDeviceLanguage;
    thisCtrl.switchLang = switchLang;
    thisCtrl.gotoSettingsPage = gotoSettingsPage;

  });
})();