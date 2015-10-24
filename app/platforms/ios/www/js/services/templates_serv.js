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
      GlobalStor.global.templatesSource[ProductStor.product.template_id] = angular.copy(GlobalStor.global.templatesSourceSTORE[ProductStor.product.template_id]);
    }

    function newPriceForNewTemplate(templateIndex) {
      if(ProductStor.product.template_id !== templateIndex) {
        ProductStor.product.template_id = templateIndex;
        MainServ.saveTemplateInProduct(templateIndex).then(function() {
          MainServ.setCurrentHardware(ProductStor.product);
          var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
          //------ define product price
          MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass[0].id, hardwareIds);
        });
      }
    }


    function initNewTemplateType(marker) {
      ProductStor.product.construction_type = marker;
      ProductStor.product.template_id = 0;
      MainServ.prepareTemplates(marker);
    }



  }
})();
