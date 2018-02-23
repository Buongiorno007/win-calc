(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .controller('GlassesCtrl',

            function ($filter,
                      $location,
                      globalConstants,
                      MainServ,
                      AnalyticsServ,
                      DesignServ,
                      SVGServ,
                      GlobalStor,
                      OrderStor,
                      ProductStor,
                      DesignStor,
                      UserStor,
                      GlassesServ) {
                /*jshint validthis:true */
                var thisCtrl = this;
                thisCtrl.constants = globalConstants;
                thisCtrl.G = GlobalStor;
                thisCtrl.P = ProductStor;
                thisCtrl.U = UserStor;
                thisCtrl.O = OrderStor;

                thisCtrl.config = {
                    prevGlassId: 0,
                    prevGlassName: '',
                    glassLabels: [
                        'panels.CAMER_GLASS',
                        'panels.CAMER_1',
                        'panels.CAMER_1',
                        'panels.CAMER_2',
                        'panels.CAMER_2',
                        'panels.CAMER_2',
                        'panels.CAMER_2'
                    ],
                    DELAY_START: 5 * globalConstants.STEP,
                    DELAY_BLOCK: 2 * globalConstants.STEP,
                    DELAY_TYPING: 2.5 * globalConstants.STEP,
                    typing: 'on'
                };

                //------- translate
                thisCtrl.ENERGY_SAVE = $filter('translate')('panels.ENERGY_SAVE');
                thisCtrl.HEAT_INSULATION = $filter('translate')('panels.HEAT_INSULATION');
                thisCtrl.NOICE_INSULATION = $filter('translate')('panels.NOICE_INSULATION');
                thisCtrl.APPLY = $filter('translate')('common_words.APPLY');
                thisCtrl.SELECT_CURRENT = $filter('translate')('common_words.SELECT_CURRENT');
                thisCtrl.SELECT_ALL_CONSTRUCTION = $filter('translate')('common_words.SELECT_ALL_CONSTRUCTION');
                thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
                thisCtrl.OpenFolder = -1;
                /**============ METHODS ================*/

                console.log(GlobalStor.global.glassTypes);
                console.log(GlobalStor.global.glasses);

                function changePriceAsNewGlass() {
                    var hardwareIds;
                    DesignStor.design.selectedGlass.length = 0;
                    /** set current Glass */
                    SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
                        .then(function (result) {
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
                        .then(function (result) {
                            ProductStor.product.templateIcon = angular.copy(result);
                        });
                }

                function OpenGlassFolder(index, event) {
                    if (thisCtrl.OpenFolder === index) {
                        thisCtrl.OpenFolder = -1;
                    } else {
                        thisCtrl.OpenFolder = index;
                        if (event) {
                            setTimeout(() => {
                                $('.glass-container').animate({scrollTop: $(event.currentTarget).offset().top + $('.glass-container').scrollTop() - $(event.currentTarget).height() / 2 - 10 - $('.accept-container').height()}, 'slow');
                            }, 250);
                        }
                    }
                }

                /**========== FINISH ==========*/

                //------ clicking
                thisCtrl.OpenGlassFolder = OpenGlassFolder;
                thisCtrl.confirmGlass = confirmGlass;
                thisCtrl.setGlassToAll = setGlassToAll;

                thisCtrl.closePanelMobile = MainServ.closePanelMobile;
                thisCtrl.selectGlass = GlassesServ.selectGlass;
                thisCtrl.closeGlassSelectorDialog = DesignServ.closeGlassSelectorDialog;
                thisCtrl.showInfoBox = MainServ.showInfoBox;


            });
})();
