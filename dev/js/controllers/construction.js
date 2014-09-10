/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, removeClassWithDelay, addClassWithDelay */

'use strict';

BauVoiceApp.controller('ConstructionCtrl', ['$scope',  'constructService', 'globalData', function ($scope, constructService, globalData) {

  var $constructLeftMenu = $('.construction-left-menu'),
      $figureLabel = $constructLeftMenu.find('.figure-label'),
      $footerLabel = $constructLeftMenu.find('.footer-description'),
      $constructionRightMenu = $('.construction-right-menu'),
      $doorConfigLabel = $constructionRightMenu.find('.door-config-label'),
      $doorConfigDescrip = $constructionRightMenu.find('.door-config-description');


  $scope.global = globalData;


  $scope.constructData = {
    activeMenuItem: false,
    showDoorConfig: false
  };


  setTimeout(function () {

    $figureLabel.each(function () {
      typingTextByChar($(this));
    });

    typingTextByChar($footerLabel);
    typingTextByChar($doorConfigLabel);
    typingTextByChar($doorConfigDescrip);

  }, 500);

  //Select menu item
  $scope.selectMenuItem = function(id) {
    if($scope.constructData.activeMenuItem === id) {
      $scope.constructData.activeMenuItem = false;
    } else {
      $scope.constructData.activeMenuItem = id;
    }
  };

  // Show Door Configuration
  $scope.getDoorConfig = function() {
    if($scope.constructData.showDoorConfig) {
      $scope.constructData.showDoorConfig = false;
    } else {
      $scope.constructData.showDoorConfig = true;
    }
  }

}]);
