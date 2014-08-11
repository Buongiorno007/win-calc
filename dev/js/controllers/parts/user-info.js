/* globals BauVoiceApp, STEP, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('UserInfoCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
  var $userInfoContainer = $('.user-info-container'),
      $userLocation = $userInfoContainer.find('.user-location'),
      $userName = $userInfoContainer.find('.user-name'),
      $userIconLocation = $userInfoContainer.find('.icon-location'),

      DELAY_SHOW_USER_INFO = 20 * STEP;

  showElementWithDelay($userIconLocation, DELAY_SHOW_USER_INFO);
  typingTextWithDelay($userLocation, DELAY_SHOW_USER_INFO);
  typingTextWithDelay($userName, DELAY_SHOW_USER_INFO);

  $scope.userInfo = {
    isConfigMenuShow: false,
    location: 'Днепропетровск',
    name: 'John Appleseed'
  };

  $scope.swipeMainPage = function() {
    $rootScope.$broadcast('swipeMainPage', true);
  };

  $rootScope.$on('swipeMainPage', function() {
    $scope.userInfo.isConfigMenuShow = !$scope.userInfo.isConfigMenuShow;
  });
}]);
