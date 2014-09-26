/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'globalData', '$location', function ($scope, globalData, $location) {

  $scope.global = globalData;

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