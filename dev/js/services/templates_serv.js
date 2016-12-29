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
      ProductStor.product.template_id = templateIndex;
      MainServ.saveTemplateInProduct(templateIndex).then(function() {
        // строка была закомичена из-за что не производился расчет стеклопакетов.
        ProductStor.product.glass.length = 0;
        MainServ.setCurrentHardware(ProductStor.product);

        if(GlobalStor.global.currOpenPage === 'design') {
          //--------- set template from ProductStor
          if(ProductStor.product.construction_type !== 4) {
            DesignServ.setDefaultConstruction();
          } else {
            DesignServ.setDoorConfigDefault(ProductStor.product);
          }
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
        } 
          /** set new Template Group */
          if(ProductStor.product.construction_type !== GlobalStor.global.rooms[roomInd-1].group_id || ProductStor.product.construction_type===4) {
            ProductStor.product.construction_type = GlobalStor.global.rooms[roomInd-1].group_id;
            if(ProductStor.product.construction_type !== 4) {

              /** rebuild profile */
              MainServ.setCurrentProfile(ProductStor.product, 0);

              /** DOOR */
              // if(ProductStor.product.construction_type === 4) {
              //   //------ cleaning DesignStor
              //   DesignStor.design = DesignStor.setDefaultDesign();

              //   //---- set door profile
              //   ProductStor.product.profile = angular.copy(MainServ.fineItemById(
              //     DesignStor.design.sashShapeList[ProductStor.product.door_sash_shape_id].profileId,
              //     GlobalStor.global.profiles
              //   ));
              // }
            } 
            MainServ.downloadAllTemplates(ProductStor.product.construction_type).then(function(data) {
              if (data) {
                GlobalStor.global.templatesSourceSTORE = angular.copy(data);
                GlobalStor.global.templatesSource = angular.copy(data);
                if (ProductStor.product.construction_type === 4) {
                  ProductStor.product.template_source = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
                  DesignStor.design.templateSourceTEMP = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
                  SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
                    ProductStor.product.template = angular.copy(result);
                    MainServ.setCurrentGlass(ProductStor.product);
                    DesignServ.setDoorConfigDefault(ProductStor.product).then(function() {
                      //culcPriceNewTemplate(templateIndex);
                    });
                  });
                } else {
                  culcPriceNewTemplate(templateIndex);
                }
              }
            });
          } else {
            culcPriceNewTemplate(templateIndex);
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
      //-------- check changes in current template
      GlobalStor.global.isChangedTemplate = (DesignStor.design.designSteps.length) ? 1 : 0;
      ProductStor.product.construction_type = (roomInd)?GlobalStor.global.rooms[roomInd-1].group_id:GlobalStor.global.templatesType;

      function goToNewTemplate() {
        MainServ.setDefaultDoorConfig();
        if(ProductStor.product.construction_type !==4) {
          ProductStor.product.template_id = templateIndex;
          MainServ.prepareTemplates(ProductStor.product.construction_type).then(function() {
            if(GlobalStor.global.currOpenPage === 'design') {
              //--------- set template from ProductStor
              DesignServ.setDefaultConstruction();
            }
              //newPriceForNewTemplate(templateIndex, roomInd);

          });
        } else if(ProductStor.product.construction_type ==4 && !roomInd) {
          ProductStor.product.template_source = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
          var tempProduct = angular.copy(ProductStor.product);
          var tempProfile = angular.copy(DesignServ.idsForNewTemplate(ProductStor.product.door_shape_id, ProductStor.product));
          tempProduct.profile = angular.copy(tempProfile);
          ProductStor.product.template_id = templateIndex;
          MainServ.setCurrentDoorProfile(tempProduct).then(function(result){
            ProductStor.product = angular.copy(result);
            SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
              ProductStor.product.template = angular.copy(result);
              MainServ.setCurrentGlass(ProductStor.product);
              DesignServ.setDoorConfigDefault(ProductStor.product).then(function() {
                //culcPriceNewTemplate(templateIndex);
              });
            });
          });
        } else if(ProductStor.product.construction_type ==4 && roomInd) {
          newPriceForNewTemplate(templateIndex, roomInd);
        }
        //------ change last changed template to old one
        backDefaultTemplate();
        GlobalStor.global.isChangedTemplate = 0;
        DesignStor.design.designSteps.length = 0;
      }

      if(GlobalStor.global.isChangedTemplate) {
        //----- если выбран новый шаблон после изменения предыдущего
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplate
        );
      } else {
        MainServ.setDefaultDoorConfig();
        if(ProductStor.product.construction_type !==4) {
          ProductStor.product.template_id = templateIndex;
          MainServ.prepareTemplates(ProductStor.product.construction_type).then(function() {
            if(GlobalStor.global.currOpenPage === 'design') {
              //--------- set template from ProductStor
              DesignServ.setDefaultConstruction();
            }
              //newPriceForNewTemplate(templateIndex, roomInd);

          });
        } else if(ProductStor.product.construction_type ==4 && !roomInd) {
          ProductStor.product.template_source = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
          var tempProduct = angular.copy(ProductStor.product);
          var tempProfile = angular.copy(DesignServ.idsForNewTemplate(ProductStor.product.door_shape_id, ProductStor.product));
          tempProduct.profile = angular.copy(tempProfile);
          ProductStor.product.template_id = templateIndex;
          MainServ.setCurrentDoorProfile(tempProduct).then(function(result){
            ProductStor.product = angular.copy(result);
            SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
              ProductStor.product.template = angular.copy(result);
              MainServ.setCurrentGlass(ProductStor.product);
              DesignServ.setDoorConfigDefault(ProductStor.product).then(function() {
                //culcPriceNewTemplate(templateIndex);
              });
            });
          });
        } else if(ProductStor.product.construction_type ==4 && roomInd) {
          newPriceForNewTemplate(templateIndex, roomInd);
        }
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
