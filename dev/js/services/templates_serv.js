(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('TemplatesServ',

  function(
    $filter,
    GeneralServ,
    MainServ,
    DesignServ,
    AnalyticsServ,
    GlobalStor,
    OrderStor,
    ProductStor,
    DesignStor,
    UserStor,
    SVGServ
  ) {
    /*jshint validthis:true */
    var thisFactory = this;
 

    /**============ METHODS ================*/


    function culcPriceNewTemplate(templateIndex) {
      if(ProductStor.product.construction_type === 4) {
        ProductStor.product.template_id = DesignStor.design.template_id;
        DesignStor.designSource.templateSourceTEMP = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
        DesignStor.design.templateSourceTEMP = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
        DesignServ.setDoorConfigDefault(ProductStor.product);
      } else {
        ProductStor.product.template_id = DesignStor.design.template_id;
        MainServ.setCurrentProfile(ProductStor.product, ProductStor.product.profile.id).then(function() {
          MainServ.saveTemplateInProduct(templateIndex).then(function(result) {
            MainServ.setCurrentHardware(ProductStor.product);
            DesignServ.setDefaultConstruction();
            var hardwareIds = ProductStor.product.hardware.id || 0;
            //------ define product price
            MainServ.preparePrice(
              ProductStor.product.template,
              ProductStor.product.profile.id,
              ProductStor.product.glass,
              hardwareIds,
              ProductStor.product.lamination.lamination_in_id
            );
            /** send analytics data to Server*/
            AnalyticsServ.sendAnalyticsData(
              UserStor.userInfo.id,
              OrderStor.order.id,
              ProductStor.product.template_id,
              ProductStor.product.profile.id,
              1
            );
          });
        })
      }
    }



    function newPriceForNewTemplate(templateIndex, roomInd) {
      /** if was selected room */
      if(roomInd) {
        MainServ.closeRoomSelectorDialog();
        ProductStor.product.room_id = roomInd-1;
        if(GlobalStor.global.rooms[roomInd-1].group_id === 4 && GlobalStor.global.noDoorExist) {
          DesignStor.design.isNoDoors = 1;
        } 
        if(ProductStor.product.construction_type !== 4) {
            MainServ.setCurrentProfile(ProductStor.product, 0).then(function(result) {
              culcPriceNewTemplate(templateIndex);
            });
        } else if (ProductStor.product.construction_type === 4) {
          ProductStor.product.template_id = DesignStor.design.template_id;
          DesignStor.designSource.templateSourceTEMP = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
          DesignStor.design.templateSourceTEMP = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
          DesignServ.setDoorConfigDefault(ProductStor.product).then(function(result) {
            ProductStor.product = angular.copy(result);
          });
        } 
      }  
    }



    //------- return to the initial template
    function backDefaultTemplate() {
      var templateTemp = angular.copy(GlobalStor.global.templatesSourceSTORE[ProductStor.product.template_id]);
      GlobalStor.global.templatesSource[ProductStor.product.template_id] = templateTemp;
    }



    //---------- select new template and recalculate it price
     function selectNewTemplate(templateIndex, roomInd, whoCalled) {
      function goToNewTemplate() {
        MainServ.setDefaultDoorConfig();
        DesignServ.setDefaultConstruction();
        //-------- check changes in current template
        GlobalStor.global.isChangedTemplate = (DesignStor.design.designSteps.length) ? 1 : 0;
        if(!whoCalled) {
          ProductStor.product.construction_type = GlobalStor.global.templatesType;
        } else {
          ProductStor.product.construction_type = GlobalStor.global.rooms[roomInd-1].group_id;
        }
        DesignStor.design.template_id = templateIndex;
        GlobalStor.global.selectRoom = 1;
        MainServ.downloadAllTemplates(ProductStor.product.construction_type).then(function(data) {
          if(data) {
            GlobalStor.global.templatesSourceSTORE = angular.copy(data);
            GlobalStor.global.templatesSource = angular.copy(data);
            if(whoCalled === 'main') {
              newPriceForNewTemplate(templateIndex, roomInd);
            } else {
              culcPriceNewTemplate(templateIndex);
            }
          }
        });
      }
      if(GlobalStor.global.isChangedTemplate) {
        //----- если выбран новый шаблон после изменения предыдущего
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplate
        );
      } else {
        goToNewTemplate()
      }
    }





    function initNewTemplateType(marker) {
      ProductStor.product.construction_type = marker;
      ProductStor.product.template_id = 0;
      MainServ.prepareTemplates(marker).then(function() {
        if(GlobalStor.global.currOpenPage === 'design') {
          //--------- set template from ProductStor
          DesignServ.setDefaultConstruction();
        }
      });
    }





    /**========== FINISH ==========*/

    thisFactory.publicObj = {
      selectNewTemplate: selectNewTemplate,
      initNewTemplateType: initNewTemplateType
    };

    return thisFactory.publicObj;

  });
})();
