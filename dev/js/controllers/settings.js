(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('SettingsModule')
    .controller('SettingsCtrl',

  function(
    $location,
    $timeout,
    $filter,
    globalConstants,
    localDB,
    SettingServ,
    GlobalStor,
    HistoryStor,
    OrderStor,
    ProductStor,
    AuxStor,
    UserStor
  ) {
    /*jshint validthis:true */
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

    //------- translate
    thisCtrl.NAVMENU_SETTINGS = $filter('translate')('mainpage.NAVMENU_SETTINGS');
    thisCtrl.CHANGE = $filter('translate')('common_words.CHANGE');
    thisCtrl.AUTHORIZATION = $filter('translate')('settings.AUTHORIZATION');
    thisCtrl.CHANGE_PASSWORD = $filter('translate')('settings.CHANGE_PASSWORD');
    thisCtrl.CHANGE_LANGUAGE = $filter('translate')('settings.CHANGE_LANGUAGE');
    thisCtrl.PRIVATE_INFO = $filter('translate')('settings.PRIVATE_INFO');
    thisCtrl.USER_NAME = $filter('translate')('settings.USER_NAME');
    thisCtrl.CITY = $filter('translate')('settings.CITY');
    thisCtrl.CLIENT_ADDRESS = $filter('translate')('cart.CLIENT_ADDRESS');
    thisCtrl.CLIENT_EMAIL = $filter('translate')('cart.CLIENT_EMAIL');
    thisCtrl.WRONG_EMAIL = $filter('translate')('cart.WRONG_EMAIL');
    thisCtrl.ADD_PHONES = $filter('translate')('settings.ADD_PHONES');
    thisCtrl.INSERT_PHONE = $filter('translate')('settings.INSERT_PHONE');
    thisCtrl.WRONG_NUMBER = $filter('translate')('login.WRONG_NUMBER');
    thisCtrl.CLIENT_SUPPORT = $filter('translate')('settings.CLIENT_SUPPORT');
    thisCtrl.LOGOUT = $filter('translate')('settings.LOGOUT');

    //------- set current Page
    GlobalStor.global.currOpenPage = 'settings';

    //    $scope.global.startProgramm = false;
    //    //----- for location page
    //    $scope.global.isOpenSettingsPage = true;

    //----- parse additional phones
    if(UserStor.userInfo.city_phone) {
      thisCtrl.config.addPhones = UserStor.userInfo.city_phone.split(',');
    }






    /**============ METHODS ================*/


    function saveTxtInBD(marker, newTxt) {
      var updateData = {};
      switch(marker) {
        case 'user-name': updateData.name = newTxt;
          break;
        case 'user-address': updateData.address = newTxt;
          break;
        case 'user-email':
          var checkEmail = thisCtrl.config.mailReg.test(newTxt);
          if(checkEmail) {
            thisCtrl.config.isEmailError = 0;
            updateData.email = newTxt;
          } else {
            thisCtrl.config.isEmailError = 1;
          }
          break;
      }
      if(!$.isEmptyObject(updateData)) {
        //----- update factoryId in LocalDB & Server
        localDB.updateLocalServerDBs(localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, updateData);
      }
    }

    function findInput(idElement) {
      console.log("2");
      $timeout(function() {
        $('#'+idElement).find('input').focus();
      }, 100);
    }

    function findInputPhone() {
      $timeout(function() {
        $('.set-input-phone').focus();
      }, 100);
    }

    function changeSettingData(id, obj) {
      thisCtrl.config.selectedSetting = id;
      //TODO ipad findInput(obj.currentTarget.id);
      findInput(obj.target.id);
    }


    function saveChanges(marker, newTxt) {
      if (event.which === 13) {
        saveTxtInBD(marker, newTxt);
      }
    }

    function saveChangesBlur(marker, newTxt) {
        saveTxtInBD(marker, newTxt);
    }



    function changeEmail() {
      thisCtrl.config.isEmailError = 0;
    }


    //------- save phones in DB
    function savePhoneInDB(phones) {
      var phonesString = phones.join(',');
      UserStor.userInfo.city_phone = phonesString;
      localDB.updateLocalServerDBs(
        localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {"city_phone": phonesString}
      );
      thisCtrl.config.tempAddPhone = '';
    }

    function saveNewPhone() {
      var checkPhone = thisCtrl.config.regex.test(thisCtrl.config.tempAddPhone);
      if(checkPhone) {
        thisCtrl.config.isInsertPhone = 0;
        thisCtrl.config.isErrorPhone = 0;
        thisCtrl.config.addPhones.push(thisCtrl.config.tempAddPhone);
        //------- save phones in DB
        savePhoneInDB(thisCtrl.config.addPhones);
      } else {
        thisCtrl.config.isErrorPhone = 1;
      }
    }


    function appendInputPhone() {
      thisCtrl.config.isInsertPhone = !thisCtrl.config.isInsertPhone;
      thisCtrl.config.tempAddPhone = '';
      thisCtrl.config.isErrorPhone = 0;
      findInputPhone();
    }


    function addNewPhone() {
      if(thisCtrl.config.tempAddPhone && thisCtrl.config.tempAddPhone !== '') {
        saveNewPhone();
      } else {
        appendInputPhone();
      }
    }



    function cancelAddPhone() {
      thisCtrl.config.isInsertPhone = 0;
      thisCtrl.config.isErrorPhone = 0;
    }

    function saveChangesPhone() {
      if (event.which === 13) {
        saveNewPhone();
      }
    }



    function deletePhone(phoneId) {
      thisCtrl.config.addPhones.splice(phoneId, 1);
      //------- save phones in DB
      savePhoneInDB(thisCtrl.config.addPhones);
    }



    function logOut() {

      localStorage.clear();

      UserStor.userInfo = UserStor.setDefaultUser();
      GlobalStor.global = GlobalStor.setDefaultGlobal();
      OrderStor.order = OrderStor.setDefaultOrder();
      ProductStor.product = ProductStor.setDefaultProduct();
      AuxStor.aux = AuxStor.setDefaultAuxiliary();
      HistoryStor.history = HistoryStor.setDefaultHistory();
      $location.path("/");
      GlobalStor.global.currOpenPage = '/';
    }





    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.changeSettingData = changeSettingData;
    thisCtrl.appendInputPhone = appendInputPhone;
    thisCtrl.cancelAddPhone = cancelAddPhone;
    thisCtrl.saveChanges = saveChanges;
    thisCtrl.saveChangesBlur = saveChangesBlur;
    thisCtrl.changeEmail = changeEmail;
    thisCtrl.addNewPhone = addNewPhone;
    thisCtrl.saveChangesPhone = saveChangesPhone;
    thisCtrl.deletePhone = deletePhone;
    thisCtrl.gotoPasswordPage = SettingServ.gotoPasswordPage;
    thisCtrl.gotoLanguagePage = SettingServ.gotoLanguagePage;
    thisCtrl.gotoLocationPage = SettingServ.gotoLocationPage;
    thisCtrl.closeSettingsPage = SettingServ.closeSettingsPage;
    thisCtrl.logOut = logOut;


  });
})();