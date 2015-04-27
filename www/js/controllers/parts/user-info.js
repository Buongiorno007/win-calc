
// controllers/parts/user-info.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('UserInfoCtrl', userInfoCtrl);

  function userInfoCtrl(globalConstants, GlobalStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.userInfo = UserStor.userInfo;

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
      thisCtrl.global.isNavMenu = !thisCtrl.global.isNavMenu;
      thisCtrl.global.isConfigMenu = true;
      if(!thisCtrl.global.isOpenedHistoryPage) {
        thisCtrl.global.startProgramm = false;
      }
      //playSound('swip');
    }

    function swipeLeft(event) {
      if(thisCtrl.global.isNavMenu) {
        thisCtrl.global.isNavMenu = false;
        thisCtrl.global.isConfigMenu = true;
        if (!thisCtrl.global.isOpenedHistoryPage) {
          thisCtrl.global.startProgramm = false;
        }
        //playSound('swip');
      }
    }

    function swipeRight(event) {
      if(!thisCtrl.global.isNavMenu) {
        thisCtrl.global.isNavMenu = true;
        thisCtrl.global.isConfigMenu = false;
        //playSound('swip');
      }
    }


  }
})();
