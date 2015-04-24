
// controllers/panels/template-selector.js

(function(){
'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('TemplateSelectorCtrl', templateSelectorCtrl);

  function templateSelectorCtrl($scope, $location, $filter, $cordovaDialogs, globalConstants, GlobalStor, OrderStor, ProductStor, optionsServ) {

    var thisCtrl = this;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.order = OrderStor.order;
    thisCtrl.product = ProductStor.product;


    thisCtrl.config = {
      DELAY_TEMPLATE_ELEMENT: 18 * globalConstants.STEP,
      switcherTemplate: false,
      typing: 'on'
    };





    //---------- download templates Img icons
    optionsServ.getTemplateImgIcons(function (results) {
      if (results.status) {
        $scope.global.templatesImgs = results.data.templateImgs;
      } else {
        console.log(results);
      }
    });


    //---------- select new template and recalculate it price
    $scope.selectNewTemplate = function(templateIndex) {
      $scope.templatePanel.switcherTemplate = false;

      function goToNewTemplate(button) {
        if(button == 1) {
          //------ change last changed template to old one
          $scope.backDefaultTemplate();
          $scope.global.isChangedTemplate = false;
          $scope.newPriceForNewTemplate(templateIndex);
        }
      }

      if($scope.global.isChangedTemplate) {
      //----- если выбран новый шаблон после изменения предыдущего
        $cordovaDialogs.confirm(
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
          .then(function(buttonIndex) {
            goToNewTemplate(buttonIndex);
          });
  /*
        navigator.notification.confirm(
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplate,
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
        );


        if(confirm($filter('translate')('common_words.TEMPLATE_CHANGES_LOST'))) {
          //------ change last changed template to old one
          $scope.backDefaultTemplate();
          $scope.global.isChangedTemplate = false;
          $scope.newPriceForNewTemplate(templateIndex);
        }
  */
      } else {
        $scope.newPriceForNewTemplate(templateIndex);
      }
    };


    $scope.newPriceForNewTemplate = function(templateIndex) {
      if(!$scope.global.isFindPriceProcess) {
        $scope.global.isFindPriceProcess = true;
        $scope.global.product.templateIndex = templateIndex;
        $scope.global.saveNewTemplateInProduct(templateIndex);
        //------ define product price
        $scope.global.createObjXFormedPrice($scope.global.templates[templateIndex], $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
      }
    };




    //------ click on top button to change template type
    $scope.toggleTemplate = function() {
      if(!$scope.global.isFindPriceProcess) {
        $scope.templatePanel.switcherTemplate = !$scope.templatePanel.switcherTemplate;
      }
    };


    //------- Select Window/Balcony Entry Template
    $scope.turnOnTemplate = function(marker) {
      $scope.templatePanel.switcherTemplate = false;

      function goToNewTemplateType(button) {
        if(button == 1) {
          if ($scope.global.isConstructDoor) {
            $scope.global.setDefaultDoorConfig();
          }
          //------ change last changed template to old one
          $scope.backDefaultTemplate();
          $scope.global.isChangedTemplate = false;
          $scope.toggleTemplateType(marker);
          $scope.global.getCurrentTemplates();
          $scope.global.saveNewTemplateInProduct($scope.global.product.templateIndex);
          //------ define product price
          $scope.global.createObjXFormedPrice($scope.global.templates[$scope.global.product.templateIndex], $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
        }
      }

      if(!$scope.global.isFindPriceProcess) {
        $scope.global.isFindPriceProcess = true;
        if ($scope.global.isChangedTemplate) {
          //----- если выбран новый шаблон после изменения предыдущего
          $cordovaDialogs.confirm($filter('translate')('common_words.TEMPLATE_CHANGES_LOST'), $filter('translate')('common_words.NEW_TEMPLATE_TITLE'), [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]).then(function (marker) {
              goToNewTemplateType(marker);
            });

        } else {
          $scope.toggleTemplateType(marker);
          $scope.global.getCurrentTemplates();
          $scope.global.saveNewTemplateInProduct($scope.global.product.templateIndex);
          //------ define product price
          $scope.global.createObjXFormedPrice($scope.global.templates[$scope.global.product.templateIndex], $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
        }
      }
    };


    $scope.toggleTemplateType = function(type) {
      switch(type) {
        case 'window':
          $scope.global.product.selectedRoomId = 4;
          $scope.global.isConstructWind = true;
          $scope.global.isConstructWindDoor = false;
          $scope.global.isConstructDoor = false;
          $scope.global.isConstructBalcony = false;
          break;
        case 'balcon':
          $scope.global.product.selectedRoomId = 3;
          $scope.global.isConstructWind = false;
          $scope.global.isConstructWindDoor = false;
          $scope.global.isConstructDoor = false;
          $scope.global.isConstructBalcony = true;
          break;
        case 'door':
          $scope.global.product.selectedRoomId = 6;
          $scope.global.isConstructWind = false;
          $scope.global.isConstructWindDoor = false;
          $scope.global.isConstructDoor = true;
          $scope.global.isConstructBalcony = false;
          break;
        case 'balconEnter':
          $scope.global.product.selectedRoomId = 4;
          $scope.global.isConstructWind = false;
          $scope.global.isConstructWindDoor = true;
          $scope.global.isConstructDoor = false;
          $scope.global.isConstructBalcony = false;
          break;
      }
      $scope.global.product.templateIndex = 0;
    };



    $scope.gotoConstructionPage = function () {
      if(!$scope.global.isFindPriceProcess) {
        $location.path('/construction');
      }
    };

    //------- return to the initial template
    $scope.backDefaultTemplate = function() {
      if($scope.global.isConstructDoor) {
        $scope.global.templatesDoorSource[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesDoorSTORE[$scope.global.product.templateIndex]);
        $scope.global.templatesDoorList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesDoorListSTORE[$scope.global.product.templateIndex]);
        $scope.global.templatesDoorIconList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesDoorIconListSTORE[$scope.global.product.templateIndex]);
      } else if($scope.global.isConstructBalcony) {
        $scope.global.templatesBalconySource[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesBalconySTORE[$scope.global.product.templateIndex]);
        $scope.global.templatesBalconyList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesBalconyListSTORE[$scope.global.product.templateIndex]);
        $scope.global.templatesBalconyIconList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesBalconyIconListSTORE[$scope.global.product.templateIndex]);
      } else if($scope.global.isConstructWindDoor) {
        $scope.global.templatesWindDoorSource[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindDoorSTORE[$scope.global.product.templateIndex]);
        $scope.global.templatesWindDoorList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindDoorListSTORE[$scope.global.product.templateIndex]);
        $scope.global.templatesWindDoorIconList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindDoorIconListSTORE[$scope.global.product.templateIndex]);
      } else if($scope.global.isConstructWind){
        $scope.global.templatesWindSource[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindSTORE[$scope.global.product.templateIndex]);
        $scope.global.templatesWindList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindListSTORE[$scope.global.product.templateIndex]);
        $scope.global.templatesWindIconList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindIconListSTORE[$scope.global.product.templateIndex]);
      }
    };

    //-------- change price if template was changed
    if($scope.global.isChangedTemplate) {
      $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
    }

  }
})();
