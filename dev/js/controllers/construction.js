/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ConstructionCtrl', ['$scope',  'constructService', 'localStorage', '$location', function ($scope, constructService, localStorage, $location) {

  $scope.global = localStorage;
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
    showDoorConfig: false,
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
    selectedStep4: false,
    DELAY_SHOW_FIGURE_ITEM: 2000,
    typing: 'on'
  };

  $scope.constructData.doorShapeDefault = $scope.doorShape[0].shapeLabel;
  $scope.constructData.sashShapeDefault = $scope.sashShape[0].shapeLabel;
  $scope.constructData.handleShapeDefault = $scope.handleShape[0].shapeLabel;
  $scope.constructData.lockShapeDefault = $scope.lockShape[0].shapeLabel;

  $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
  $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
  $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
  $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;

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
  };


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

  //-------- CHANGE CONSTRUCTION SIZE -----------



  $('svg-template').off().on("click", ".size-box-edited", function() {
    var sizeId = $(this).find('text').attr('id');
    console.log(sizeId);
    console.log($(this).find('text').text());
    $scope.constructData.tempSizeId = sizeId;
  });

  $('.construction-right-menu .size-calculator .calc-digit').off().click(function() {
    var number = $(this).text();
    console.log(number);
    $('#'+$scope.constructData.tempSizeId).text(number);

  });
  /*
  // Change Size parameter
  $scope.setValueSize = function(newValue) {
    //console.log($scope.addElementsMenu.tempSize);
    if($scope.constructData.tempSize.length == 1 && $scope.constructData.tempSize[0] === 0) {
      $scope.constructData.tempSize.length = 0;
    }

    if($scope.constructData.tempSize.length < 4) {
      if(newValue === '00'){
        $scope.constructData.tempSize.push(0, 0);
      } else {
        $scope.constructData.tempSize.push(newValue);
      }
    }
    //changeElementSize();
  };

  // Delete last number
  $scope.deleteLastNumber = function() {
    $scope.addElementsMenu.tempSize.pop();
    if($scope.addElementsMenu.tempSize.length < 1) {
      $scope.addElementsMenu.tempSize.push(0);
    }
    changeElementSize();
  };

  // Close Size Calculator
  $scope.closeSizeCaclulator = function() {
    $scope.global.isWidthCalculator = false;
    $scope.addElementsMenu.tempSize.length = 0;
    $scope.global.desactiveAddElementParameters();
  };

  function changeElementSize(){
    var newElementSize = '';
    for(var numer = 0; numer < $scope.addElementsMenu.tempSize.length; numer++) {
      newElementSize += $scope.addElementsMenu.tempSize[numer].toString();
    }
    var elementId = $scope.global.currentAddElementId;

    if($scope.global.isWidthCalculator) {
      switch($scope.global.isFocusedAddElement) {
        case 2:
          $scope.global.chosenAddElements.selectedVisors[elementId].elementWidth = newElementSize;
          break;
      }
    } else {
      if($scope.global.isFocusedAddElement === 5) {
        $scope.global.chosenAddElements.selectedLouvers[elementId].elementHeight = newElementSize;
      }
    }
  }

*/

}]);
