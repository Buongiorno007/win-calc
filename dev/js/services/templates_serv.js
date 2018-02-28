(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .factory('TemplatesServ',

            function ($filter,
                      $location,
                      GeneralServ,
                      MainServ,
                      DesignServ,
                      AnalyticsServ,
                      GlobalStor,
                      OrderStor,
                      ProductStor,
                      DesignStor,
                      UserStor,
                      SVGServ) {
                /*jshint validthis:true */
                var thisFactory = this;


                /**============ METHODS ================*/


                function culcPriceNewTemplate(templateIndex) {
                    ProductStor.product.chosenAddElements.forEach(function (addElem) {
                        addElem.splice(0, addElem.length);
                    });
                    GlobalStor.global.servicesPriceIndex = -1;
                    GlobalStor.global.typeMenuID = 5555;
                    GlobalStor.global.typeMenu = 5555;
                    ProductStor.product.services_price_arr = [0, 0, 0, 0, 0]
                    ProductStor.product.service_price = 0;
                    ProductStor.product.service_price_dis = 0;
                    ProductStor.product.addelem_price = 0;
                    ProductStor.product.addelemPriceDis = 0;
                    if (ProductStor.product.construction_type === 4) {
                        ProductStor.product.template_id = DesignStor.design.template_id;
                        DesignStor.designSource.templateSourceTEMP = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
                        DesignStor.design.templateSourceTEMP = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
                        // console.time("setDoorConfigDefault");
                        DesignServ.setDoorConfigDefault(ProductStor.product).then(function (result) {
                            // console.timeEnd("setDoorConfigDefault");
                            ProductStor.product = angular.copy(result);
                            if ($location.path() === "/main") {
                                if ($location.path() !== "/design") {
                                    $location.path("/design");
                                }
                            }
                        });
                    } else {
                        ProductStor.product.template_id = DesignStor.design.template_id;
                        // console.time("setCurrentProfile");
                        MainServ.setCurrentProfile(ProductStor.product, 0).then(function () {
                            // console.timeEnd("setCurrentProfile");
                            // console.time("saveTemplateInProduct");
                            MainServ.saveTemplateInProduct(templateIndex).then(function (result) {
                                // console.timeEnd("saveTemplateInProduct");

                                MainServ.setCurrentHardware(ProductStor.product);
                                DesignServ.setDefaultConstruction();
                                //------ define product price

                                /** send analytics data to Server*/
                                AnalyticsServ.sendAnalyticsData(
                                    UserStor.userInfo.id,
                                    OrderStor.order.id,
                                    ProductStor.product.template_id,
                                    ProductStor.product.profile.id,
                                    1
                                );
                                if ($location.path() === "/main") {
                                    if ($location.path() !== "/design") {
                                        $location.path("/design");
                                    }
                                }
                                if ($location.path() === "/light" || $location.path() === "/mobile") {
                                    DesignServ.designSaved();
                                    GlobalStor.global.goLeft = false;
                                    GlobalStor.global.showTemplates = false;
                                }
                            });
                        })
                    }
                }


                function newPriceForNewTemplate(templateIndex, roomInd) {
                    /** if was selected room */
                    if (roomInd) {
                        MainServ.closeRoomSelectorDialog();
                        ProductStor.product.room_id = roomInd - 1;
                        if (GlobalStor.global.rooms[roomInd - 1].group_id === 4 && GlobalStor.global.noDoorExist) {
                            DesignStor.design.isNoDoors = 1;
                        }
                        if (ProductStor.product.construction_type !== 4) {
                            MainServ.setCurrentProfile(ProductStor.product, 0).then(function (result) {
                                culcPriceNewTemplate(templateIndex);
                            });
                        } else if (ProductStor.product.construction_type === 4) {
                            ProductStor.product.template_id = DesignStor.design.template_id;
                            DesignStor.designSource.templateSourceTEMP = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
                            DesignStor.design.templateSourceTEMP = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
                            DesignServ.setDoorConfigDefault(ProductStor.product).then(function (result) {
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
                    GlobalStor.global.templateTEMP = angular.copy(ProductStor.product);

                    function goToNewTemplate() {
                        ProductStor.product.room_id = templateIndex;
                        GlobalStor.global.MobileTabActive = 0;
                        GlobalStor.global.SelectedTemplateIndex = roomInd;
                        GlobalStor.global.SelectedTemplateName = GlobalStor.global.templatesImgs[ProductStor.product.room_id].name;
                        GlobalStor.global.SelectedName = GlobalStor.global.templatesImgs[templateIndex].name;
                        MainServ.setDefaultDoorConfig();
                        DesignServ.setDefaultConstruction();
                        GlobalStor.global.isNewTemplate = 1;
                        //-------- check changes in current template
                        GlobalStor.global.isChangedTemplate = (DesignStor.design.designSteps.length) ? 1 : 0;
                        ProductStor.product.construction_type = GlobalStor.global.templatesType;
                        DesignStor.design.template_id = templateIndex;
                        GlobalStor.global.selectRoom = 1;
                        MainServ.downloadAllTemplates(ProductStor.product.construction_type).then(function (data) {
                            if (data) {
                                GlobalStor.global.templatesSourceSTORE = angular.copy(data);
                                GlobalStor.global.templatesSource = angular.copy(data);
                                GlobalStor.global.product_qty = 1;
                                culcPriceNewTemplate(templateIndex);
                            }
                            setTimeout(function () {
                                DesignServ.rebuildSVGTemplate();
                            }, 500);
                        });
                        GlobalStor.global.activePanel = 0;
                    }

                    if (GlobalStor.global.isChangedTemplate) {
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
                    MainServ.prepareTemplates(marker).then(function () {
                        if (GlobalStor.global.currOpenPage === 'design') {
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
