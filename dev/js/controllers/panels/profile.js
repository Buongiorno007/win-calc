/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ProfileCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.profilePanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    isSelectedProducer: 0,
    isSelectedProfile: 0,
    typing: 'on'
  };

/*
  constructService.getAllProfileSystems(function (results) {
    if (results.status) {
      $scope.profilePanel.producers = results.data[0].folder;
      $scope.profilePanel.profiles = results.data[0].profiles;
      console.log($scope.profilePanel.profiles);
      console.log($scope.profilePanel.producers);
      //$scope.$apply();
    } else {
      console.log(results);
    }
  });
  */
  constructService.getAllProfiles(function (results) {
    if (results.status) {
      $scope.profilePanel.producers = results.data.producers;
      $scope.profilePanel.profiles = results.data.profiles;
    } else {
      console.log(results);
    }
  });

  // Select profile
  $scope.selectProfile = function(producerId, profileId) {
    $scope.profilePanel.isSelectedProducer = producerId;
    $scope.profilePanel.isSelectedProfile = profileId;

    var selectedProfile = $scope.profilePanel.profiles[producerId][profileId];
    //$scope.global.profileId = selectedProfile.profileId;
    $scope.global.product.profileName = selectedProfile.profileDescrip;
    $scope.global.product.productPrice += selectedProfile.profilePrice;
  };

}]);
