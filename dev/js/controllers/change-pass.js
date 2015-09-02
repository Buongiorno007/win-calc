(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('ChangePassCtrl', changePassCtrl);

  function changePassCtrl($location, globalConstants, UserStor, localDB) {

    var thisCtrl = this;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      oldPassword: 0,
      newPassword: 0,
      confirmPassword: 0,
      isErrorPassword: 0,
      isErrorOldPassword: 0,
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
      if( thisCtrl.config.oldPassword && UserStor.userInfo.password == localDB.md5(thisCtrl.config.oldPassword) && thisCtrl.config.newPassword && thisCtrl.config.confirmPassword && thisCtrl.config.newPassword === thisCtrl.config.confirmPassword) {
        thisCtrl.config.isErrorPassword = 0;
        UserStor.userInfo.password = localDB.md5(thisCtrl.config.newPassword);
        //----- update password in LocalDB & Server
        localDB.updateLocalServerDBs(localDB.tablesLocalDB.user.tableName, UserStor.userInfo.id, {'password': UserStor.userInfo.password}).then(function() {
          //---- clean fields
          thisCtrl.config.newPassword = thisCtrl.config.confirmPassword = '';
          gotoSettingsPage();
        });
      } else {
        if (!thisCtrl.config.oldPassword || (UserStor.userInfo.password != localDB.md5(thisCtrl.config.oldPassword)) ) {
          thisCtrl.config.isErrorOldPassword = 1;
        } else {
          thisCtrl.config.isErrorPassword = 1;
        }
      }

    }

    function checkError() {
      thisCtrl.config.isErrorPassword = 0;
    }

    function checkErrorOld() {
      thisCtrl.config.isErrorOldPassword = 0;
    }

  }
})();
