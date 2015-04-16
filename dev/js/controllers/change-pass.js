(function(){
  'use strict';

  angular
    .module('SettingsModule')
    .controller('ChangePassCtrl', changePassCtrl);

  changePassCtrl.$inject = ['$scope', 'globalConstants', 'localStorage', 'localDB'];

  function changePassCtrl($scope, globalConstants, localStorage, globalDB) {

    $scope.global = localStorage;

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
        $scope.global.userInfo.password = $scope.password.newPassword;
        globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"password": $scope.password.newPassword}, {"id": $scope.global.userInfo.id});
        //---- clean fields
        $scope.password.newPassword = $scope.password.confirmPassword = '';
      }

    };
    $scope.checkError = function() {
      $scope.password.isErrorPassword = false;
    };

  }
})();
