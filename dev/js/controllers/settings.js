/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('SettingsCtrl', ['$scope', 'globalDB', 'localStorage', '$location', function ($scope, globalDB, localStorage, $location) {

  $scope.global = localStorage;

  $scope.settings = {
    DELAY_START: STEP,
    DELAY_SHOW_ICONS: STEP * 10,
    isInsertPhone: false,
    tempAddPhone: '',
    regex: /^[0-9]{1,10}$/,
    typing: 'on'
  };

  globalDB.getUser(function (results) {
    if (results.status) {

      $scope.settings.userName = results.data.user.name;
      $scope.settings.avatar = results.data.user.avatarUrl;
      $scope.settings.password = results.data.user.password;
      $scope.settings.email = results.data.user.email;
      $scope.settings.currPhone = results.data.user.currentPhone;
      $scope.settings.addPhones = results.data.user.addPhone;
      //$scope.settings.country = results.data.user.country;
      //$scope.settings.region = results.data.user.region;
      $scope.settings.city = results.data.user.city;
      $scope.settings.address = results.data.user.address;

    } else {
      console.log(results);
    }
  });

  $scope.changeSettingData = function(id) {
    $scope.settings.selectedSetting = id;
  };

  $scope.deletePhone = function(phoneId) {
    $scope.settings.addPhones.splice(phoneId, 1);
  };

  $scope.appendInputPhone = function() {
    $scope.settings.isInsertPhone = !$scope.settings.isInsertPhone;
    $scope.settings.tempAddPhone = '';
    $scope.settings.isErrorPhone = false;
  };

  $scope.addPhone = function() {
    var checkPhone = $scope.settings.regex.test($scope.settings.tempAddPhone);
    if(checkPhone) {
      $scope.settings.isInsertPhone = false;
      $scope.settings.isErrorPhone = false;
      $scope.settings.addPhones.push($scope.settings.tempAddPhone);
      $scope.settings.tempAddPhone = '';
    } else {
      $scope.settings.isErrorPhone = true;
    }
  };

  $scope.gotoPasswordPage = function() {
    $location.path('/change-pass');
  };

}]);