(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('TemplatesServ', templatesFactory);

  function templatesFactory(MainServ, GlobalStor, ProductStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      backDefaultTemplate: backDefaultTemplate,
      newPriceForNewTemplate: newPriceForNewTemplate,
      initNewTemplateType: initNewTemplateType
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //------- return to the initial template
    function backDefaultTemplate() {
      GlobalStor.global.templatesSource[ProductStor.product.templateIndex] = angular.copy(GlobalStor.global.templatesSourceSTORE[ProductStor.product.templateIndex]);
//      GlobalStor.global.templates[ProductStor.product.templateIndex] = angular.copy(GlobalStor.global.templatesSTORE[ProductStor.product.templateIndex]);
//      GlobalStor.global.templatesIcon[ProductStor.product.templateIndex] = angular.copy(GlobalStor.global.templatesIconSTORE[ProductStor.product.templateIndex]);
    }

    function newPriceForNewTemplate(templateIndex) {
      if(ProductStor.product.templateIndex !== templateIndex) {
        ProductStor.product.templateIndex = templateIndex;
        MainServ.saveTemplateInProduct(templateIndex).then(function() {
          MainServ.setCurrentHardware();
          //------ define product price
          MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass.list_id, ProductStor.product.hardware.id);
        });
      }
    }


    function initNewTemplateType(marker) {
      ProductStor.product.construction_type = marker;
      ProductStor.product.templateIndex = 0;
      MainServ.prepareTemplates(marker);
    }



  }
})();
