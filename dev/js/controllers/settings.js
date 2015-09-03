(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('SettingsCtrl', settingsPageCtrl);

  function settingsPageCtrl($location, globalConstants, localDB, SettingServ, GlobalStor, OrderStor, ProductStor, AuxStor, UserStor ) {

    var thisCtrl = this;
    thisCtrl.U = UserStor;


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

    //------- set current Page
    GlobalStor.global.currOpenPage = 'settings';

    //    $scope.global.startProgramm = false;
    //    //----- for location page
    //    $scope.global.isOpenSettingsPage = true;
//TODO where additional phones?
    //----- parse additional phones
//    console.log('CONTACT+++++', UserStor.userInfo.contact_name);
//    if(UserStor.userInfo.contact_name !== '') {
//      thisCtrl.config.addPhones = UserStor.userInfo.contact_name.split(',');
//    }


    //------ clicking
    thisCtrl.changeAvatar = SettingServ.changeAvatar;
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
      var updateData = {};
      switch(marker) {
        case 'user-name': updateData.name = newTxt;
          break;
        case 'user-address': updateData.city_phone = newTxt;
          break;
        case 'user-email':
          var checkEmail = thisCtrl.config.mailReg.test(newTxt);
          if(checkEmail) {
            thisCtrl.config.isEmailError = false;
            updateData.email = newTxt;
          } else {
            thisCtrl.config.isEmailError = true;
          }
          break;
      }
      if(!$.isEmptyObject(updateData)) {
        //----- update factoryId in LocalDB & Server
        localDB.updateLocalServerDBs(localDB.tablesLocalDB.user.tableName, UserStor.userInfo.id, updateData);
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
      localDB.updateLocalServerDBs(localDB.tablesLocalDB.user.tableName, UserStor.userInfo.id, {"contact_name": phonesString});
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