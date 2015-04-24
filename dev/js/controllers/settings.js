(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('SettingsCtrl', settingsCtrl);

  function settingsCtrl($scope, $location, globalConstants, globalDB, localStorage, localDB, UserStor, ProductStor, OrderStor) {

    $scope.global = localStorage.storage;
    $scope.userInfo = UserStor.userInfo;

    $scope.settings = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ICONS: globalConstants.STEP * 10,
      isInsertPhone: false,
      isEmailError: false,
      addPhones: [],
      tempAddPhone: '',
      regex: /^[0-9]{1,10}$/,
      mailReg: globalConstants.REG_MAIL,
      typing: 'on'
    };
    $scope.global.startProgramm = false;
    //----- for location page
    $scope.global.isOpenSettingsPage = true;

    //----- parse additional phones
    if(UserStor.userInfo.contact_name !== '') {
      $scope.settings.addPhones = UserStor.userInfo.contact_name.split(',');
    }

    //----- change avatar
    $scope.changeAvatar = function() {
      navigator.camera.getPicture( function( data ) {
        $scope.global.AvatarUrl = 'data:image/jpeg;base64,' + data;
      }, function( error ) {
        console.log( 'Error upload user avatar' + error );
        console.log($scope.global.AvatarUrl);
      }, {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        targetWidth: 76,
        targetHeight: 76,
        mediaType: Camera.MediaType.PICTURE
      } );
    };

    $scope.changeSettingData = function(id, obj) {
      $scope.settings.selectedSetting = id;
      findInput(obj.currentTarget.id);
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
          globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"name": newTxt}, {"id": UserStor.userInfo.id});
          break;
        case 'user-address':
          globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"city_phone": newTxt}, {"id": UserStor.userInfo.id}); //TODO создать поле в базе данных
          break;
        case 'user-email':
          var checkEmail = $scope.settings.mailReg.test(newTxt);
          if(checkEmail) {
            $scope.settings.isEmailError = false;
            globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"email": newTxt}, {"id": UserStor.userInfo.id});
          } else {
            $scope.settings.isEmailError = true;
          }
          break;
      }
    };

    $scope.changeEmail = function() {
      $scope.settings.isEmailError = false;
    };

    $scope.saveChangesPhone = function() {
      if (event.which == 13) {
        var checkPhone = $scope.settings.regex.test($scope.settings.tempAddPhone);
        if(checkPhone) {
          $scope.settings.isInsertPhone = false;
          $scope.settings.isErrorPhone = false;
          $scope.settings.addPhones.push($scope.settings.tempAddPhone);
          //------- save phones in DB
          $scope.savePhoneInDB($scope.settings.addPhones);
        } else {
          $scope.settings.isErrorPhone = true;
        }
      }
    };

    $scope.deletePhone = function(phoneId) {
      $scope.settings.addPhones.splice(phoneId, 1);
      //------- save phones in DB
      $scope.savePhoneInDB($scope.settings.addPhones);
    };

    //------- save phones in DB
    $scope.savePhoneInDB = function(phones) {
      var phonesString = phones.join();
      UserStor.userInfo.contact_name = phonesString;
      globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"contact_name": phonesString}, {"id": UserStor.userInfo.id}); //TODO создать поле в базе данных
      $scope.settings.tempAddPhone = '';
    };

    $scope.gotoPasswordPage = function() {
      $location.path('/change-pass');
    };

    $scope.gotoLanguagePage = function() {
      $location.path('/change-lang');
    };

    $scope.closeSettingsPage = function() {
      $scope.global.isOpenSettingsPage = false;
      $scope.global.isReturnFromDiffPage = true;
      $location.path('/main');
    };

    $scope.logOut = function() {
      UserStor.userInfo = UserStor.setDefaultUser();
      localStorage.storage = localStorage.setDefaultStorage();
      ProductStor.product = ProductStor.setDefaultProduct();
      OrderStor.order = OrderStor.setDefaultOrder();

      //------- clearing local DB
      localDB.deleteDB(localDB.productsTableBD);
      localDB.deleteDB(localDB.addElementsTableBD);
      localDB.deleteDB(localDB.ordersTableBD);
      localDB.deleteDB(localDB.analyticsTableBD);
      console.log('UserStor 333= ', UserStor);
      console.log('localStorage 333= ', localStorage);
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

  }
})();