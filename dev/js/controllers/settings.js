(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('SettingsCtrl', settingsPageCtrl);

  function settingsPageCtrl($location, globalConstants, globalDB, localDB, GlobalStor, OrderStor, ProductStor, AuxStor, UserStor ) {

    var thisCtrl = this;
    thisCtrl.userInfo = UserStor.userInfo;


    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ICONS: globalConstants.STEP * 10,
      isInsertPhone: false,
      isEmailError: false,
      addPhones: [],
      tempAddPhone: '',
      regex: globalConstants.REG_PHONE,
      mailReg: globalConstants.REG_MAIL,
      typing: 'on'
    };


    //    $scope.global.startProgramm = false;
    //    //----- for location page
    //    $scope.global.isOpenSettingsPage = true;

    //----- parse additional phones
    if(UserStor.userInfo.contact_name !== '') {
      thisCtrl.config.addPhones = UserStor.userInfo.contact_name.split(',');
    }


    //------ clicking
    thisCtrl.changeAvatar = changeAvatar;
    thisCtrl.changeSettingData = changeSettingData;
    thisCtrl.appendInputPhone = appendInputPhone;
    thisCtrl.cancelAddPhone = cancelAddPhone;
    thisCtrl.saveChanges = saveChanges;
    thisCtrl.saveChangesBlur = saveChangesBlur;
    thisCtrl.changeEmail = changeEmail;
    thisCtrl.saveChangesPhone = saveChangesPhone;
    thisCtrl.deletePhone = deletePhone;
    thisCtrl.gotoPasswordPage = gotoPasswordPage;
    thisCtrl.gotoLanguagePage = gotoLanguagePage;
    thisCtrl.closeSettingsPage = closeSettingsPage;
    thisCtrl.logOut = logOut;



    //============ methods ================//


    //----- change avatar
    function changeAvatar() {
      navigator.camera.getPicture( function( data ) {
        UserStor.userInfo.avatarUrl = 'data:image/jpeg;base64,' + data;
      }, function( error ) {
        console.log( 'Error upload user avatar' + error );
        console.log(UserStor.userInfo);
      }, {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        targetWidth: 76,
        targetHeight: 76,
        mediaType: Camera.MediaType.PICTURE
      } );
    }

    function changeSettingData(id, obj) {
      thisCtrl.config.selectedSetting = id;
      findInput(obj.currentTarget.id);
    }


    function appendInputPhone() {
      thisCtrl.config.isInsertPhone = !thisCtrl.config.isInsertPhone;
      thisCtrl.config.tempAddPhone = '';
      thisCtrl.config.isErrorPhone = false;
      findInputPhone();
    }

    function cancelAddPhone() {
      thisCtrl.config.isInsertPhone = false;
      thisCtrl.config.isErrorPhone = false;
    }

    function saveChanges(marker, newTxt) {
      if (event.which == 13) {
        saveTxtInBD(marker, newTxt);
      }
    }

    function saveChangesBlur(marker, newTxt) {
        saveTxtInBD(marker, newTxt);
    }

    function saveTxtInBD(marker, newTxt) {
      switch(marker) {
        case 'user-name':
          globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"name": newTxt}, {"id": UserStor.userInfo.id});
          break;
        case 'user-address':
          globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"city_phone": newTxt}, {"id": UserStor.userInfo.id}); //TODO создать поле в базе данных
          break;
        case 'user-email':
          var checkEmail = thisCtrl.config.mailReg.test(newTxt);
          if(checkEmail) {
            thisCtrl.config.isEmailError = false;
            globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"email": newTxt}, {"id": UserStor.userInfo.id});
          } else {
            thisCtrl.config.isEmailError = true;
          }
          break;
      }
    }

    function changeEmail() {
      thisCtrl.config.isEmailError = false;
    }

    function saveChangesPhone() {
      if (event.which == 13) {
        var checkPhone = thisCtrl.config.regex.test(thisCtrl.config.tempAddPhone);
        if(checkPhone) {
          thisCtrl.config.isInsertPhone = false;
          thisCtrl.config.isErrorPhone = false;
          thisCtrl.config.addPhones.push(thisCtrl.config.tempAddPhone);
          //------- save phones in DB
          savePhoneInDB(thisCtrl.config.addPhones);
        } else {
          thisCtrl.config.isErrorPhone = true;
        }
      }
    }

    function deletePhone(phoneId) {
      thisCtrl.config.addPhones.splice(phoneId, 1);
      //------- save phones in DB
      savePhoneInDB(thisCtrl.config.addPhones);
    }

    //------- save phones in DB
    function savePhoneInDB(phones) {
      var phonesString = phones.join();
      UserStor.userInfo.contact_name = phonesString;
      globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"contact_name": phonesString}, {"id": UserStor.userInfo.id}); //TODO создать поле в базе данных
      thisCtrl.config.tempAddPhone = '';
    }

    function gotoPasswordPage() {
      $location.path('/change-pass');
    }

    function gotoLanguagePage() {
      $location.path('/change-lang');
    }

    function closeSettingsPage() {
//      $scope.global.isOpenSettingsPage = false;
//      $scope.global.isReturnFromDiffPage = true;
      $location.path('/main');
    }

    function logOut() {
      UserStor.userInfo = UserStor.setDefaultUser();
      GlobalStor.global = GlobalStor.setDefaultGlobal();
      OrderStor.order = OrderStor.setDefaultOrder();
      ProductStor.product = ProductStor.setDefaultProduct();
      AuxStor.aux = AuxStor.setDefaultAuxiliary();

      //------- clearing local DB
      localDB.deleteDB(localDB.productsTableBD);
      localDB.deleteDB(localDB.addElementsTableBD);
      localDB.deleteDB(localDB.ordersTableBD);
      localDB.deleteDB(localDB.analyticsTableBD);
      localDB.deleteDB(localDB.sqliteTableBD);
      console.log('UserStor 333= ', UserStor);
      $location.path('/login');
    }

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