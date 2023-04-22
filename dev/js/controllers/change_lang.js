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
      if(GlobalStor.global.isVoiceHelper) {
        GlobalStor.global.voiceHelperLanguage = NavMenuServ.setLanguageVoiceHelper();
      }
      $timeout(function() {
        $location.path("/"+GlobalStor.global.currOpenPage);
        // GlobalStor.global.currOpenPage = "main";
      }, 500);
        // if ( GlobalStor.global.isRoomElements === 1) {
        //   $timeout(function() {
        //     $location.path("/main");
        //     GlobalStor.global.currOpenPage = "main";
        //   }, 200);
        // } else {
        //   $timeout(function() {
        //     $location.path("/");
        //     GlobalStor.global.currOpenPage = "/";
        //   }, 200);
        // }
      }

    function gotoSettingsPage() {
      $location.path("/"+GlobalStor.global.prevOpenPage);
    }



    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.getDeviceLanguage = loginServ.getDeviceLanguage;
    thisCtrl.switchLang = switchLang;
    thisCtrl.gotoSettingsPage = gotoSettingsPage;

      $("#main-frame").addClass("main-frame-mobView");
      $("#app-container").addClass("app-container-mobView");
      let obj = $("#main-frame");
      obj.css({
          "transform": "scale(1)",
          "left": "0px",
          "top": "0px",
      });
  });
})();
