
// controllers/panels/templates.js

(function(){
'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('TemplatesCtrl', templateSelectorCtrl);

  function templateSelectorCtrl($location, $filter, globalConstants, MainServ, GeneralServ, TemplatesServ, optionsServ, GlobalStor, OrderStor, ProductStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;


    thisCtrl.config = {
      DELAY_TEMPLATE_ELEMENT: 5 * globalConstants.STEP,
      typing: 'on'
    };
    thisCtrl.switcherTemplate = true;


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

      function goToNewTemplate() {
        //------ change last changed template to old one
        TemplatesServ.backDefaultTemplate();
        GlobalStor.global.isChangedTemplate = 0;
        TemplatesServ.newPriceForNewTemplate(templateIndex);
      }

      if(GlobalStor.global.isChangedTemplate) {
      //----- если выбран новый шаблон после изменения предыдущего
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplate
        );
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

      function goToNewTemplateType() {
        if (marker === 4) {
          MainServ.setDefaultDoorConfig();
        }
        GlobalStor.global.isChangedTemplate = false;
        TemplatesServ.initNewTemplateType(marker);
      }

      if (GlobalStor.global.isChangedTemplate) {
        //----- если выбран новый шаблон после изменения предыдущего
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplateType
        );
      } else {
        TemplatesServ.initNewTemplateType(marker);
      }

    }


    function gotoConstructionPage() {
      thisCtrl.G.global.activePanel = 0;
      $location.path('/design');
    }


  }
})();
