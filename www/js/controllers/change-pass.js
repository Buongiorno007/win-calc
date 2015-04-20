
// controllers/change-pass.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('ChangePassCtrl', changePassCtrl);

  function changePassCtrl($scope, globalConstants, localStorage, globalDB, UserStor) {

    $scope.global = localStorage.storage;
    $scope.userInfo = UserStor.userInfo;

    $scope.password = {
      DELAY_START: globalConstants.STEP,
      isErrorPassword: false,
      typing: 'on'
    };

    $scope.saveNewPassword = function() {
      if($scope.password.newPassword === '' && $scope.password.confirmPassword === '') {
        $scope.password.isErrorPassword = true;
      }
      if($scope.password.newPassword !== $scope.password.confirmPassword) {
        $scope.password.isErrorPassword = true;
      } else {
        $scope.password.isErrorPassword = false;
        UserStor.userInfo.password = $scope.password.newPassword;
        //TODO save chand in Server not in GlobalDB
        globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"password": $scope.password.newPassword}, {"id": UserStor.userInfo.id});
        //---- clean fields
        $scope.password.newPassword = $scope.password.confirmPassword = '';
      }

    };
    $scope.checkError = function() {
      $scope.password.isErrorPassword = false;
    };

  }
})();

