/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('SettingsCtrl', ['$scope', 'globalDB', 'localStorage', '$location', 'localDB', function ($scope, globalDB, localStorage, $location, localDB) {

  $scope.global = localStorage;

  $scope.settings = {
    DELAY_START: STEP,
    DELAY_SHOW_ICONS: STEP * 10,
    isInsertPhone: false,
    tempAddPhone: '',
    regex: /^[0-9]{1,10}$/,
    typing: 'on'
  };
  //----- for location page
  $scope.global.isOpenSettingsPage = true;

  globalDB.getUser(function (results) {
    if (results.status) {
      $scope.settings.avatar = results.data.user.avatarUrl;
      $scope.settings.currPhone = results.data.user.currentPhone;
      $scope.settings.addPhones = results.data.user.addPhone;
      $scope.settings.address = results.data.user.address;
    } else {
      console.log(results);
    }
  });

  $scope.changeSettingData = function(id, obj) {
    $scope.settings.selectedSetting = id;
    findInput(obj.currentTarget.id);
  };

  $scope.deletePhone = function(phoneId) {
    $scope.settings.addPhones.splice(phoneId, 1);
  };

  $scope.appendInputPhone = function() {
    $scope.settings.isInsertPhone = !$scope.settings.isInsertPhone;
    $scope.settings.tempAddPhone = '';
    $scope.settings.isErrorPhone = false;
    findInputPhone();
  };

  $scope.cancelAddPhone = function() {
    $scope.settings.isInsertPhone = false;
    $scope.settings.isErrorPhone = false;
  };

  $scope.saveChanges = function(marker, newTxt) {
    if (event.which == 13) {
      $scope.saveTxtInBD(marker, newTxt);
    }
  };

  $scope.saveChangesBlur = function(marker, newTxt) {
    $scope.saveTxtInBD(marker, newTxt);
  };

  $scope.saveTxtInBD = function(marker, newTxt) {
    switch(marker) {
      case 'user-name':
        localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"name": newTxt}, {"id": $scope.global.userInfo.id});
        break;
      /*
      case 'user-address':
        localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"address": newTxt}, {"id": $scope.global.userInfo.id});
        break;
        */
      case 'user-email':
        localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"email": newTxt}, {"id": $scope.global.userInfo.id});
        break;
    }
  };


  $scope.saveChangesPhone = function() {
    if (event.which == 13) {
      var checkPhone = $scope.settings.regex.test($scope.settings.tempAddPhone);
      if(checkPhone) {
        $scope.settings.isInsertPhone = false;
        $scope.settings.isErrorPhone = false;
        $scope.settings.addPhones.push($scope.settings.tempAddPhone);
        $scope.settings.tempAddPhone = '';
      } else {
        $scope.settings.isErrorPhone = true;
      }
    }
  };

  $scope.gotoPasswordPage = function() {
    $location.path('/change-pass');
  };


  $scope.closeSettingsPage = function() {
    $scope.global.isOpenSettingsPage = false;
    $scope.global.gotoMainPage();
  };


  $scope.logOut = function() {
    //------- clearing local DB
    localDB.deleteTable($scope.global.productsTableBD);
    localDB.deleteTable($scope.global.componentsTableBD);
    localDB.deleteTable($scope.global.visorsTableBD);
    localDB.deleteTable($scope.global.windowSillsTableBD);
    localDB.deleteTable($scope.global.ordersTableBD);
    $location.path('/login');
  };

  function findInput(idElement) {
    setTimeout(function() {
      $('#'+idElement).find('input').focus();
    }, 100);
  }

  function findInputPhone() {
    setTimeout(function() {
      $('.set-input-phone').focus();
    }, 100);
  }

}]);