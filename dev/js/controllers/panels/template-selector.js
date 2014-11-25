/* globals BauVoiceApp, STEP, */

'use strict';

BauVoiceApp.controller('TemplateSelectorCtrl', ['$scope', 'constructService', '$location', 'localStorage', function ($scope, constructService, $location, localStorage) {

  $scope.global = localStorage;

  $scope.templatePanel = {
    DELAY_TEMPLATE_ELEMENT: 5 * STEP,
    switcherTemplate: false,
    templateCurrID: 0,
    typing: 'on'
  };

  //------ click on top Window button
  $scope.toggleTemplate = function() {
    $scope.templatePanel.switcherTemplate = !$scope.templatePanel.switcherTemplate;
  };
  //------- Select Window/Balcony Template
  $scope.turnOnTemplate = function(marker) {
    if(marker === 'balcon') {
      $scope.global.isConstructWindDoor = true;
    } else if(marker === 'window') {
      $scope.global.isConstructWindDoor = false;
    }
    $scope.templatePanel.switcherTemplate = false;
    $scope.templatePanel.templateCurrID = 0;
    $scope.initTemplates();
  };

  $scope.gotoConstructionPage = function () {
    $location.path('/construction');
  };

  //------- return to the first template
  $scope.backDefaultTemplate = function() {
    $scope.templatePanel.switcherTemplate = false;
    $scope.templatePanel.templateCurrID = 0;
    $scope.initTemplates();
  };

  //=========== Templates Slider
  $scope.initTemplates = function() {
    var currTemplateId = $scope.templatePanel.templateCurrID,
        prevTemplateId = currTemplateId - 1,
        nextTemplateId = currTemplateId + 1;

    if($scope.global.isConstructDoor) {
      $scope.templatePanel.templates = $scope.global.templatesDoorList;
      $scope.templatePanel.templatesIcons = $scope.global.templatesDoorThumbList;
      $scope.templatePanel.templateQty = $scope.global.templatesDoorList.length - 1;
    } else {
      if($scope.global.isConstructWindDoor) {
        $scope.templatePanel.templates = $scope.global.templatesWindDoorList;
        $scope.templatePanel.templatesIcons = $scope.global.templatesWindDoorThumbList;
        $scope.templatePanel.templateQty = $scope.global.templatesWindDoorList.length - 1;
      } else {
        $scope.templatePanel.templates = $scope.global.templatesWindList;
        $scope.templatePanel.templatesIcons = $scope.global.templatesWindThumbList;
        $scope.templatePanel.templateQty = $scope.global.templatesWindList.length - 1;
      }
    }

    if(prevTemplateId < 0) {
      prevTemplateId = $scope.templatePanel.templateQty;
    }
    if(nextTemplateId > $scope.templatePanel.templateQty) {
      nextTemplateId = 0;
    }

    $scope.templatePanel.templateDescription = $scope.templatePanel.templates[currTemplateId].name;
    $scope.templatePanel.templateSVG = $scope.templatePanel.templates[currTemplateId];
    $scope.templatePanel.templateIconPrev = $scope.templatePanel.templatesIcons[prevTemplateId];
    $scope.templatePanel.templateDescriptionPrev = $scope.templatePanel.templates[prevTemplateId].name;
    $scope.templatePanel.templateIconNext = $scope.templatePanel.templatesIcons[nextTemplateId];
    $scope.templatePanel.templateDescriptionNext = $scope.templatePanel.templates[nextTemplateId].name;
    $scope.selectNewTemplate();

  };
  //--------- click on prev template
  $scope.showTemplatePrev = function() {
    $scope.templatePanel.templateCurrID -= 1;
    if($scope.templatePanel.templateCurrID < 0) {
      $scope.templatePanel.templateCurrID = $scope.templatePanel.templateQty;
    }
    $scope.initTemplates();
  };
  //--------- click on next template
  $scope.showTemplateNext = function() {
    $scope.templatePanel.templateCurrID += 1;
    if($scope.templatePanel.templateCurrID > $scope.templatePanel.templateQty) {
      $scope.templatePanel.templateCurrID = 0;
    }
    $scope.initTemplates();
  };

  //---------- select new template and recalculate it price
  $scope.selectNewTemplate = function() {
    $scope.global.templateIndex = $scope.templatePanel.templateCurrID;

    if($scope.global.isConstructDoor) {
      $scope.global.templateSource = $scope.global.templatesDoorSource[$scope.global.templateIndex];
      $scope.global.templateDefault = $scope.global.templatesDoorList[$scope.global.templateIndex];
      $scope.global.product.constructThumb = $scope.global.templatesDoorThumbList[$scope.global.templateIndex];
    } else {
      if($scope.global.isConstructWindDoor) {
        $scope.global.templateSource = $scope.global.templatesWindDoorSource[$scope.global.templateIndex];
        $scope.global.templateDefault = $scope.global.templatesWindDoorList[$scope.global.templateIndex];
        $scope.global.product.constructThumb = $scope.global.templatesWindDoorThumbList[$scope.global.templateIndex];
      } else {
        $scope.global.templateSource = $scope.global.templatesWindSource[$scope.global.templateIndex];
        $scope.global.templateDefault = $scope.global.templatesWindList[$scope.global.templateIndex];
        $scope.global.product.constructThumb = $scope.global.templatesWindThumbList[$scope.global.templateIndex];
      }
    }
    //------ define product price
    $scope.global.createObjXFormedPrice($scope.global.templateDefault, $scope.global.profileIndex, $scope.global.product.profileId);
  };

}]);