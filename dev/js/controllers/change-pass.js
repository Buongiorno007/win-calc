/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ChangePassCtrl', ['$scope', 'localDB', 'localStorage', function ($scope, localDB, localStorage) {

  $scope.global = localStorage;

  $scope.password = {
    DELAY_START: STEP,
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
      localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"password": $scope.password.newPassword}, {"id": $scope.global.userInfo.id});
      //---- clean fields
      $scope.password.newPassword = $scope.password.confirmPassword = '';
    }

  };
  $scope.checkError = function() {
    $scope.password.isErrorPassword = false;
  };

}]);
