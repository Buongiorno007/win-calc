(function(){
'use strict';
  /**@ngInject*/
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


    //---------- download templates Img icons
    optionsServ.getTemplateImgIcons(function (results) {
      if (results.status) {
        thisCtrl.templatesImgs = results.data.templateImgs;
      } else {
        console.log(results);
      }
    });


    //------ clicking

    thisCtrl.selectNewTemplate = TemplatesServ.selectNewTemplate;
    thisCtrl.toggleTemplateType = toggleTemplateType;
    thisCtrl.selectNewTemplateType = selectNewTemplateType;
    thisCtrl.gotoConstructionPage = gotoConstructionPage;




    //============ methods ================//


    //------ click on top button to change template type
    function toggleTemplateType() {
      GlobalStor.global.isTemplateTypeMenu = !GlobalStor.global.isTemplateTypeMenu;
    }


    //------- Select new Template Type
    function selectNewTemplateType(marker) {
      GlobalStor.global.isTemplateTypeMenu = 0;

      function goToNewTemplateType() {
        if (marker === 4) {
          MainServ.setDefaultDoorConfig();
        }
        GlobalStor.global.isChangedTemplate = 0;
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