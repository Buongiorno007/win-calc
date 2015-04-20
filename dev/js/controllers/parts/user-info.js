(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('UserInfoCtrl', userInfoCtrl);

  function userInfoCtrl(globalConstants, localStorage, UserStor) {

    var thisCtrl = this;
    thisCtrl.global = localStorage.storage;
    thisCtrl.userInfo = UserStor.userInfo;

    thisCtrl.config = {
      DELAY_SHOW_USER_INFO: 40 * globalConstants.STEP,
      typing: 'on',
      checked: false
    };

    thisCtrl.swipeMainPage = swipeMainPage;
    thisCtrl.swipeLeft = swipeLeft;
    thisCtrl.swipeRight = swipeRight;



    //============ methods ================//

    function swipeMainPage(event) {
      //$rootScope.$broadcast('swipeMainPage', true);
      thisCtrl.global.showNavMenu = !thisCtrl.global.showNavMenu;
      thisCtrl.global.isConfigMenu = true;
      if(!thisCtrl.global.isOpenedHistoryPage) {
        thisCtrl.global.startProgramm = false;
      }
      //playSound('swip');
    }

    function swipeLeft(event) {
      if(thisCtrl.global.showNavMenu) {
        thisCtrl.global.showNavMenu = false;
        thisCtrl.global.isConfigMenu = true;
        if (!thisCtrl.global.isOpenedHistoryPage) {
          thisCtrl.global.startProgramm = false;
        }
        //playSound('swip');
      }
    }

    function swipeRight(event) {
      if(!thisCtrl.global.showNavMenu) {
        thisCtrl.global.showNavMenu = true;
        thisCtrl.global.isConfigMenu = false;
        //playSound('swip');
      }
    }


  }
})();