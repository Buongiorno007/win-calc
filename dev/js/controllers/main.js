(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('MainCtrl', mainPageCtrl);

  function mainPageCtrl($scope, localStorage) {

    $scope.global = localStorage.storage;
    console.log('START main CTRL!!!!!!');

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
