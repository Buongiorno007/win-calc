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
    showDoorConfig: false,
    selectedDoorShape: '',
    selectedSashShape: '',
    selectedHandleShape: '',
    selectedLockShape: '',
    selectedStep1: false,
    selectedStep2: false,
    selectedStep3: false,
    selectedStep4: false
  };


  setTimeout(function () {

    $figureLabel.each(function () {
      typingTextByChar($(this));
    });

    typingTextByChar($footerLabel);
    typingTextByChar($doorConfigLabel);
    typingTextByChar($doorConfigDescrip);

  }, 500);


  constructService.getDoorConfig(function (results) {
    if (results.status) {
      $scope.doorShape = results.data.doorType;
      $scope.sashShape = results.data.sashType;
      $scope.handleShape = results.data.handleType;
      $scope.lockShape = results.data.lockType;
    } else {
      console.log(results);
    }
  });


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


  // Select door shape
  $scope.selectDoor = function(id) {
    if(!$scope.constructData.selectedStep2) {
      if($scope.constructData.selectedDoorShape === id) {
        $scope.constructData.selectedDoorShape = false;
        $scope.constructData.selectedStep1 = false;
      } else {
        $scope.constructData.selectedDoorShape = id;
        $scope.constructData.selectedStep1 = true;
      }
    } else {
      return false;
    }
  };
  // Select sash shape
  $scope.selectSash = function(id) {
    if(!$scope.constructData.selectedStep3) {
      if ($scope.constructData.selectedSashShape === id) {
        $scope.constructData.selectedSashShape = false;
        $scope.constructData.selectedStep2 = false;
      } else {
        $scope.constructData.selectedSashShape = id;
        $scope.constructData.selectedStep2 = true;
      }
    }
  };
  // Select handle shape
  $scope.selectHandle = function(id) {
    if(!$scope.constructData.selectedStep4) {
      if($scope.constructData.selectedHandleShape === id) {
        $scope.constructData.selectedHandleShape = false;
        $scope.constructData.selectedStep3 = false;
      } else {
        $scope.constructData.selectedHandleShape = id;
        $scope.constructData.selectedStep3 = true;
      }
    }
  };
  // Select lock shape
  $scope.selectLock = function(id) {
    if($scope.constructData.selectedLockShape === id) {
      $scope.constructData.selectedLockShape = false;
      $scope.constructData.selectedStep4 = false;
    } else {
      $scope.constructData.selectedLockShape = id;
      $scope.constructData.selectedStep4 = true;
    }
  };

}]);
