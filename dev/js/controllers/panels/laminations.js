(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .controller('LaminationsCtrl',

            function ($filter,
                      $location,
                      globalConstants,
                      MainServ,
                      GlobalStor,
                      OrderStor,
                      DesignStor,
                      ProductStor,
                      DesignServ,
                      AddElementMenuServ,
                      SVGServ,
                      GeneralServ, 
                      UserStor) {
                /*jshint validthis:true */
                var thisCtrl = this;
                thisCtrl.G = GlobalStor;
                thisCtrl.P = ProductStor;
                thisCtrl.U = UserStor;

                thisCtrl.config = {
                    DELAY_START: 5 * globalConstants.STEP,
                    DELAY_BLOCK: 2 * globalConstants.STEP,
                    DELAY_TYPING: 2.5 * globalConstants.STEP,
                    typing: 'on'
                };
                thisCtrl.OpenFolder = -1;
                //------- translate
                thisCtrl.LAMINAT_INSIDE = $filter('translate')('panels.LAMINAT_INSIDE');
                thisCtrl.LAMINAT_OUTSIDE = $filter('translate')('panels.LAMINAT_OUTSIDE');
                thisCtrl.INTERIOR = $filter('translate')('panels.INTERIOR');
                thisCtrl.FACADE = $filter('translate')('panels.FACADE');
                thisCtrl.LAMINAT_IN_NAME = $filter('translate')('mainpage.LAMINAT_IN_NAME');
                thisCtrl.LAMINAT_IN_NAME_2 = $filter('translate')('mainpage.LAMINAT_IN_NAME_2');
                thisCtrl.LAMINAT_IN_NAME_3 = $filter('translate')('mainpage.LAMINAT_IN_NAME_3');
                thisCtrl.LAMINAT_IN_NAME_4 = $filter('translate')('mainpage.LAMINAT_IN_NAME_4');
                thisCtrl.LAMINAT_IN_NAME_5 = $filter('translate')('mainpage.LAMINAT_IN_NAME_5');
                thisCtrl.LAMINAT_IN_NAME_6 = $filter('translate')('mainpage.LAMINAT_IN_NAME_6');
                thisCtrl.LAMINAT_IN_NAME_7 = $filter('translate')('mainpage.LAMINAT_IN_NAME_7');
                thisCtrl.LAMINAT_IN_NAME_8 = $filter('translate')('mainpage.LAMINAT_IN_NAME_8');
                thisCtrl.LAMINAT_IN_NAME_9 = $filter('translate')('mainpage.LAMINAT_IN_NAME_9');
                thisCtrl.LAMINAT_IN_NAME_10 = $filter('translate')('mainpage.LAMINAT_IN_NAME_10');
                thisCtrl.LAMINAT_IN_NAME_11 = $filter('translate')('mainpage.LAMINAT_IN_NAME_11');
                thisCtrl.LAMINAT_IN_NAME_12 = $filter('translate')('mainpage.LAMINAT_IN_NAME_12');
                thisCtrl.LAMINAT_IN_NAME_13 = $filter('translate')('mainpage.LAMINAT_IN_NAME_13');
                thisCtrl.LAMINAT_IN_NAME_14 = $filter('translate')('mainpage.LAMINAT_IN_NAME_14');
                thisCtrl.LAMINAT_IN_NAME_15 = $filter('translate')('mainpage.LAMINAT_IN_NAME_15');
                thisCtrl.WHITE_LAMINATION = $filter('translate')('mainpage.WHITE_LAMINATION');
                thisCtrl.ANTHRACITE_LAMINATION = $filter('translate')('mainpage.ANTHRACITE_LAMINATION');
                thisCtrl.ANTHRACITE_IDEAL_LAMINATION = $filter('translate')('mainpage.ANTHRACITE_IDEAL_LAMINATION');
                thisCtrl.GOLDEN_OAK_LAMINATION = $filter('translate')('mainpage.GOLDEN_OAK_LAMINATION');
                thisCtrl.GOLDEN_OAK_IDEAL_LAMINATION = $filter('translate')('mainpage.GOLDEN_OAK_IDEAL_LAMINATION');
                thisCtrl.GOLDEN_OAK_BASE_LAMINATION = $filter('translate')('mainpage.GOLDEN_OAK_BASE_LAMINATION');
                thisCtrl.WALNUT_LAMINATION = $filter('translate')('mainpage.WALNUT_LAMINATION');
                thisCtrl.WALNUT_IDEAL_LAMINATION = $filter('translate')('mainpage.WALNUT_IDEAL_LAMINATION');
                thisCtrl.WALNUT_BASE_LAMINATION = $filter('translate')('mainpage.WALNUT_BASE_LAMINATION');
                thisCtrl.DARK_OAK_LAMINATION = $filter('translate')('mainpage.DARK_OAK_LAMINATION ');
                thisCtrl.DARK_OAK_IDEAL_LAMINATION = $filter('translate')('mainpage.DARK_OAK_IDEAL_LAMINATION');
                thisCtrl.DARK_OAK_BASE_LAMINATION = $filter('translate')('mainpage.DARK_OAK_BASE_LAMINATION');

                /**============ METHODS ================*/
                /** init Laminat Filter */
                function initLaminatFilter(typeId) {
                    // console.info('init filter --- ', typeId);
                    var laminatQty = GlobalStor.global.laminats.length;
                    while (--laminatQty > -1) {
                        if (GlobalStor.global.laminats[laminatQty].lamination_type_id === typeId) {
                            GlobalStor.global.laminats[laminatQty].isActive = !GlobalStor.global.laminats[laminatQty].isActive;
                            //console.info('init filter --- ', GlobalStor.global.laminats[laminatQty]);
                            MainServ.laminatFiltering();
                        }
                    }
                }

                //------------ Select lamination
                function selectLaminat(id) {
                    GlobalStor.global.isChangedTemplate = 1;
                    MainServ.laminatFiltering();
                    MainServ.setCurrLamination(ProductStor.product, id);

                    MainServ.setProfileByLaminat(id).then(function () {
                        //------ save analytics data
                        /** send analytics data to Server*/
                        //TODO AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id,OrderStor.order.id,ProductStor.product.template_id, id, 4);
                        GlobalStor.global.laminats.forEach((item) => {
                            if (item.lamination_type_id === thisCtrl.type_id) {
                                item.isActive = 1;
                            } else {
                                item.isActive = 0;
                            }
                        });
                    });
                    if ($location.path() !== '/light') {
                        setTimeout(function () {
                            DesignServ.rebuildSVGTemplate();
                        }, 500);
                    }
                }

                function openLaminatFolder(index, type_id, event, img) {
                    thisCtrl.type_id = type_id;
                    if (img) {
                        setTimeout(() => {
                            $('.laminat-filter').animate({scrollTop: $(event.target).offset().top + $('.laminat-filter').scrollTop() - 150}, 'slow');
                        }, 250);
                    } else {
                        setTimeout(() => {
                            $('.laminat-filter').animate({scrollTop: $(event.target).offset().top + $('.laminat-filter').scrollTop() - 130}, 'slow');
                        }, 250);
                    }
                    if (thisCtrl.OpenFolder === index) {
                        thisCtrl.OpenFolder = -1;
                    } else {
                        thisCtrl.OpenFolder = index;
                        GlobalStor.global.laminats.forEach((item) => {
                            if (item.lamination_type_id === type_id) {
                                item.isActive = 1;
                            } else {
                                item.isActive = 0;
                            }
                        });
                        MainServ.laminatFiltering();
                    }
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
                thisCtrl.openLaminatFolder = openLaminatFolder;
                thisCtrl.selectLaminat = selectLaminat;
                thisCtrl.initLaminatFilter = initLaminatFilter;
                thisCtrl.closeButton = closeButton;
                thisCtrl.showInfoBox = MainServ.showInfoBox;

            });
})();
