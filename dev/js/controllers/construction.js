/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, removeClassWithDelay, addClassWithDelay */

'use strict';

BauVoiceApp.controller('ConstructionCtrl', ['$scope',  'constructService', 'globalData', '$location', function ($scope, constructService, globalData, $location) {

  var $constructLeftMenu = $('.construction-left-menu'),
      $figureLabel = $constructLeftMenu.find('.figure-label'),
      $footerLabel = $constructLeftMenu.find('.footer-description'),
      $constructionRightMenu = $('.construction-right-menu'),
      $doorConfigLabel = $constructionRightMenu.find('.door-config-label'),
      $doorConfigDescrip = $constructionRightMenu.find('.door-config-description');


  $scope.global = globalData;
  $scope.isDoorPage =  $scope.global.doorConstructionPage;

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

  $scope.constructData = {
    activeMenuItem: false,
    showDoorConfig: true,
    selectedDoorShape: false,
    selectedSashShape: false,
    selectedHandleShape: false,
    selectedLockShape: false,
    doorShapeDefault: '',
    sashShapeDefault: '',
    handleShapeDefault: '',
    lockShapeDefault: '',
    doorShape: '',
    sashShape: '',
    handleShape: '',
    lockShape: '',
    selectedStep1: false,
    selectedStep2: false,
    selectedStep3: false,
    selectedStep4: false
  };

  $scope.constructData.doorShapeDefault = $scope.doorShape[0].shapeLabel;
  $scope.constructData.sashShapeDefault = $scope.sashShape[0].shapeLabel;
  $scope.constructData.handleShapeDefault = $scope.handleShape[0].shapeLabel;
  $scope.constructData.lockShapeDefault = $scope.lockShape[0].shapeLabel;

  $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
  $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
  $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
  $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;

  setTimeout(function () {

    $figureLabel.each(function () {
      typingTextByChar($(this));
    });

    typingTextByChar($footerLabel);
    //typingTextByChar($doorConfigLabel);
    //typingTextByChar($doorConfigDescrip);

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


  // Select door shape
  $scope.selectDoor = function(id, name) {
    if(!$scope.constructData.selectedStep2) {
      if($scope.constructData.selectedDoorShape === id) {
        $scope.constructData.selectedDoorShape = false;
        $scope.constructData.selectedStep1 = false;
        $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
      } else {
        $scope.constructData.selectedDoorShape = id;
        $scope.constructData.selectedStep1 = true;
        $scope.constructData.doorShape = name;
      }
    } else {
      return false;
    }
  };
  // Select sash shape
  $scope.selectSash = function(id, name) {
    if(!$scope.constructData.selectedStep3) {
      if ($scope.constructData.selectedSashShape === id) {
        $scope.constructData.selectedSashShape = false;
        $scope.constructData.selectedStep2 = false;
        $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
      } else {
        $scope.constructData.selectedSashShape = id;
        $scope.constructData.selectedStep2 = true;
        $scope.constructData.sashShape = name;
      }
    }
  };
  // Select handle shape
  $scope.selectHandle = function(id, name) {
    if(!$scope.constructData.selectedStep4) {
      if($scope.constructData.selectedHandleShape === id) {
        $scope.constructData.selectedHandleShape = false;
        $scope.constructData.selectedStep3 = false;
        $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
      } else {
        $scope.constructData.selectedHandleShape = id;
        $scope.constructData.selectedStep3 = true;
        $scope.constructData.handleShape = name;
      }
    }
  };
  // Select lock shape
  $scope.selectLock = function(id, name) {
    if($scope.constructData.selectedLockShape === id) {
      $scope.constructData.selectedLockShape = false;
      $scope.constructData.selectedStep4 = false;
      $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;
    } else {
      $scope.constructData.selectedLockShape = id;
      $scope.constructData.selectedStep4 = true;
      $scope.constructData.lockShape = name;
    }
  };

  // Close Door Configuration
  $scope.closeDoorConfig = function() {
    if($scope.constructData.selectedStep3) {
      $scope.constructData.selectedStep3 = false;
      $scope.constructData.selectedStep4 = false;
      $scope.constructData.selectedLockShape = false;
      $scope.constructData.selectedHandleShape = false;
    } else if($scope.constructData.selectedStep2) {
      $scope.constructData.selectedStep2 = false;
      $scope.constructData.selectedSashShape = false;
    } else if($scope.constructData.selectedStep1) {
      $scope.constructData.selectedStep1 = false;
      $scope.constructData.selectedDoorShape = false;
    } else {
      $scope.constructData.showDoorConfig = false;
      $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
      $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
      $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
      $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;
    }
  };

  // Save Door Configuration
  $scope.saveDoorConfig = function() {
    $scope.constructData.showDoorConfig = false;
  };

  // Close Door Construction
  $scope.gotoMainPageEmpty = function () {
    $scope.global.doorConstructionPage = false;
    $location.path('/main');
  };

  // Close and Save Door Construction
  $scope.gotoMainPageSaved = function () {
    $scope.global.doorConstructionPage = false;
    $location.path('/main');
  };

}]);
