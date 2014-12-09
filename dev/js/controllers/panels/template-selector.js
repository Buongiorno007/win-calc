/* globals BauVoiceApp, STEP, */

'use strict';

BauVoiceApp.controller('TemplateSelectorCtrl', ['$scope', 'constructService', '$location', 'localStorage', function ($scope, constructService, $location, localStorage) {

  $scope.global = localStorage;

  $scope.templatePanel = {
    DELAY_TEMPLATE_ELEMENT: 5 * STEP,
    switcherTemplate: false,
    typing: 'on'
  };

  //------ click on top Window button
  $scope.toggleTemplate = function() {
    $scope.templatePanel.switcherTemplate = !$scope.templatePanel.switcherTemplate;
  };
  //------- Select Window/Balcony Entry Template
  $scope.turnOnTemplate = function(marker) {
    if(marker === 'balcon') {
      $scope.global.isConstructWindDoor = true;
      $scope.global.isConstructWind = false;
    } else if(marker === 'window') {
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructWind = true;
    }
    $scope.templatePanel.switcherTemplate = false;
    $scope.global.templateIndex = 0;
    $scope.global.initTemplates();
  };

  $scope.gotoConstructionPage = function () {
    console.log('template');
    console.log($scope.global.templateSource);
    $location.path('/construction');
  };

  //------- return to the initial template
  $scope.backDefaultTemplate = function() {
    $scope.templatePanel.switcherTemplate = false;

    if($scope.global.isConstructDoor) {
      $scope.global.templatesDoorSource[$scope.global.templateIndex] = angular.copy($scope.global.templatesDoorSTORE[$scope.global.templateIndex]);
      $scope.global.templatesDoorList[$scope.global.templateIndex] = angular.copy($scope.global.templatesDoorListSTORE[$scope.global.templateIndex]);
      $scope.global.templatesDoorThumbList[$scope.global.templateIndex] = angular.copy($scope.global.templatesDoorThumbListSTORE[$scope.global.templateIndex]);
    } else if($scope.global.isConstructBalcony) {
      $scope.global.templatesBalconySource[$scope.global.templateIndex] = angular.copy($scope.global.templatesBalconySTORE[$scope.global.templateIndex]);
      $scope.global.templatesBalconyList[$scope.global.templateIndex] = angular.copy($scope.global.templatesBalconyListSTORE[$scope.global.templateIndex]);
      $scope.global.templatesBalconyThumbList[$scope.global.templateIndex] = angular.copy($scope.global.templatesBalconyThumbListSTORE[$scope.global.templateIndex]);
    } else if($scope.global.isConstructWindDoor) {
      $scope.global.templatesWindDoorSource[$scope.global.templateIndex] = angular.copy($scope.global.templatesWindDoorSTORE[$scope.global.templateIndex]);
      $scope.global.templatesWindDoorList[$scope.global.templateIndex] = angular.copy($scope.global.templatesWindDoorListSTORE[$scope.global.templateIndex]);
      $scope.global.templatesWindDoorThumbList[$scope.global.templateIndex] = angular.copy($scope.global.templatesWindDoorThumbListSTORE[$scope.global.templateIndex]);
    } else if($scope.global.isConstructWind){
      $scope.global.templatesWindSource[$scope.global.templateIndex] = angular.copy($scope.global.templatesWindSTORE[$scope.global.templateIndex]);
      $scope.global.templatesWindList[$scope.global.templateIndex] = angular.copy($scope.global.templatesWindListSTORE[$scope.global.templateIndex]);
      $scope.global.templatesWindThumbList[$scope.global.templateIndex] = angular.copy($scope.global.templatesWindThumbListSTORE[$scope.global.templateIndex]);
    }

    $scope.global.initTemplates();
  };

  //=========== Templates Slider

  $scope.global.initTemplates = function() {
    var prevTemplateId = $scope.global.templateIndex - 1,
        nextTemplateId = $scope.global.templateIndex + 1;

    if($scope.global.isConstructDoor) {
      $scope.templatePanel.templates = $scope.global.templatesDoorList;
      $scope.templatePanel.templatesIcons = $scope.global.templatesDoorThumbList;
      $scope.templatePanel.templateQty = $scope.global.templatesDoorList.length - 1;
    } else if($scope.global.isConstructBalcony) {
      $scope.templatePanel.templates = $scope.global.templatesBalconyList;
      $scope.templatePanel.templatesIcons = $scope.global.templatesBalconyThumbList;
      $scope.templatePanel.templateQty = $scope.global.templatesBalconyList.length - 1;
    } else if($scope.global.isConstructWindDoor) {
      $scope.templatePanel.templates = $scope.global.templatesWindDoorList;
      $scope.templatePanel.templatesIcons = $scope.global.templatesWindDoorThumbList;
      $scope.templatePanel.templateQty = $scope.global.templatesWindDoorList.length - 1;
    } else if($scope.global.isConstructWind){
      $scope.templatePanel.templates = $scope.global.templatesWindList;
      $scope.templatePanel.templatesIcons = $scope.global.templatesWindThumbList;
      $scope.templatePanel.templateQty = $scope.global.templatesWindList.length - 1;
    }

    if(prevTemplateId < 0) {
      prevTemplateId = $scope.templatePanel.templateQty;
    }
    if(nextTemplateId > $scope.templatePanel.templateQty) {
      nextTemplateId = 0;
    }

    $scope.templatePanel.templateDescription = $scope.templatePanel.templates[$scope.global.templateIndex].name;
    $scope.templatePanel.templateSVG = $scope.templatePanel.templates[$scope.global.templateIndex];

    $scope.templatePanel.templateIconPrev = $scope.templatePanel.templatesIcons[prevTemplateId];
    $scope.templatePanel.templateDescriptionPrev = $scope.templatePanel.templates[prevTemplateId].name;
    $scope.templatePanel.templateIconNext = $scope.templatePanel.templatesIcons[nextTemplateId];
    $scope.templatePanel.templateDescriptionNext = $scope.templatePanel.templates[nextTemplateId].name;

    $scope.selectNewTemplate();
  };


  //--------- click on prev template
  $scope.showTemplatePrev = function() {
    event.preventDefault();
    if(!$scope.global.isFindPriceProcess) {
      $scope.global.isFindPriceProcess = true;
      $scope.global.templateIndex -= 1;
      if($scope.global.templateIndex < 0) {
        $scope.global.templateIndex = $scope.templatePanel.templateQty;
      }

      $scope.global.initTemplates();
    }
  };
  //--------- click on next template
  $scope.showTemplateNext = function() {
    event.preventDefault();
    if(!$scope.global.isFindPriceProcess) {
      $scope.global.isFindPriceProcess = true;
      $scope.global.templateIndex += 1;
      if ($scope.global.templateIndex > $scope.templatePanel.templateQty) {
        $scope.global.templateIndex = 0;
      }
      $scope.global.initTemplates();
    }
  };

  //---------- select new template and recalculate it price
  $scope.selectNewTemplate = function() {

    if($scope.global.isConstructDoor) {
      $scope.global.templateSource = $scope.global.templatesDoorSource[$scope.global.templateIndex];
      $scope.global.templateDefault = $scope.global.templatesDoorList[$scope.global.templateIndex];
      $scope.global.product.constructThumb = $scope.global.templatesDoorThumbList[$scope.global.templateIndex];
    } else if($scope.global.isConstructBalcony) {
      $scope.global.templateSource = $scope.global.templatesBalconySource[$scope.global.templateIndex];
      $scope.global.templateDefault = $scope.global.templatesBalconyList[$scope.global.templateIndex];
      $scope.global.product.constructThumb = $scope.global.templatesBalconyThumbList[$scope.global.templateIndex];
    } else if($scope.global.isConstructWindDoor) {
      $scope.global.templateSource = $scope.global.templatesWindDoorSource[$scope.global.templateIndex];
      $scope.global.templateDefault = $scope.global.templatesWindDoorList[$scope.global.templateIndex];
      $scope.global.product.constructThumb = $scope.global.templatesWindDoorThumbList[$scope.global.templateIndex];
    } else if($scope.global.isConstructWind){
      $scope.global.templateSource = $scope.global.templatesWindSource[$scope.global.templateIndex];
      $scope.global.templateDefault = $scope.global.templatesWindList[$scope.global.templateIndex];
      $scope.global.product.constructThumb = $scope.global.templatesWindThumbList[$scope.global.templateIndex];
    }
    //------ define product price
    $scope.global.createObjXFormedPrice($scope.global.templateDefault, $scope.global.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId);
  };


  //------- запускаем карусель шаблонов после как изменили размеры
  if($scope.global.isReturnFromConstructionPage) {
    $scope.global.initTemplates();
    $scope.global.isReturnFromConstructionPage = false;
  }
  if($scope.global.isReturnFromCartPage) {
    $scope.global.initTemplates();
    $scope.global.isReturnFromCartPage = false;
  }
}]);