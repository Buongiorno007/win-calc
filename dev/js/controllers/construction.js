/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ConstructionCtrl', ['$scope',  '$rootScope', 'constructService', 'localStorage', '$location', function ($scope, $rootScope, constructService, localStorage, $location) {

  $scope.global = localStorage;
  $scope.isDoorPage =  $scope.global.isConstructDoor;

  $scope.constructData = {
    tempSize: [],
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
  $scope.global.templateDefaultOLD = angular.copy($scope.global.templateDefault);

  var newLength,
      minDimension = 100,
      maxDimension = 5000,
      fromPointsId, toPointsId;

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

  $scope.constructData.doorShapeDefault = $scope.doorShape[0].shapeLabel;
  $scope.constructData.sashShapeDefault = $scope.sashShape[0].shapeLabel;
  $scope.constructData.handleShapeDefault = $scope.handleShape[0].shapeLabel;
  $scope.constructData.lockShapeDefault = $scope.lockShape[0].shapeLabel;

  $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
  $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
  $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
  $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;

  //--------Select menu item
  $scope.selectMenuItem = function(id) {
    if($scope.constructData.activeMenuItem === id) {
      $scope.constructData.activeMenuItem = false;
    } else {
      $scope.constructData.activeMenuItem = id;
    }
  };

  //---------- Show Door Configuration
  $scope.getDoorConfig = function() {
    if($scope.constructData.showDoorConfig) {
      $scope.constructData.showDoorConfig = false;
    } else {
      $scope.constructData.showDoorConfig = true;
    }
  };


  //---------- Select door shape
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
  //---------- Select sash shape
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
  //-------- Select handle shape
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
  //--------- Select lock shape
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

  //--------- Close Door Configuration
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

  //--------- Save Door Configuration
  $scope.saveDoorConfig = function() {
    $scope.constructData.showDoorConfig = false;
  };

  //-------- Back to Template Panel
  $scope.backtoTemplatePanel = function() {
    $scope.global.showNavMenu = false;
    //$scope.global.doorConstructionPage = false;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showTemplatePanel = true;
    $scope.global.isTemplatePanel = true;
    $location.path('/main');
  };

  //--------- Close Construction Page
  $scope.gotoMainPageCancel = function () {
    $scope.global.templateDefault = $scope.global.templateDefaultOLD;
    $scope.backtoTemplatePanel();
  };

  //------- Close and Save Construction Page
  $scope.gotoMainPageSaved = function () {
    $scope.backtoTemplatePanel();
  };



  //-------- CHANGE CONSTRUCTION SIZE -----------

  //----- click on size SVG and get size value and Id
  $('svg-template').off().on("click", ".size-box-edited", function() {
    $scope.constructData.oldSizeValue = $(this).find('text').text();
    $scope.constructData.tempSizeId = $(this).find('text').attr('id');
  });
  //------ click on size calculator, get number
  $('.construction-right-menu .size-calculator .calc-digit').off().click(function() {
    var newValue = $(this).text();
    setValueSize(newValue);
  });
  //------ click on size calculator, delete one last number
  $('.construction-right-menu .size-calculator .calc-delete').off().click(function() {
    deleteLastNumber();
  });


  //-------- Get number from calculator
  function setValueSize(newValue) {
    if($scope.constructData.tempSize.length === 1 && $scope.constructData.tempSize[0] === 0) {
      $scope.constructData.tempSize.length = 0;
    }
    if($scope.constructData.tempSize.length < 4) {
      if(newValue === '00'){
        $scope.constructData.tempSize.push(0, 0);
      } else {
        $scope.constructData.tempSize.push(newValue);
      }
    }
    //console.log(newValue);
    changeSize();
  }

  //------ Delete last number from calculator
  function deleteLastNumber() {
    $scope.constructData.tempSize.pop();
    if($scope.constructData.tempSize.length < 1) {
      $scope.constructData.tempSize.push(0);
    }
    changeSize();
  }

  //------ Change size on SVG
  function changeSize() {
    var newSizeString = '';
    for(var numer = 0; numer < $scope.constructData.tempSize.length; numer++) {
      newSizeString += $scope.constructData.tempSize[numer].toString();
    }
    //console.log(newSizeString);
    var svg = document.getElementsByTagName("svg");

    $('#'+$scope.constructData.tempSizeId).find('tspan').text(newSizeString);
    SVG(svg[0]).viewbox();
    SVG(svg[0]).size($scope.global.svgTemplateWidth, $scope.global.svgTemplateHeight);
  }

  //---------- Close Size Calculator
  $scope.closeSizeCaclulator = function() {
    var fromPoints = [],
        toPoints = [],
        newPoints = [];

    newLength = parseInt($scope.constructData.tempSize.join(''), 10);

    //------- Dimensions limits checking
    if(newLength > minDimension && newLength < maxDimension) {
      //------ close size calculator
      $('.size-calculator').removeClass('active');
      //------ parse template, get pointsId relate to changed dimension id
      for (var i = 0; i < $scope.global.templateDefault.objects.length; i++) {
        if ($scope.global.templateDefault.objects[i].id === $scope.constructData.tempSizeId) {
          fromPointsId = $scope.global.templateDefault.objects[i].fromPointsArrId;
          toPointsId = $scope.global.templateDefault.objects[i].toPointsArrId;
        }
      }

      //------ parse template, get points relate to points id
      for (var p = 0; p < fromPointsId.length; p++) {
        for (var j = 0; j < $scope.global.templateDefault.objects.length; j++) {
          var point = {};
          switch ($scope.global.templateDefault.objects[j].id) {
            case fromPointsId[p]:
              //var point = {};
              point.x = parseInt($scope.global.templateDefault.objects[j].x, 10);
              point.y = parseInt($scope.global.templateDefault.objects[j].y, 10);
              fromPoints.push(point);
              break;
            case toPointsId[p]:
              //var point = {};
              point.x = parseInt($scope.global.templateDefault.objects[j].x, 10);
              point.y = parseInt($scope.global.templateDefault.objects[j].y, 10);
              toPoints.push(point);
              break;
          }
        }
      }
      //console.log(fromPoints);
      //console.log(toPoints);

      //------ get new points
      for (var point = 0; point < fromPoints.length; point++) {
        var newPoint = {};
        newPoint.newPointX = fromPoints[point].x + (newLength * (toPoints[point].x - fromPoints[point].x) / $scope.constructData.oldSizeValue);
        newPoint.newPointY = fromPoints[point].y + (newLength * (toPoints[point].y - fromPoints[point].y) / $scope.constructData.oldSizeValue);
        newPoints.push(newPoint);
      }
      //console.log(newPoints);

      //-------- change point coordinates in templateSource
      for (var n = 0; n < toPointsId.length; n++) {
        for (var k = 0; k < $scope.global.templateSource.objects.length; k++) {
          if ($scope.global.templateSource.objects[k].id === toPointsId[n]) {
            $scope.global.templateSource.objects[k].x = newPoints[n].newPointX;
            $scope.global.templateSource.objects[k].y = newPoints[n].newPointY;
          }
        }
      }
      //-------- build new template
      $scope.global.templateDefault = new Template($scope.global.templateSource, $scope.global.templateDepths);
      //------- cleaning object for get profile price
      $scope.global.objXFormedPrice = angular.copy($scope.global.objXFormedPriceSource);
      $scope.global.createObjXFormedPrice($scope.global.templateDefault, $scope.global.profileIndex, $scope.global.product.profileId);
      //console.log($scope.global.templateDefault);
      $scope.constructData.tempSize.length = 0;
    }
  };

}]);
