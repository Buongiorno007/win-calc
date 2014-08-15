/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('LoginCtrl', ['$scope', '$location', '$translate', function ($scope, $location, $translate) {
  $scope.isCodeValid = false;
  $scope.isCodeCheckingSuccess = true;

  $scope.checkCode = function () {
    // запрос на сервер с проверкой кода. Если проверка прошла успешно, то синхронизировать базу данных.
    // Если неуспешно, то выдать сообщение об ошибке.
    $scope.isCodeCheckingSuccess = !$scope.isCodeCheckingSuccess;

    if ($scope.isCodeCheckingSuccess) {
      $scope.isCodeValid = true;
    }
  };

  // Вряд ли нужна такая проверка, т.к. пользователю будет неудобно вводить номер со скобками и дефисами.
  // К тому же форматы номеров отличаются в разных странах.
//  $scope.regPhone = /^\+\d{2}\(\d{3}\)\d{3}-\d{4}$/;

  $scope.user = {};

  $scope.submitForm = function (form) {
    // Trigger validation flag.
    $scope.submitted = true;

    if (form.$valid) {
      $location.path('/main');
    }
  };
}]);