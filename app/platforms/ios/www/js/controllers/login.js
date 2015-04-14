(function(){
  'use strict';

  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  loginPageCtrl.$inject = ['$location', 'globalDB', '$cordovaGlobalization', 'localStorage', '$translate'];

  function loginPageCtrl($location, globalDB, $cordovaGlobalization, localStorage, $translate) {

    var thisCtrl = this;

    thisCtrl.isCodeValid = false;
    thisCtrl.submitted = false;
    thisCtrl.isCodeCheckingSuccess = false;
    thisCtrl.user = {};

    //------ clicking
    thisCtrl.checkCode = checkCode;
    thisCtrl.submitForm = submitForm;

      //--- get device code
    globalDB.getDeviceCodeLocalDb(function(result){
      thisCtrl.deviceCode = result.data.deviceCode;
    });



    //------- defined system language
    $cordovaGlobalization.getPreferredLanguage().then(
      function(result) {
        checkLangDictionary(result.value.split('-')[0]);
        $translate.use(localStorage.userInfo.langLabel);
      },
      function(error) {
        console.log('No language defined');
      });


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

    function checkCode() {
      // запрос на сервер с проверкой кода. Если проверка прошла успешно, то синхронизировать базу данных.
      // Если неуспешно, то выдать сообщение об ошибке.
      //$scope.isCodeCheckingSuccess = !$scope.isCodeCheckingSuccess;
      //console.log('click = ', thisCtrl.submitted);
      if (thisCtrl.isCodeCheckingSuccess) {
        thisCtrl.isCodeValid = true;
      }
    }

    function submitForm(form) {
      // Вряд ли нужна такая проверка, т.к. пользователю будет неудобно вводить номер со скобками и дефисами.
      // К тому же форматы номеров отличаются в разных странах.
      //  $scope.regPhone = /^\+\d{2}\(\d{3}\)\d{3}-\d{4}$/;

      // Trigger validation flag.
      thisCtrl.submitted = true;

      if (form.$valid) {
        $location.path('/main');
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