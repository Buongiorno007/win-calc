
// controllers/login.js

(function(){
  'use strict';

  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  loginPageCtrl.$inject = ['$location', 'globalDB', '$cordovaGlobalization', 'localStorage', '$translate'];

  function loginPageCtrl($location, globalDB, $cordovaGlobalization, localStorage, $translate) {

    var thisCtrl = this;

    thisCtrl.isRegistration = false;
    thisCtrl.submitted = false;
    thisCtrl.user = {};
    thisCtrl.regPhone = /^\d+$/;
    thisCtrl.regName = /^[a-zA-Z]+$/;

    //------ clicking
    thisCtrl.registration = registration;
    thisCtrl.enterForm = enterForm;
    thisCtrl.registrForm = registrForm;
/*
      //--- get device code
    globalDB.getDeviceCodeLocalDb(function(result){
      thisCtrl.deviceCode = result.data.deviceCode;
    });
*/


    globalDB.clearLocation(function(result){});
    globalDB.importLocation(function(result){});
    //---- checking fist user enter
    globalDB.ifUserExist('0974391208', function(result){
      console.log(result);
    });
/*
    globalDB.createUser('+380974391208', {"name":"Кураш Александр Иванович", "phone":"+380974391208", "cityId":"156", "email":"amulek@mail.ru"}, function(result){
      console.log(result);
    });
*/

    //------- defined system language
/*
    $cordovaGlobalization.getPreferredLanguage().then(
      function(result) {
        checkLangDictionary(result.value.split('-')[0]);
        $translate.use(localStorage.userInfo.langLabel);
      },
      function(error) {
        console.log('No language defined');
      });

*/
    localStorage.userInfo.langLabel = 'en';
    $translate.use(localStorage.userInfo.langLabel);
/*
    //---- import global DB
    globalDB.initApp(function(result){}).then(function(data) {
      console.log('!!!!!!==', data);
      thisCtrl.isCodeCheckingSuccess = true;
    });
    //globalDB.clearDb(function(result){});
    globalDB.syncDb(function(result){});
*/



    //============ methods ================//

    function registration() {
      thisCtrl.isRegistration = true;
    }

    function enterForm(form) {
      // Trigger validation flag.
      thisCtrl.submitted = true;
      console.log(form);
      if (form.$valid) {
        //$location.path('/main');
      }
    }

    function registrForm(form) {
      // Trigger validation flag.
      thisCtrl.submitted = true;
      console.log(form);
      if (form.$valid) {
        //$location.path('/main');
      }
    }

    function checkLangDictionary(label) {
      var langQty = localStorage.languages.length;
      while(--langQty > -1) {
        if(localStorage.languages[langQty].label === label) {
          localStorage.userInfo.langLabel = label;
        }
      }
      //---- set English if not exist dictionary
      if(!localStorage.userInfo.langLabel) {
        localStorage.userInfo.langLabel = 'en';
      }
    }


  }
})();
