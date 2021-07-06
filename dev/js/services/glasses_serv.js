(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('HistoryModule')
        .factory('GlassesServ',

            function ($location,
                      $filter,
                      $q,
                      DesignServ, 
                      ProductStor,
                      globalConstants,
                      MainServ,
                      SVGServ,
                      GlobalStor,
                      DesignStor) {
                /*jshint validthis:true */
                var thisFactory = this;


                /**============ METHODS ================*/

                function changePriceAsNewGlass() {
                    var hardwareIds;
                    DesignStor.design.selectedGlass.length = 0;
                    /** set current Glass */
                    SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
                      .then(function(result) {
                        ProductStor.product.template = angular.copy(result);
                        /** calculate price */
                        hardwareIds = ProductStor.product.hardware.id || 0;
                        MainServ.preparePrice(
                          ProductStor.product.template,
                          ProductStor.product.profile.id,
                          ProductStor.product.glass,
                          hardwareIds,
                          ProductStor.product.lamination.lamination_in_id
                        );
                        //------ save analytics data
                        //TODO ??
                        //AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 2);
                      });
                  }

                function confirmGlass() {
                    var selectBlockQty = DesignStor.design.selectedGlass.length,
                      glassesTEMP = angular.copy(ProductStor.product.glass),
                      blockId;
          
                    /** there are selected glasses */
                    if (!selectBlockQty) {
                      MainServ.setGlassToTemplateBlocks(
                        GlobalStor.global.selectGlassType,
                        ProductStor.product.template,
                        GlobalStor.global.selectGlassId,
                        GlobalStor.global.selectGlassName
                      );
                    }
          
                    /** set new Glass in product */
                    MainServ.setCurrentGlass(ProductStor.product, GlobalStor.global.selectGlassId);
          
                    /** Extra Glass finding */
                    MainServ.checkGlassSizes(ProductStor.product.template);
          
                    if (DesignStor.design.extraGlass.length) {
                      /** there are incorrect glasses
                       * expose Alert */
                      DesignStor.design.isGlassExtra = 1;
                      /** return previous Glasses */
                      ProductStor.product.glass = angular.copy(glassesTEMP);
                      /** return prev value in template */
                      MainServ.setGlassToTemplateBlocks(
                        GlobalStor.global.selectGlassType,
                        ProductStor.product.template,
                        GlobalStor.global.prevGlassId,
                        GlobalStor.global.prevGlassName
                      );
                    } else {
                      /** there are selected glasses */
                      if (selectBlockQty) {
                        while (--selectBlockQty > -1) {
                          blockId = DesignStor.design.selectedGlass[selectBlockQty].attributes.block_id.nodeValue;
                          MainServ.setGlassToTemplateBlocks(
                            GlobalStor.global.selectGlassType,
                            ProductStor.product.template_source,
                            GlobalStor.global.selectGlassId,
                            GlobalStor.global.selectGlassName,
                            blockId
                          );
                        }
                        changePriceAsNewGlass();
                        DesignServ.closeGlassSelectorDialog();
                      } else {
                        /** apply current glass to all skylights */
                        setGlassToAll();
                      }
                    }
                    SVGServ.createSVGTemplateIcon(ProductStor.product.template_source, ProductStor.product.profileDepths)
                      .then(function(result) {
                        ProductStor.product.templateIcon = angular.copy(result);
                      });
                  }

                  function setGlassToAll() {
                    MainServ.setGlassToTemplateBlocks(
                      GlobalStor.global.selectGlassType,
                      ProductStor.product.template_source,
                      GlobalStor.global.selectGlassId,
                      GlobalStor.global.selectGlassName
                    );
                    changePriceAsNewGlass();
                    DesignServ.closeGlassSelectorDialog();
                  }

                function selectGlass(newId, newName, type) {
                    GlobalStor.global.isChangedTemplate = 1;
                    GlobalStor.global.prevGlassId = angular.copy(GlobalStor.global.selectGlassId);
                    GlobalStor.global.prevGlassName = angular.copy(GlobalStor.global.selectGlassName);
                    GlobalStor.global.selectGlassId = angular.copy(newId);
                    GlobalStor.global.selectGlassName = angular.copy(newName);
                    GlobalStor.global.selectGlassType = angular.copy(type);
                    //----- open glass selector dialog
                    GlobalStor.global.showGlassSelectorDialog = 1;
                    DesignServ.initAllGlassXGlass();
                    //We are not displaying glass selector block becouse we do not need it, calling function fast
                    confirmGlass();
                    //A small crutch that allows you to display the energy efficiency block on other screens
                    $(document).ready(function() { 
                        $(".coeff-number").addClass('active')
                        $(".config-panel").addClass('lower_z-index')
                        $(".heat-transfer-rehau").addClass('animation')
                        setTimeout(() => {
                            $( ".coeff-number" ).removeClass('active')
                          }, 500);
                        setTimeout(() => {
                          $(".heat-transfer-rehau").animate({
                            opacity: 0
                          }, 300)
                        }, 1500);
                        setTimeout(() => {
                          $(".config-panel").removeClass('lower_z-index')
                        }, 2000);
                        setTimeout(() => {
                          $(".heat-transfer-rehau").animate({
                            opacity: 1
                          }, 300)
                        }, 2200);
                      })
                }

                /**========== FINISH ==========*/
                //------ clicking
                selectGlass: selectGlass;
                confirmGlass: confirmGlass;

                thisFactory.publicObj = {
                    selectGlass: selectGlass,
                    confirmGlass: confirmGlass
                };

                return thisFactory.publicObj;
            });
})();
