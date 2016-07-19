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
    UserStor
  ) {
    /*jshint validthis:true */
    var thisFactory = this;




    /**============ METHODS ================*/


    function culcPriceNewTemplate(templateIndex) {
      ProductStor.product.template_id = templateIndex;
      MainServ.saveTemplateInProduct(templateIndex).then(function() {
        ProductStor.product.glass.length = 0;
        MainServ.setCurrentGlass(ProductStor.product);
        MainServ.setCurrentHardware(ProductStor.product);

        if(GlobalStor.global.currOpenPage === 'design') {
          //--------- set template from ProductStor
          DesignServ.setDefaultConstruction();
        } else {
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
        }
      });
    }



    function newPriceForNewTemplate(templateIndex, roomInd) {
      /** if was selected room */
      if(roomInd) {
        MainServ.closeRoomSelectorDialog();
        ProductStor.product.room_id = roomInd-1;
        // if Door
        if(GlobalStor.global.rooms[roomInd-1].group_id === 4 && GlobalStor.global.noDoorExist) {
          //-------- show alert than door not existed
          DesignStor.design.isNoDoors = 1;
        } else {
          /** set new Template Group */
          if(ProductStor.product.construction_type !== GlobalStor.global.rooms[roomInd-1].group_id) {
            ProductStor.product.construction_type = GlobalStor.global.rooms[roomInd-1].group_id;

            /** rebuild profile */
            MainServ.setCurrentProfile(ProductStor.product, 0);

            /** DOOR */
            if(ProductStor.product.construction_type === 4) {
              DesignServ.setDoorConfigDefault(ProductStor.product);
              //------ cleaning DesignStor
              DesignStor.design = DesignStor.setDefaultDesign();

              //---- set door profile
              ProductStor.product.profile = angular.copy(MainServ.fineItemById(
                DesignStor.design.sashShapeList[ProductStor.product.door_sash_shape_id].profileId,
                GlobalStor.global.profiles
              ));
            }

            MainServ.downloadAllTemplates(ProductStor.product.construction_type).then(function(data) {
              if (data) {
                GlobalStor.global.templatesSourceSTORE = angular.copy(data);
                GlobalStor.global.templatesSource = angular.copy(data);

                culcPriceNewTemplate(templateIndex);
              }
            });
          } else {
            culcPriceNewTemplate(templateIndex);
          }
        }
      } else {
        //if(ProductStor.product.template_id !== templateIndex) {
          culcPriceNewTemplate(templateIndex);
        //}
      }

    }



    //------- return to the initial template
    function backDefaultTemplate() {
      var templateTemp = angular.copy(GlobalStor.global.templatesSourceSTORE[ProductStor.product.template_id]);
      GlobalStor.global.templatesSource[ProductStor.product.template_id] = templateTemp;
    }



    //---------- select new template and recalculate it price
    function selectNewTemplate(templateIndex, roomInd) {
      ProductStor.product.construction_type = GlobalStor.global.templatesType;
      GlobalStor.global.activePanel = 0;
      GlobalStor.global.selectedTemplate = templateIndex;
      GlobalStor.global.isTemplateTypeMenu = 0;

      //-------- check changes in current template
      if(GlobalStor.global.currOpenPage === 'design') {
        GlobalStor.global.isChangedTemplate = (DesignStor.design.designSteps.length) ? 1 : 0;
      }

      function goToNewTemplate() {
        //------ change last changed template to old one
        backDefaultTemplate();
        GlobalStor.global.isChangedTemplate = 0;
        DesignStor.design.designSteps.length = 0;
        newPriceForNewTemplate(templateIndex, roomInd);
      }

      if(GlobalStor.global.isChangedTemplate) {
        //----- если выбран новый шаблон после изменения предыдущего
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplate
        );
      } else {
        newPriceForNewTemplate(templateIndex, roomInd);
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
      //backDefaultTemplate: backDefaultTemplate,
      //newPriceForNewTemplate: newPriceForNewTemplate,
      initNewTemplateType: initNewTemplateType
    };

    return thisFactory.publicObj;

  });
})();
