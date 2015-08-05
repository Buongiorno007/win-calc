(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('UserInfoCtrl', userInfoCtrl);

  function userInfoCtrl(globalConstants, GeneralServ, GlobalStor, UserStor, MainServ) {

    var thisCtrl = this;
    thisCtrl.U = UserStor;
    this.showNewCalculation = MainServ.prepareMainPage;

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
        GlobalStor.global.isNavMenu = false;
        GlobalStor.global.isConfigMenu = true;
        GeneralServ.stopStartProg();
        //playSound('swip');
      }
    }

    function swipeRight(event) {
      if(!GlobalStor.global.isNavMenu) {
        GlobalStor.global.isNavMenu = true;
        GlobalStor.global.isConfigMenu = false;
        //playSound('swip');
      }
    }


  }
})();