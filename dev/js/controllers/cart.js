/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'localDB', 'localStorage', '$location', function ($scope, localDB, localStorage, $location) {

  $scope.global = localStorage;


  // Get Products Data
  localDB.selectAll(function (results) {
    if (results.status) {
      $scope.global.order = results.data;
      console.log($scope.global.order);
      //$scope.$apply();
    } else {
      console.log(results);
    }
  });

  $scope.createNewProduct = function() {
    $location.path('/main');
    //$scope.global.showNavMenu = false;
    //$scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    //$scope.global.showPanels.showTemplatePanel = true;
    //$scope.global.isTemplatePanel = true;
  };

  // Full/Light View switcher
  $scope.isCartLightView = false;
  $scope.viewSwitching = function() {
    $scope.isCartLightView = !$scope.isCartLightView;
  };

}]);