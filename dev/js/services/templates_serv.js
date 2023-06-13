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
                localDB,
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
                        GlobalStor.global.noDoorExist = 0
                        ProductStor.product.template_id = angular.copy(DesignStor.design.template_id);
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
                        //i eto toje
                        GlobalStor.global.noDoorExist = 1
                        ProductStor.product.template_id = angular.copy(DesignStor.design.template_id);
                        // console.time("setCurrentProfile");
                        //TYT stojal 0 , ja pomen9l na to chto nyjno navernoe, no bl9 vseravno s profaila ne to idet
                        DesignServ.setDefaultConstruction();
                        MainServ.setCurrentProfile(ProductStor.product, ProductStor.product.profile.id).then(function () {
                            // console.timeEnd("setCurrentProfile");
                            // console.time("saveTemplateInProduct");
                            MainServ.saveTemplateInProduct(templateIndex).then(function (result) {
                                // console.timeEnd("saveTemplateInProduct");
                                MainServ.setCurrentHardware(ProductStor.product);
                                //------ define product price

                                /** send analytics data to Server*/
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
                        //MainServ.setDefaultDoorConfig();
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
                                //TYT YJE NET vseravno s culcPriceNewTemplate prihodit ne to

                                // MainServ.preparePrice(
                                //     ProductStor.product.template,
                                //     ProductStor.product.profile.id,
                                //     ProductStor.product.glass,
                                //     ProductStor.product.hardware.id,
                                //     ProductStor.product.lamination.lamination_in_id
                                // );
                                // eto sozdanie constructyon togo formata chto nujno
                                DesignServ.rebuildSVGTemplate();
                                var objXFormedPrice = {
                                    laminationId: ProductStor.product.lamination.id,
                                    ids: [
                                        angular.copy(ProductStor.product.profile.rama_list_id),
                                        angular.copy(ProductStor.product.profile.rama_still_list_id),
                                        angular.copy(ProductStor.product.profile.stvorka_list_id),
                                        angular.copy(ProductStor.product.profile.impost_list_id),
                                        angular.copy(ProductStor.product.profile.shtulp_list_id),
                                        ProductStor.product.glass.length > 1 ?
                                            _.map(ProductStor.product.glass, function (item) {
                                                return item.id;
                                            }) :
                                            ProductStor.product.glass[0].id,
                                        //beadIds.length > 1 ? beadIds : beadIds[0],
                                        ProductStor.product.construction_type === 4 ? 0 : ProductStor.product.hardware.id
                                    ],
                                    sizes: []
                                }
                                //------- fill objXFormedPrice for sizes

                                // 
                                localDB.calculationPrice(objXFormedPrice);
                            }
                            setTimeout(function () {
                                DesignServ.rebuildSVGTemplate();
                            }, 500);
                        });
                        GlobalStor.global.activePanel = 0;
                        //Calling the function one more time to rebuild the template for light version
                        setTimeout(() => {
                            ProductStor.product.room_id = templateIndex;
                            GlobalStor.global.MobileTabActive = 0;
                            GlobalStor.global.SelectedTemplateIndex = roomInd;
                            GlobalStor.global.SelectedTemplateName = GlobalStor.global.templatesImgs[ProductStor.product.room_id].name;
                            GlobalStor.global.SelectedName = GlobalStor.global.templatesImgs[templateIndex].name;
                            //MainServ.setDefaultDoorConfig();
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
                                    DesignServ.rebuildSVGTemplate();
                                    var objXFormedPrice = {
                                        laminationId: ProductStor.product.lamination.id,
                                        ids: [
                                            angular.copy(ProductStor.product.profile.rama_list_id),
                                            angular.copy(ProductStor.product.profile.rama_still_list_id),
                                            angular.copy(ProductStor.product.profile.stvorka_list_id),
                                            angular.copy(ProductStor.product.profile.impost_list_id),
                                            angular.copy(ProductStor.product.profile.shtulp_list_id),
                                            ProductStor.product.glass.length > 1 ?
                                                _.map(ProductStor.product.glass, function (item) {
                                                    return item.id;
                                                }) :
                                                ProductStor.product.glass[0].id,
                                            //beadIds.length > 1 ? beadIds : beadIds[0],
                                            ProductStor.product.construction_type === 4 ? 0 : ProductStor.product.hardware.id
                                        ],
                                        sizes: []
                                    }
                                    //------- fill objXFormedPrice for sizes
    
                                    // 
                                    localDB.calculationPrice(objXFormedPrice);
                                }
                                setTimeout(function () {
                                    DesignServ.rebuildSVGTemplate();
                                }, 500);
                            });
                            GlobalStor.global.activePanel = 0;
                        }, 100);
                    }
                    goToNewTemplate()
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

                function closeButton(id) {
                    if (DesignStor.design.tempSize.length) {
                        //----- finish size culculation
                        DesignServ.closeSizeCaclulator();
                    } else {
                        DesignStor.design.activeMenuItem = (DesignStor.design.activeMenuItem === id) ? 0 : id;
                        DesignStor.design.isDropSubMenu = 0;
                        DesignServ.hideCornerMarks();
                        DesignServ.deselectAllImpost();
                        if (id !== 4) {
                            DesignServ.deselectAllArc();
                        }
                        //----- hide culculator
                        DesignServ.hideSizeTools();
                        if (DesignStor.design.activeMenuItem) {
                            switch (DesignStor.design.activeMenuItem) {
                                case 1:
                                    showAllAvailableGlass(id);
                                    //------ drop submenu items
                                    $timeout(function () {
                                        DesignStor.design.isDropSubMenu = 2;
                                    }, delaySubMenu1);
                                    $timeout(function () {
                                        DesignStor.design.isDropSubMenu = 6;
                                    }, delaySubMenu2);
                                    $timeout(function () {
                                        DesignStor.design.isDropSubMenu = 8;
                                    }, delaySubMenu3);
                                    $timeout(function () {
                                        DesignStor.design.isDropSubMenu = 0;
                                    }, delaySubMenu4);
                                    break;
                                case 2:
                                    // DesignStor.design.activeSubMenuItem = id;
                                    DesignServ.deselectAllGlass();
                                    showAllAvailableCorner(id);
                                    break;
                                case 3:
                                    showAllAvailableGlass(id);
                                    //------ drop submenu items
                                    $timeout(function () {
                                        DesignStor.design.isDropSubMenu = 4;
                                    }, delaySubMenu1);
                                    $timeout(function () {
                                        DesignStor.design.isDropSubMenu = 8;
                                    }, delaySubMenu2);
                                    $timeout(function () {
                                        DesignStor.design.isDropSubMenu = 12;
                                    }, delaySubMenu3);
                                    $timeout(function () {
                                        DesignStor.design.isDropSubMenu = 0;
                                    }, delaySubMenu4);
                                    break;
                                case 4:
                                    // DesignStor.design.activeSubMenuItem = id;
                                    DesignServ.deselectAllGlass();
                                    showAllAvailableArc(id);
                                    break;
                                case 5:
                                    //DesignServ.deselectAllGlass();
                                    DesignStor.design.activeSubMenuItem = id;
                                    break;
                                case 6:
                                    DesignStor.design.activeSubMenuItem = id;
                                    GlobalStor.global.goLeft = true;
                                    //DesignServ.deselectAllGlass();
                                    break;
                            }
                        } else {
                            //------ if we close menu
                            DesignStor.design.activeSubMenuItem = 0;
                            GlobalStor.global.goLeft = false;
                            GlobalStor.global.showTemplates = false;
                            GlobalStor.global.activePanel = 0;
                            //-------- delete selected glasses
                            DesignServ.deselectAllGlass();
                            DesignServ.deselectAllArc();
                            $timeout(function () {
                                DesignStor.design.isImpostDelete = 0;
                            }, 300);
                        }
                        if (id === 6) {
                            GlobalStor.global.activePanel = 1;
                        }
                    }
                }

                /**========== FINISH ==========*/

                thisFactory.publicObj = {
                    selectNewTemplate: selectNewTemplate,
                    initNewTemplateType: initNewTemplateType,
                    closeButton: closeButton,
                };

                return thisFactory.publicObj;

            });
})();
