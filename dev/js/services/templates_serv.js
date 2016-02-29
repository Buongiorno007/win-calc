(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('TemplatesServ', templatesFactory);

  function templatesFactory($filter, GeneralServ, MainServ, AnalyticsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      selectNewTemplate: selectNewTemplate,
      //backDefaultTemplate: backDefaultTemplate,
      //newPriceForNewTemplate: newPriceForNewTemplate,
      initNewTemplateType: initNewTemplateType
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //---------- select new template and recalculate it price
    function selectNewTemplate(templateIndex, roomInd) {
      GlobalStor.global.isTemplateTypeMenu = 0;

      function goToNewTemplate() {
        //------ change last changed template to old one
        backDefaultTemplate();
        GlobalStor.global.isChangedTemplate = 0;
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


    //------- return to the initial template
    function backDefaultTemplate() {
      GlobalStor.global.templatesSource[ProductStor.product.template_id] = angular.copy(GlobalStor.global.templatesSourceSTORE[ProductStor.product.template_id]);
    }



    function newPriceForNewTemplate(templateIndex, roomInd) {
      /** if was selected room */
      if(roomInd) {
        MainServ.closeRoomSelectorDialog();
        ProductStor.product.room_id = roomInd-1;
        /** set new Template Group */
        if(ProductStor.product.construction_type !== GlobalStor.global.rooms[roomInd-1].group_id) {
          ProductStor.product.construction_type = GlobalStor.global.rooms[roomInd-1].group_id;
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

      } else {
        if(ProductStor.product.template_id !== templateIndex) {
          culcPriceNewTemplate(templateIndex);
        }
      }

    }


    function culcPriceNewTemplate(templateIndex) {
      ProductStor.product.template_id = templateIndex;
      MainServ.saveTemplateInProduct(templateIndex).then(function() {
        ProductStor.product.glass.length = 0;
        MainServ.setCurrentGlass(ProductStor.product);
        MainServ.setCurrentHardware(ProductStor.product);
        var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
        //------ define product price
        MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, hardwareIds, ProductStor.product.lamination.img_in_id);
        //------ save analytics data
        //          AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, ProductStor.product.profile.id, 1);
        /** send analytics data to Server*/
        AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, ProductStor.product.profile.id, 1);
      });
    }



    function initNewTemplateType(marker) {
      ProductStor.product.construction_type = marker;
      ProductStor.product.template_id = 0;
      MainServ.prepareTemplates(marker);
    }



  }
})();
