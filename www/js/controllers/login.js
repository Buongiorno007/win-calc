
// controllers/login.js

(function(){
  'use strict';

  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  loginPageCtrl.$inject = ['$location', 'globalDB'];

  function loginPageCtrl($location, globalDB) {

    var thisCtrl = this;

    thisCtrl.isCodeValid = true;
    thisCtrl.submitted = false;
    thisCtrl.isCodeCheckingSuccess = true;
    thisCtrl.user = {};

    //------ clicking
    thisCtrl.checkCode = checkCode;
    thisCtrl.submitForm = submitForm;

      //--- get device code
    globalDB.getDeviceCodeLocalDb(function(result){
      thisCtrl.deviceCode = result.data.deviceCode;
    });

    //---- import global DB
    globalDB.initApp(function(result){});
    //globalDB.clearDb(function(result){});
    globalDB.syncDb(function(result){});




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



  }
})();
