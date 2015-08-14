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
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
      isErrorPassword: false,
      isErrorOldPassword: false,
      typing: 'on'
    };

    //------ clicking
    thisCtrl.saveNewPassword = saveNewPassword;
    thisCtrl.gotoSettingsPage = gotoSettingsPage;
    thisCtrl.checkError = checkError;
    thisCtrl.checkErrorOld = checkErrorOld;


    //============ methods ================//

    function gotoSettingsPage() {
      $location.path('/settings');
    }

    function saveNewPassword() {
      if( thisCtrl.config.oldPassword && UserStor.userInfo.password == globalDB.md5(thisCtrl.config.oldPassword) && thisCtrl.config.newPassword && thisCtrl.config.confirmPassword && thisCtrl.config.newPassword === thisCtrl.config.confirmPassword) {
        thisCtrl.config.isErrorPassword = false;
        UserStor.userInfo.password = globalDB.md5(thisCtrl.config.newPassword);
        //TODO save chand in Server not in GlobalDB
        globalDB.updateObjectInDB(globalDB.usersTableDBGlobal,UserStor.userInfo).then(function () {
          globalDB.syncUpdatesToServer(UserStor.userInfo.phone, UserStor.userInfo.device_code);
          //---- clean fields
          thisCtrl.config.newPassword = thisCtrl.config.confirmPassword = false;
          gotoSettingsPage();
        });
      } else {
        if (!thisCtrl.config.oldPassword || (UserStor.userInfo.password != globalDB.md5(thisCtrl.config.oldPassword))){thisCtrl.config.isErrorOldPassword = true;}
         else {thisCtrl.config.isErrorPassword = true;}
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

    function checkErrorOld() {
      thisCtrl.config.isErrorOldPassword = false;
    }

  }
})();
