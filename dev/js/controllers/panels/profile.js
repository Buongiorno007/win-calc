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
  //$scope.global.profileIndex
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
  $scope.selectProfile = function(producerId, profileIndexOld, profileId) {
    $scope.profilePanel.isSelectedProducer = producerId;
    $scope.profilePanel.isSelectedProfile = profileIndexOld;

    var selectedProfile = $scope.profilePanel.profiles[producerId][profileIndexOld];
    $scope.global.product.profileId = profileId;
    $scope.global.product.profileName = selectedProfile.profileDescrip;

    //---- find profile index
    for(var pr = 0; pr < $scope.global.product.profiles.length; pr++) {
      if($scope.global.product.profiles[pr].id === profileId) {
        $scope.global.profileIndex = pr;
      }
    }
    $scope.global.parseTemplate($scope.global.profileIndex, profileId);
  };

}]);
