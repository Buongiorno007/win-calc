(function(){
  'use strict';

  angular
    .module('MainModule')
    .controller('UserInfoCtrl', userInfoCtrl);

  userInfoCtrl.$inject = ['localStorage', 'globalConstants'];

  function userInfoCtrl(localStorage, globalConstants) {

    var thisCtrl = this;
    thisCtrl.global = localStorage;

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

/*
 $rootScope.$on('swipeMainPage', function() {
 $scope.userInfo.isConfigMenuShow = !$scope.userInfo.isConfigMenuShow;
 });

 $scope.changeTyping = function () {
 if ($scope.userInfo.checked) {
 $scope.userInfo.typing = 'off';
 } else {
 $scope.userInfo.typing = 'on';
 }
 };
 */