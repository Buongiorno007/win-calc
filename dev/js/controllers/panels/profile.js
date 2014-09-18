/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ProfileCtrl', ['$scope', 'globalData', 'constructService', function ($scope, globalData, constructService) {

  $scope.global = globalData;

  $scope.profilePanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    isSelectedProducer: 0,
    isSelectedProfile: 0,
    typing: 'on'
  };

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
    $scope.global.profileName = selectedProfile.profileDescrip;
    $scope.global.orderPrice += selectedProfile.profilePrice;
  };

}]);
