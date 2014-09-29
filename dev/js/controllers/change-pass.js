/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ChangePassCtrl', ['$scope', 'localStorage', '$location', function ($scope, localStorage, $location) {

  $scope.password = {
    DELAY_START: STEP,

    isErrorPassword: false,
    typing: 'on'
  };

  localStorage.getUser(function (results) {
    if (results.status) {
      $scope.password.old = results.data.user.password;
    } else {
      console.log(results);
    }
  });

  $scope.gotoSettingsPage = function() {
    $location.path('/settings');
  };

  $scope.saveNewPassword = function() {
    if($scope.password.newPassword !== $scope.password.confirmPassword) {
      $scope.password.isErrorPassword = true;
    } else {
      $scope.password.isErrorPassword = false;
    }
    if($scope.password.newPassword == '' && $scope.password.confirmPassword == '') {
      $scope.password.isErrorPassword = true;
    }
  };
  $scope.checkError = function() {
    $scope.password.isErrorPassword = false;
  };

}]);
