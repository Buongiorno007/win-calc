/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('MainCtrl', ['$rootScope', '$scope', 'localStorage', 'constructService', function ($rootScope, $scope, localStorage, constructService) {

  $scope.global = localStorage;
/*
  $scope.main = {
    isConfigMenuShow: false
  };

  $rootScope.$on('swipeMainPage', function() {
    $scope.main.isConfigMenuShow = !$scope.main.isConfigMenuShow;
  });
*/
/*
  //----- Show Comments
  $(".main-content").swipe( {
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
      if(direction === 'up') {
        $scope.global.isShowCommentBlock = true;
      } else if(direction === 'down') {
        $scope.global.isShowCommentBlock = false;
      }
    },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
    threshold:0
  });
*/
}]);
