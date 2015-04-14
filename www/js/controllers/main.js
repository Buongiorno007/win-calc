
// controllers/main.js

(function(){
  'use strict';

  angular
    .module('MainModule')
    .controller('MainCtrl', mainPageCtrl);

  mainPageCtrl.$inject = ['$scope', 'localStorage'];

  function mainPageCtrl($scope, localStorage) {

    $scope.global = localStorage;
    console.log('START main CTRL!!!!!!');
    console.log($scope.global.startProgramm);

  /*
    $scope.main = {
      isConfigMenuShow: false
    };

    $rootScope.$on('swipeMainPage', function() {
      $scope.main.isConfigMenuShow = !$scope.main.isConfigMenuShow;
    });
  */

  }
})();

