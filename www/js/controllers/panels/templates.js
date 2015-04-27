
// controllers/panels/templates.js

(function(){
'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('TemplatesCtrl', templateSelectorCtrl);

  function templateSelectorCtrl($location, $filter, $cordovaDialogs, globalConstants, MainServ, TemplatesServ, optionsServ, GlobalStor, OrderStor, ProductStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.order = OrderStor.order;
    thisCtrl.product = ProductStor.product;


    thisCtrl.config = {
      DELAY_TEMPLATE_ELEMENT: 5 * globalConstants.STEP,
      typing: 'on'
    };
    thisCtrl.switcherTemplate = false;


    //---------- download templates Img icons
    optionsServ.getTemplateImgIcons(function (results) {
      if (results.status) {
        thisCtrl.templatesImgs = results.data.templateImgs;
      } else {
        console.log(results);
      }
    });


    //------ clicking

    thisCtrl.selectNewTemplate = selectNewTemplate;
    thisCtrl.toggleTemplateType = toggleTemplateType;
    thisCtrl.selectNewTemplateType = selectNewTemplateType;
    thisCtrl.gotoConstructionPage = gotoConstructionPage;




    //============ methods ================//

    //---------- select new template and recalculate it price
    function selectNewTemplate(templateIndex) {
        thisCtrl.switcherTemplate = false;

      function goToNewTemplate(button) {
        if(button == 1) {
          //------ change last changed template to old one
          TemplatesServ.backDefaultTemplate();
          GlobalStor.global.isChangedTemplate = false;
          TemplatesServ.newPriceForNewTemplate(templateIndex);
        }
      }

      if(GlobalStor.global.isChangedTemplate) {
      //----- если выбран новый шаблон после изменения предыдущего
        $cordovaDialogs.confirm(
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
          .then(function(buttonIndex) {
            goToNewTemplate(buttonIndex);
          });

      } else {
        TemplatesServ.newPriceForNewTemplate(templateIndex);
      }
    }



    //------ click on top button to change template type
    function toggleTemplateType() {
      thisCtrl.switcherTemplate = !thisCtrl.switcherTemplate;
    }


    //------- Select new Template Type
    function selectNewTemplateType(marker) {
        thisCtrl.switcherTemplate = false;

      function goToNewTemplateType(button) {
        if(button == 1) {

          if (marker === 4) {
            MainServ.setDefaultDoorConfig();
          }
          GlobalStor.global.isChangedTemplate = false;
          TemplatesServ.initNewTemplateType(marker);
        }
      }

      if (GlobalStor.global.isChangedTemplate) {
        //----- если выбран новый шаблон после изменения предыдущего
        $cordovaDialogs.confirm(
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
          .then(function (marker) {
            goToNewTemplateType(marker);
          });

      } else {
        TemplatesServ.initNewTemplateType(marker);
      }

    }







    function gotoConstructionPage() {
      $location.path('/construction');
    }



//    //-------- change price if template was changed
//    if(GlobalStor.global.isChangedTemplate) {
//      $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
//    }

  }
})();
