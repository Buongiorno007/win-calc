(function(){
'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('TemplatesCtrl',

  function(
    $location,
    $filter,
    globalConstants,
    MainServ,
    GeneralServ,
    TemplatesServ,
    optionsServ,
    GlobalStor,
    DesignStor,
    OrderStor,
    ProductStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;


    thisCtrl.config = {
      DELAY_TEMPLATE_ELEMENT: 5 * globalConstants.STEP,
      typing: 'on'
    };

    thisCtrl.templateName = [
      'panels.TEMPLATE_WINDOW_HAND',
      'panels.TEMPLATE_BALCONY_HAND',
      'panels.TEMPLATE_DOOR_HAND'
    ]
    thisCtrl.selected = ProductStor.product.construction_type;
    //------- translate
    thisCtrl.TEMPLATE_WINDOW_HAND = $filter('translate')('panels.TEMPLATE_WINDOW_HAND');
    thisCtrl.TEMPLATE_BALCONY_HAND = $filter('translate')('panels.TEMPLATE_BALCONY_HAND');
    thisCtrl.TEMPLATE_DOOR_HAND = $filter('translate')('panels.TEMPLATE_DOOR_HAND');

    thisCtrl.TEMPLATE_WINDOW = $filter('translate')('panels.TEMPLATE_WINDOW');
    thisCtrl.TEMPLATE_DOOR = $filter('translate')('panels.TEMPLATE_DOOR');
    thisCtrl.TEMPLATE_BALCONY_ENTER = $filter('translate')('panels.TEMPLATE_BALCONY_ENTER');
    thisCtrl.TEMPLATE_BALCONY = $filter('translate')('panels.TEMPLATE_BALCONY');


    //---------- download templates Img icons
        optionsServ.getTemplateImgIcons(function (results) {
          if (results.status)  {
            GlobalStor.global.templatesImgs = results.data.templateImgs;
          } else {
            console.log(results);
          }
        });



    /**============ METHODS ================*/


    //------ click on top button to change template type
    function toggleTemplateType() {
      GlobalStor.global.isTemplateTypeMenu = !GlobalStor.global.isTemplateTypeMenu;
    }

    //------- Select new Template Type
    function selectNewTemplateType(marker) {
      GlobalStor.global.activePanel = -1;
      GlobalStor.global.selectedTemplate = -1;
      thisCtrl.selected = marker;
      marker = (marker===3)? 4:marker;

      GlobalStor.global.templatesType = marker;

      optionsServ.getTemplateImgIcons(function (results) {
        if (results.status) {
          GlobalStor.global.templatesImgs = results.data.templateImgs.filter(function(data) {
            return data.type === marker;
          });
        };
      });
      
      MainServ.downloadAllTemplates(marker).then(function(data) {
        if (data) {
          GlobalStor.global.templatesSourceSTORE = angular.copy(data);
          GlobalStor.global.templatesSource = angular.copy(data);
        }
      });

      GlobalStor.global.isTemplateTypeMenu = 0;
    }



    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.selectNewTemplate = TemplatesServ.selectNewTemplate;
    thisCtrl.toggleTemplateType = toggleTemplateType;
    thisCtrl.selectNewTemplateType = selectNewTemplateType;

  });
})();
