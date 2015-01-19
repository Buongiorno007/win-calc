/* globals BauVoiceApp, STEP, playSound */

'use strict';

BauVoiceApp.controller('ProfileCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.profilePanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    typing: 'on'
  };

//TODO убрать, и взять данные из global.profiles
  constructService.getAllProfiles(function (results) {
    if (results.status) {
      $scope.profilePanel.producers = results.data.producers;
      $scope.profilePanel.profiles = results.data.profiles;
    } else {
      console.log(results);
    }
  });

  // Select profile
  $scope.selectProfile = function(producerIndex, profileIndex, profileId) {
    $scope.global.product.profileTypeIndex = producerIndex;
    $scope.global.product.profileIndex = profileIndex;
    var selectedProfile = $scope.profilePanel.profiles[producerIndex][profileIndex];
    $scope.global.product.profileId = profileId;
    $scope.global.product.profileName = selectedProfile.profileDescrip;
    $scope.global.product.profileHeatCoeff = selectedProfile.heatCoeff;
    $scope.global.product.profileAirCoeff = selectedProfile.airCoeff;
    //---- find profile index
    for(var pr = 0; pr < $scope.global.profiles.length; pr++) {
      if($scope.global.profiles[pr].id === profileId) {
        $scope.global.product.profileIndex = pr;
      }
    }

    //-------- clearing for new templates
    $scope.global.templatesWindList.length = 0;
    $scope.global.templatesWindIconList.length = 0;
    $scope.global.templatesWindDoorList.length = 0;
    $scope.global.templatesWindDoorIconList.length = 0;
    $scope.global.templatesBalconyList.length = 0;
    $scope.global.templatesBalconyIconList.length = 0;
    $scope.global.templatesDoorList.length = 0;
    $scope.global.templatesDoorIconList.length = 0;

    $scope.global.parseTemplate($scope.global.product.profileIndex, profileId);
    playSound('price');
  };

}]);
