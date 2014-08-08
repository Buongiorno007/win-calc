/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('LoginCtrl', ['$scope', '$location', function ($scope, $location, $http) {
  // Вряд ли нужна такая проверка, т.к. пользователю будет неудобно вводить номер со скобками и дефисами.
  // К тому же форматы номеров отличаются в разных странах.
//  $scope.regPhone = /^\+\d{2}\(\d{3}\)\d{3}-\d{4}$/;
  $scope.user = {};

  $scope.submitForm = function (form) {
    // Trigger validation flag.
    $scope.submitted = true;

    if (form.$valid) {
      $location.path('/main');

      //      $http.post('users.php', $scope.user)
      //        .success(function (respond) {
      //          console.log(respond);
      //          if (respond.success) {
      //            alert('Добро пожаловать');
      //          } else {
      //            alert('Нет такого пользователя');
      //          }
      //        });
    }
  };
}]);