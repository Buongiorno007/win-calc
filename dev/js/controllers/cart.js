/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'globalData', 'localDB', '$location', function ($scope, globalData, localDB, $location) {

  $scope.global = globalData;

  $scope.initCartPage = function() {
    $scope.datas = localDB.select({
      'id': {"value": '10'}
    });
  };

  $scope.createNewProduct = function() {
    $location.path('/main');
    //$scope.global.showNavMenu = false;
    //$scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    //$scope.global.showPanels.showTemplatePanel = true;
    //$scope.global.isTemplatePanel = true;
  };





  //$scope.datas = localDB.selectAll();
  console.log('first '+$scope.datas);
  setTimeout(function(){
    console.log($scope.datas);
  }, 500);


  // Full/Light View switcher
  $scope.isCartLightView = false;
  $scope.viewSwitching = function() {
    $scope.isCartLightView = !$scope.isCartLightView;
  };

}]);