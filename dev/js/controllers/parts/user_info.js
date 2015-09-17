(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('UserInfoCtrl', userInfoCtrl);

  function userInfoCtrl(globalConstants, GeneralServ, GlobalStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_SHOW_USER_INFO: 40 * globalConstants.STEP,
      typing: 'on',
      checked: false
    };

    //------ clicking

    thisCtrl.swipeMainPage = swipeMainPage;
    thisCtrl.swipeLeft = swipeLeft;
    thisCtrl.swipeRight = swipeRight;



    //============ methods ================//

    function swipeMainPage(event) {
      GlobalStor.global.isNavMenu = !GlobalStor.global.isNavMenu;
      GlobalStor.global.isConfigMenu = !GlobalStor.global.isConfigMenu;
      GeneralServ.stopStartProg();
      //playSound('swip');
    }

    function swipeLeft(event) {
      if(GlobalStor.global.isNavMenu) {
        GlobalStor.global.isNavMenu = 0;
        GlobalStor.global.isConfigMenu = 1;
        GeneralServ.stopStartProg();
        //playSound('swip');
      }
    }

    function swipeRight(event) {
      if(!GlobalStor.global.isNavMenu) {
        GlobalStor.global.isNavMenu = 1;
        GlobalStor.global.isConfigMenu = 0;
        //playSound('swip');
      }
    }


  }
})();