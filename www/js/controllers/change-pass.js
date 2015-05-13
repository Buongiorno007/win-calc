
// controllers/change-pass.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('ChangePassCtrl', changePassCtrl);

  function changePassCtrl($location, globalConstants, UserStor, globalDB) {

    var thisCtrl = this;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      newPassword: false,
      confirmPassword: false,
      isErrorPassword: false,
      typing: 'on'
    };

    //------ clicking
    thisCtrl.saveNewPassword = saveNewPassword;
    thisCtrl.gotoSettingsPage = gotoSettingsPage;
    thisCtrl.checkError = checkError;


    //============ methods ================//

    function gotoSettingsPage() {
      $location.path('/settings');
    }

    function saveNewPassword() {
      if(thisCtrl.config.newPassword && thisCtrl.config.confirmPassword && thisCtrl.config.newPassword === thisCtrl.config.confirmPassword) {
        thisCtrl.config.isErrorPassword = false;
        UserStor.userInfo.password = thisCtrl.config.newPassword;
        //TODO save chand in Server not in GlobalDB
        globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"password": thisCtrl.config.newPassword}, {"id": UserStor.userInfo.id});
        //---- clean fields
        thisCtrl.config.newPassword = thisCtrl.config.confirmPassword = false;
      } else {
        thisCtrl.config.isErrorPassword = true;
      }

//      if(thisCtrl.config.newPassword === '' && thisCtrl.config.confirmPassword === '') {
//        thisCtrl.config.isErrorPassword = true;
//      }
//      if(thisCtrl.config.newPassword !== thisCtrl.config.confirmPassword) {
//        thisCtrl.config.isErrorPassword = true;
//      } else {
//        $scope.password.isErrorPassword = false;
//        UserStor.userInfo.password = $scope.password.newPassword;
//        //TODO save chand in Server not in GlobalDB
//        globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"password": $scope.password.newPassword}, {"id": UserStor.userInfo.id});
//        //---- clean fields
//        $scope.password.newPassword = $scope.password.confirmPassword = '';
//      }

    }

    function checkError() {
      thisCtrl.config.isErrorPassword = false;
    }

  }
})();

