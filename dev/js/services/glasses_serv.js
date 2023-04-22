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
                      AddElementMenuServ,
                      GeneralServ,
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

                function selectGlass(newId, newName, type, glass) {
                    GlobalStor.global.isChangedTemplate = 1;
                    GlobalStor.global.prevGlassId = angular.copy(GlobalStor.global.selectGlassId);
                    GlobalStor.global.prevGlassName = angular.copy(GlobalStor.global.selectGlassName);
                    GlobalStor.global.selectGlassId = angular.copy(newId);
                    GlobalStor.global.selectGlassName = angular.copy(newName);
                    GlobalStor.global.selectGlassType = angular.copy(type);
                    //----- open glass selector dialog
                    GlobalStor.global.showGlassSelectorDialog = 1;
                    DesignServ.initAllGlassXGlass();

                    setTimeout(() => {
                      const apprPrice = ProductStor.product.report
                      .filter((el) => el.sku === newName)
                      .map((glass) => glass.priceReal)
                      .reduce((sum, curr) => sum + curr, 0);
                      GlobalStor.global.apprPrice = Math.floor(apprPrice * 0.95);

                      const amountGlass = ProductStor.product.report
                      .filter((el) => el.sku === newName)
                      .map((glass) => glass.amount)

                      const sizeGlass = ProductStor.product.report
                      .filter((el) => el.sku === newName)
                      .map((glass, index) => glass.size * amountGlass[index])
                      .reduce((sum, curr) => sum + curr, 0);
                      GlobalStor.global.sizeCoeff = sizeGlass;
                    }, 0);
                    //We are not displaying glass selector block becouse we do not need it, just calling the function
                    confirmGlass();
                    //A small crutch that allows you to display the energy efficiency block on other screens
                    $(document).ready(function() { 
                        setTimeout(() => {
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
                        }, 800);
                      })
                      //Sorry about that, but to calculate correct price for glass with ranges I need to call this function
                      setTimeout(() => {
                        MainServ.setProductPriceTOTAL(ProductStor.product)
                      }, 1);
                }

                function closeButton(id) {
                  if (($location.path() === "/light" || $location.path() === "/mobile") && !ProductStor.product.is_addelem_only) {
                    SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
                      DesignStor.design.templateTEMP = angular.copy(result);
                    });
                    ProductStor.product.template_source = DesignStor.design.templateSourceTEMP;
                    ProductStor.product.template = DesignStor.design.templateTEMP;
                    if (DesignStor.design.activeSubMenuItem > 0) {
                      DesignStor.design.activeSubMenuItem = 0;
                      GlobalStor.global.goLeft = false;
                      GlobalStor.global.showTemplates = false;
                      GlobalStor.global.activePanel = 0;
                      $(document).ready(function() {
                        $(".temp-fig-rehau").removeClass("active")
                      })
                    }
                   
                  }
            
                  GlobalStor.global.configMenuTips++;
                  //тут тоже может быть
                  MainServ.laminatFiltering();
                  if (GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
                    /** calc Price previous parameter and close caclulators */
                    AddElementMenuServ.finishCalculators();
                  }
                  //---- hide rooms if opened
                  GlobalStor.global.showRoomSelectorDialog = 0;
                  GlobalStor.global.showCoefInfoBlock = 0;
                  //---- hide tips
                  GlobalStor.global.configMenuTips = 0;
                  //---- hide comment if opened
                  GlobalStor.global.isShowCommentBlock = 0;
                  //---- hide template type menu if opened
                  GlobalStor.global.isTemplateTypeMenu = 0;
            
                  GlobalStor.global.isServiceCalculator = 0;
                  GlobalStor.global.typeMenu = 5555;
                  GlobalStor.global.typeMenuID = 5555;
                  GlobalStor.global.servicesPriceIndex = -1;
            
                  GeneralServ.stopStartProg();
                  MainServ.setDefaultAuxParam();
                  //------ close Glass Selector Dialogs
                  if (GlobalStor.global.showGlassSelectorDialog) {
                    DesignServ.closeGlassSelectorDialog(1);
                  }
            
                  if (id === 1) {
                    GlobalStor.global.templateTEMP = angular.copy(ProductStor.product);
                    GlobalStor.global.activePanel = 0;
                    DesignStor.design.isGlassExtra = 0;
                    $location.path("/design");
                    GlobalStor.global.currOpenPage = 'design';
                    //console.log(DesignStor.design.showHint);
                    if (DesignStor.design.showHint >= 0) {
                      GlobalStor.global.hintTimer = setTimeout(function () {
                        DesignStor.design.showHint = 1;
                      }, 90000);
                    }
                  } else {
                    if (id === 3) {
                      var temp = [];
                      GlobalStor.global.glasses.forEach(function (glass) {
                        glass.forEach(function (glass_img) {
                          temp.push(glass_img.glass_image);
                        });
            
                      });
                      var transcalency_arr = [];
                      var noise_coeff_arr = [];
                      GlobalStor.global.glasses.forEach(function (glass_arr) {
                        glass_arr.forEach(function (glass) {
                          transcalency_arr.push(glass.transcalency);
                          noise_coeff_arr.push(glass.noise_coeff);
                        });
                      });
                      var transcalency_min = Math.min.apply(Math, transcalency_arr);
                      var transcalency_max = Math.max.apply(Math, transcalency_arr);
            
                      var noise_coeff_min = Math.min.apply(Math, noise_coeff_arr);
                      var noise_coeff_max = Math.max.apply(Math, noise_coeff_arr);
            
                      GlobalStor.global.glasses.forEach(function (glass_arr) {
                        glass_arr.forEach(function (glass) {
                          glass.transcalencyD = 1 + Math.floor(((glass.transcalency - transcalency_min) / (transcalency_max - transcalency_min)) * 4);
                          if (glass.noise_coeff !== 0) {
                            glass.noise_coeffD = 1 + Math.floor(((glass.noise_coeff - noise_coeff_min) / (noise_coeff_max - noise_coeff_min)) * 4);
                          } else glass.noise_coeffD = glass.noise_coeff;
                        });
                      });
                    }
                    /** if Door */
                    if (ProductStor.product.construction_type === 4) {
                      //--------- show only Glasses and AddElements
                      if (id === 3 || id === 6 || id === 5) {
                        GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
                      } else {
                        // GlobalStor.global.activePanel = 0;
                        DesignStor.design.isGlassExtra = 0;
                        if ($location.path() !== '/mobile') {
                          if ($location.path() !== '/light') {
                            $location.path("/design")
                            GlobalStor.global.currOpenPage = 'design';
                          } else {
                            $(".config-menu").hide();
                            $(".right-side").width("100%");
                            $(".main-content").width("100%");
                          }
                        }
                        GlobalStor.global.templateTEMP = angular.copy(ProductStor.product);
                        DesignServ.setDoorConfigDefault(ProductStor.product).then(function (result) {
                          if ($location.path() !== '/mobile') {
                            DesignStor.design.steps.isDoorConfig = 1;
                          } else {
                            DesignStor.design.isDoorConfigMobile = 1;
                            DesignStor.design.showMobileStep = 0;
                          }
                        })
                      }
                    } if (id === 8) {
                      let someArray = []
                      GlobalStor.global.templatesImgs.forEach(template => {
                        someArray.push(template.src)
                      })
                    } else {
                      // GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
                      if (GlobalStor.global.activePanel === id) {
                        GlobalStor.global.activePanel = 0;
                        GlobalStor.global.isServiceCalculator = 0;
                        if (($location.path() === '/light' || $location.path() === "/mobile") && !ProductStor.product.is_addelem_only) {
                          setTimeout(function () {
                            DesignServ.rebuildSVGTemplate();
                          }, 1000);
                        }
                      } else {
                        GlobalStor.global.activePanel = id;
                      }
                    }
                  }
                  if (GlobalStor.global.activePanel !== 0 && GlobalStor.global.setTimeout === 0) {
                    GlobalStor.global.setTimeout = 1;
                    $timeout(function () {
                      InfoBoxServ.autoShow(id);
                    }, 4000);
                  }
                }

                /**========== FINISH ==========*/
                //------ clicking
                selectGlass: selectGlass;
                confirmGlass: confirmGlass;
                closeButton: closeButton;

                thisFactory.publicObj = {
                    selectGlass: selectGlass,
                    confirmGlass: confirmGlass,
                    closeButton: closeButton,
                };

                return thisFactory.publicObj;
            });
})();
