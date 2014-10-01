/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('TemplateSelectorCtrl', ['$scope', 'constructService', '$location', 'globalData', function ($scope, constructService, $location, globalData) {

  $scope.global = globalData;

  $scope.templatePanel = {
    DELAY_TEMPLATE_ELEMENT: 5 * STEP,
    switcherTemplate: false,
    templateCurrID: 1,
    typing: 'on'
  };

  constructService.getAllTemplates(function (results) {
    if (results.status) {
      $scope.templatePanel.templates = results.data.templatesWindow;
      $scope.templatePanel.templateQty = results.data.templatesWindow.length - 1;
    } else {
      console.log(results);
    }
  });

  // Select Window/Balcony Template
  $scope.toggleTemplate = function() {
    $scope.templatePanel.switcherTemplate = !$scope.templatePanel.switcherTemplate;
  };

  $scope.gotoConstructionPage = function () {
    $location.path('/construction');
  };

  // Templates Slider
  $scope.initTemplates = function() {
    var currTemplateId = $scope.templatePanel.templateCurrID;
    var prevTemplateId = currTemplateId - 1;
    var nextTemplateId = currTemplateId + 1;

    if(prevTemplateId < 0) {
      prevTemplateId = $scope.templatePanel.templateQty;
    }
    if(nextTemplateId > $scope.templatePanel.templateQty) {
      nextTemplateId = 0;
    }

    $scope.templatePanel.templateDescription = $scope.templatePanel.templates[currTemplateId].templateDescrip;
    $scope.templatePanel.templateSVG = $scope.templatePanel.templates[currTemplateId].templateSVG;

    $scope.templatePanel.templateTitlePrev = $scope.templatePanel.templates[prevTemplateId].templateTitle;
    $scope.templatePanel.templateImgPrev = $scope.templatePanel.templates[prevTemplateId].templateUrl;
    $scope.templatePanel.templateDescriptionPrev = $scope.templatePanel.templates[prevTemplateId].templateDescrip;

    $scope.templatePanel.templateTitleNext = $scope.templatePanel.templates[nextTemplateId].templateTitle;
    $scope.templatePanel.templateImgNext = $scope.templatePanel.templates[nextTemplateId].templateUrl;
    $scope.templatePanel.templateDescriptionNext = $scope.templatePanel.templates[nextTemplateId].templateDescrip;
  };

  $scope.showTemplatePrev = function() {
    $scope.templatePanel.templateCurrID -= 1;
    if($scope.templatePanel.templateCurrID < 0) {
      $scope.templatePanel.templateCurrID = $scope.templatePanel.templateQty;
    }
    $scope.initTemplates();
  };
  $scope.showTemplateNext = function() {
    $scope.templatePanel.templateCurrID += 1;
    if($scope.templatePanel.templateCurrID > $scope.templatePanel.templateQty) {
      $scope.templatePanel.templateCurrID = 0;
    }
    $scope.initTemplates();
  };

}]);