(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('DesignModule')
        .controller('DesignCtrl',

            function ($filter,
                      $timeout,
                      $location,
                      globalConstants,
                      DesignServ,
                      GlobalStor,
                      ProductStor,
                      OrderStor,
                      MainServ,
                      SVGServ,
                      DesignStor,
                      ConfigMenuServ,
                      LightServ,
                      loginServ,
                      UserStor,
                      AddElementMenuServ) {
                /*jshint validthis:true */
                var thisCtrl = this,
                    delaySubMenu1 = 300,
                    delaySubMenu2 = 600,
                    delaySubMenu3 = 900,
                    delaySubMenu4 = 1200;

                thisCtrl.constants = globalConstants;
                thisCtrl.G = GlobalStor;
                thisCtrl.P = ProductStor;
                thisCtrl.D = DesignStor;

                DesignStor.design.activeSubMenuItem = 0;
                DesignStor.design.activeMenuItem = 0;

                if ($location.path() !== "/mobile") {
                    //------- set current Page
                    GlobalStor.global.currOpenPage = 'design';
                }
                thisCtrl.mobSize = 0;
                if (self.innerWidth > self.innerHeight) {
                    thisCtrl.mobSize = self.innerHeight;
                } else {
                    thisCtrl.mobSize = self.innerWidth + 70;
                }
                thisCtrl.mobHeight = self.innerHeight + 70;

                thisCtrl.config = {
                    //---- design menu
                    isDesignError: 0,
                    isTest: 0,

                    DELAY_SHOW_FIGURE_ITEM: 1000,
                    typing: 'on'
                };

                //------- translate
                thisCtrl.TEXT1 = $filter('translate')('natification.TEXT1');
                thisCtrl.TEXT2 = $filter('translate')('natification.TEXT2');
                thisCtrl.TEXT3 = $filter('translate')('natification.TEXT3');
                thisCtrl.EDIT_HARDWARE = $filter('translate')('natification.EDIT_HARDWARE');
                thisCtrl.EDIT_SIZE = $filter('translate')('natification.EDIT_SIZE');
                thisCtrl.IMPOST_SHAPE = $filter('translate')('design.IMPOST_SHAPE');
                thisCtrl.SASH_SHAPE = $filter('translate')('design.SASH_SHAPE');
                thisCtrl.ANGEL_SHAPE = $filter('translate')('design.ANGEL_SHAPE');
                thisCtrl.ARCH_SHAPE = $filter('translate')('design.ARCH_SHAPE');
                thisCtrl.POSITION_SHAPE = $filter('translate')('design.POSITION_SHAPE');
                thisCtrl.UNITS_DESCRIP = $filter('translate')('design.UNITS_DESCRIP');
                thisCtrl.PROJECT_DEFAULT = $filter('translate')('design.PROJECT_DEFAULT');
                thisCtrl.BACK = $filter('translate')('common_words.BACK');
                thisCtrl.SAVE = $filter('translate')('settings.SAVE');
                thisCtrl.CANCEL = $filter('translate')('add_elements.CANCEL');
                thisCtrl.DOOR_CONFIG_LABEL = $filter('translate')('design.DOOR_CONFIG_LABEL');
                thisCtrl.DOOR_CONFIG_DESCTIPT = $filter('translate')('design.DOOR_CONFIG_DESCTIPT');
                thisCtrl.SASH_CONFIG_DESCTIPT = $filter('translate')('design.SASH_CONFIG_DESCTIPT');

                thisCtrl.DOOR_CONFIG_DESCTIPT_MOBILE = $filter('translate')('design.DOOR_CONFIG_DESCTIPT_MOBILE');
                thisCtrl.SASH_CONFIG_DESCTIPT_MOBILE = $filter('translate')('design.SASH_CONFIG_DESCTIPT_MOBILE');

                thisCtrl.HANDLE_CONFIG_DESCTIPT = $filter('translate')('design.HANDLE_CONFIG_DESCTIPT');
                thisCtrl.LOCK_CONFIG_DESCTIPT = $filter('translate')('design.LOCK_CONFIG_DESCTIPT');
                thisCtrl.STEP = $filter('translate')('design.STEP');
                thisCtrl.LABEL_DOOR_TYPE = $filter('translate')('design.LABEL_DOOR_TYPE');
                thisCtrl.LABEL_SASH_TYPE = $filter('translate')('design.LABEL_SASH_TYPE');
                thisCtrl.LABEL_HANDLE_TYPE = $filter('translate')('design.LABEL_HANDLE_TYPE');
                thisCtrl.LABEL_LOCK_TYPE = $filter('translate')('design.LABEL_LOCK_TYPE');
                thisCtrl.NOT_AVAILABLE = $filter('translate')('design.NOT_AVAILABLE');
                thisCtrl.DIM_EXTRA = $filter('translate')('design.DIM_EXTRA');
                thisCtrl.SQUARE_EXTRA = $filter('translate')('design.SQUARE_EXTRA');
                thisCtrl.ROOM_SELECTION = $filter('translate')('mainpage.ROOM_SELECTION');
                thisCtrl.TEST_STAGE = $filter('translate')('design.TEST_STAGE');
                thisCtrl.VOICE_SPEACH = $filter('translate')('design.VOICE_SPEACH');
                thisCtrl.BY_AXIS = $filter('translate')('design.BY_AXIS');
                thisCtrl.BY_GLASS = $filter('translate')('design.BY_GLASS');
                thisCtrl.CALC_PRICE = $filter('translate')('design.CALC_PRICE');

                thisCtrl.PROFILE_SYSTEM_SELECT = $filter('translate')('design.PROFILE_SYSTEM_SELECT');
                thisCtrl.GLASS_SELECT = $filter('translate')('design.GLASS_SELECT');
                thisCtrl.GLASS_SELECT_BIG = $filter('translate')('design.GLASS_SELECT_BIG');
                thisCtrl.HARDWARE_SELECT = $filter('translate')('design.HARDWARE_SELECT');
                thisCtrl.LEFT_TEXT_SELECT = $filter('translate')('design.LEFT_TEXT_SELECT');

                thisCtrl.AND = $filter('translate')('common_words.AND');

                thisCtrl.DOOR_NAME = $filter('translate')('common_words.DOOR_NAME');
                //------ DOOR
                //DesignServ.setDoorConfigDefault(ProductStor.product);
                //------ cleaning DesignStor
                //DesignStor.design = DesignStor.setDefaultDesign();
                //--------- set template from ProductStor
                //DesignServ.setDefaultTemplate();
                if (!GlobalStor.global.prohibitCopyingTemplate) {
                    DesignStor.designSource.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
                    DesignStor.designSource.templateTEMP = angular.copy(ProductStor.product.template);
                    DesignStor.design.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
                    DesignStor.design.templateTEMP = angular.copy(ProductStor.product.template);
                } else {
                    delete GlobalStor.global.prohibitCopyingTemplate;
                }

                /**----- initialize Events again in order to svg in template pannel -------*/
                $timeout(function () {
                    DesignServ.initAllImposts();
                    DesignServ.initAllGlass();
                    DesignServ.initAllArcs();
                    DesignServ.initAllDimension();
                }, 50);

                /**============ METHODS ================*/
                function recalculate() {
                    if (GlobalStor.global.checkDoors === 0) {
                        var isSashesInTemplate;
                        GlobalStor.global.isLoader = 1;
                        DesignServ.closeSizeCaclulator(1).then(function () {
                            /** check sizes of all glass */
                            MainServ.checkGlassSizes(DesignStor.design.templateTEMP);
                            if (DesignStor.design.extraGlass.length) {
                                /** expose Alert */
                                GlobalStor.global.isLoader = 0;
                                DesignStor.design.isGlassExtra = 1;
                            } else {
                                /** if sash was added/removed in template */
                                isSashesInTemplate = MainServ.checkSashInTemplate(DesignStor.design.templateSourceTEMP);
                                if (isSashesInTemplate) {
                                    /** set first hardware if sash were not existed before */
                                    if ((!GlobalStor.global.isSashesInTemplate || !ProductStor.product.hardware.id) && ProductStor.product.construction_type !== 4) {
                                        GlobalStor.global.isSashesInTemplate = 1;
                                        ProductStor.product.hardware = GlobalStor.global.hardwares[0][0];
                                    }
                                    /** check sizes of all hardware in sashes */
                                    MainServ.checkHardwareSizes(DesignStor.design.templateTEMP);

                                } else {
                                    /** sashes were removed */
                                    ProductStor.product.hardware = {};
                                    ProductStor.product.hardware.id = 0;
                                    GlobalStor.global.isSashesInTemplate = 0;
                                    //------ clean Extra Hardware
                                    DesignStor.design.extraHardware.length = 0;
                                }

                                if (DesignStor.design.extraHardware.length) {
                                    /** expose Alert */
                                    GlobalStor.global.isLoader = 0;
                                    DesignStor.design.isHardwareExtra = 1;
                                } else {
                                    /** save new template in product ***** */
                                    ProductStor.product.template_source = angular.copy(DesignStor.design.templateSourceTEMP);
                                    ProductStor.product.template = angular.copy(DesignStor.design.templateTEMP);

                                    /** rebuild glasses */
                                    MainServ.setGlassfilter();
                                    if (ProductStor.product.construction_type !== 4) {
                                        // MainServ.setCurrentGlass(ProductStor.product, 1);
                                        MainServ.setCurrentProfile(ProductStor.product, ProductStor.product.profile.id).then(function () {
                                            next();
                                        });
                                    } else {
                                        next();
                                    }

                                    //noinspection JSAnnotator
                                    function next() {
                                        /** create template icon */
                                        SVGServ.createSVGTemplateIcon(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
                                            .then(function (result) {
                                                ProductStor.product.templateIcon = angular.copy(result);
                                            });
                                        /** save new template in templates Array */
                                        GlobalStor.global.templatesSource[ProductStor.product.templateIndex] = angular.copy(
                                            ProductStor.product.template_source
                                        );
                                        /** check grids */
                                            // console.log(ProductStor.product);
                                        var isChanged = DesignServ.updateGrids();
                                        if (isChanged) {
                                            //------ get new grids price
                                            var sumMosq = 0;
                                            var sumMosqDis = 0;
                                            ProductStor.product.chosenAddElements[0].forEach(function (entry) {
                                                sumMosq += entry.element_price;
                                                sumMosqDis += entry.elementPriceDis;
                                            });

                                            ProductStor.product.addelem_price -= sumMosq;
                                            ProductStor.product.addelemPriceDis -= sumMosqDis;

                                            loginServ.getGridPrice(ProductStor.product.chosenAddElements[0]).then(function () {
                                                sumMosq = 0;
                                                sumMosqDis = 0;
                                                ProductStor.product.chosenAddElements[0].forEach(function (entry) {
                                                    sumMosq += entry.element_price;
                                                    sumMosqDis += entry.elementPriceDis;
                                                });
                                                ProductStor.product.addelem_price += sumMosq;
                                                ProductStor.product.addelemPriceDis += sumMosqDis;
                                            });


                                        }
                                        SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function (result) {
                                            ProductStor.product.template = angular.copy(result);
                                            /** refresh price of new template */
                                            MainServ.preparePrice(
                                                ProductStor.product.template,
                                                ProductStor.product.profile.id,
                                                ProductStor.product.glass,
                                                ProductStor.product.hardware.id,
                                                ProductStor.product.lamination.lamination_in_id
                                            ).then(function () {
                                                //-------- template was changed
                                                SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function (result) {
                                                    ProductStor.product.template = angular.copy(result);
                                                    DesignStor.design.templateTEMP = angular.copy(result);
                                                });
                                            });
                                        });
                                    }
                                }
                            }
                        });
                    }
                    // console.log("ProductStor.product", ProductStor.product);
                    // console.log("схоронили");
                }

                function deactivMenu() {
                    DesignStor.design.activeMenuItem = 0;
                    DesignStor.design.activeSubMenuItem = 0;
                    DesignStor.design.isDropSubMenu = 0;
                    setTimeout(() => {
                        recalculate();
                    }, 500)
                }

                function showDesignError() {
                    thisCtrl.config.isDesignError = 1;
                    GlobalStor.global.isDesignError = 1;
                    DesignStor.design.activeMenuItem = 0;
                    DesignStor.design.activeSubMenuItem = 0;
                    $timeout(function () {
                        thisCtrl.config.isDesignError = 0;
                        GlobalStor.global.isDesignError = 0;
                    }, 800);
                }

                /**++++++++++ Edit Sash ++++++++++*/

                function showAllAvailableGlass(menuId) {
                    GlobalStor.global.showAllGlass = 1;
                    DesignStor.design.activeSubMenuItem = menuId;
                    if (!DesignStor.design.selectedGlass.length) {
                        //----- show all glasses
                        var glasses = d3.selectAll('#tamlateSVG .glass');
                        DesignStor.design.selectedGlass = glasses[0];
                        glasses.classed('glass-active', true);
                    }
                }


                function insertSash(sashType) {
                    var isPermit = 1,
                        glassQty = DesignStor.design.selectedGlass.length,
                        i;
                    GlobalStor.global.isChangedTemplate = 1;
                    if (sashType === 1) {
                        deactivMenu();
                        GlobalStor.global.isSashesInTemplate = 0;
                        //----- delete sash
                        for (i = 0; i < glassQty; i += 1) {
                            DesignServ.deleteSash(DesignStor.design.selectedGlass[i]);
                        }
                        ProductStor.product.template_source.details.forEach(function (entry) {
                            ProductStor.product.chosenAddElements[0].forEach(function (add_elem, index) {
                                if (entry.id === add_elem.block_id) {
                                    entry.gridId = 0;
                                    entry.gridTxt = "";
                                    ProductStor.product.chosenAddElements[0].splice(index, 1);
                                }

                            });
                        });
                        AddElementMenuServ.setAddElementsTotalPrice(ProductStor.product);
                    } else {

                        if (sashType === 2 || sashType === 6 || sashType === 8) {
                            if (DesignStor.design.isDropSubMenu === sashType) {
                                DesignStor.design.isDropSubMenu = 0;
                            } else {
                                DesignStor.design.isDropSubMenu = sashType;
                                isPermit = 0;
                            }
                        }
                        if (isPermit) {
                            deactivMenu();
                            GlobalStor.global.isSashesInTemplate = 1;
                            //----- insert sash
                            for (i = 0; i < glassQty; i += 1) { //TODO download hardare types and create submenu
                                DesignServ.createSash(sashType, DesignStor.design.selectedGlass[i]);
                            }

                        }
                    }
                    if ($location.path() === "/light") {
                        ProductStor.product.template_source = angular.copy(DesignStor.design.templateSourceTEMP);
                        ProductStor.product.template = angular.copy(DesignStor.design.templateTEMP);
                        ProductStor.product.hardware = GlobalStor.global.hardwares[0][0];
                        setTimeout(function () {
                            DesignServ.rebuildSVGTemplate();
                            $('#save-block').click(1);
                        }, 1500);
                    }
                }


                /**++++++++++ Edit Corner ++++++++*/

                //-------- show all Corner Marks
                function showAllAvailableCorner(menuId) {
                    var corners = d3.selectAll('#tamlateSVG .corner_mark');
                    if (corners[0].length) {
                        //---- show submenu
                        DesignStor.design.activeSubMenuItem = menuId;
                        corners.transition().duration(300).ease("linear").attr('r', 50);
                        DesignStor.design.selectedCorner = corners[0];
                        //        corners.on('touchstart', function () {
                        corners.on('click', function () {
                            //----- hide all cornerMark
                            DesignServ.hideCornerMarks();

                            //----- show selected cornerMark
                            var corner = d3.select(this).transition().duration(300).ease("linear").attr('r', 50);
                            DesignStor.design.selectedCorner.push(corner[0][0]);

                        });
                    } else {
                        showDesignError();
                    }
                }


                function insertCorner(conerType) {
                    //------ hide menu
                    deactivMenu();
                    //TODO testing stage
                    thisCtrl.config.isTest = 1;
                    GlobalStor.global.isTest = 1;
                    DesignServ.hideCornerMarks();

                    // var cornerQty = DesignStor.design.selectedCorner.length,
                    //    i;
                    // switch(conerType) {
                    //  //----- delete
                    //  case 1:
                    //    for(i = 0; i < cornerQty; i+=1) {
                    //      DesignServ.deleteCornerPoints(DesignStor.design.selectedCorner[i]);
                    //    }
                    //    break;
                    //  //----- line angel
                    //  case 2:
                    //    for(i = 0; i < cornerQty; i+=1) {
                    //      DesignServ.setCornerPoints(DesignStor.design.selectedCorner[i]);
                    //    }
                    //    break;
                    //  //----- curv angel
                    //  case 3:
                    //    for(i = 0; i < cornerQty; i+=1) {
                    //      DesignServ.setCurvCornerPoints(DesignStor.design.selectedCorner[i]);
                    //    }
                    //    break;
                    // }
                }


                /**++++++++++ Edit Arc ++++++++*/

                function showAllAvailableArc(menuId) {
                    var arcs = d3.selectAll('#tamlateSVG .frame')[0].filter(function (item) {
                        if (item.__data__.type === 'frame' || item.__data__.type === 'arc') {
                            return true;
                        }
                    });
                    //----- if not corners
                    if (arcs.length) {
                        DesignStor.design.activeSubMenuItem = menuId;
                        //        console.log('Arcs++++++', DesignStor.design.selectedArc);
                        if (!DesignStor.design.selectedArc.length) {
                            //----- show all frames and arc
                            var arcsD3 = d3.selectAll(arcs);
                            DesignStor.design.selectedArc = arcsD3[0];
                            arcsD3.classed('active_svg', true);
                        }
                    } else {
                        showDesignError();
                    }
                }


                function insertArc(arcType) {
                    deactivMenu();
                    //TODO testing stage
                    thisCtrl.config.isTest = 1;
                    GlobalStor.global.isTest = 1;
                    DesignServ.deselectAllArc();

                    // //---- get quantity of arcs
                    // var arcQty = DesignStor.design.selectedArc.length;
                    //
                    // /** delete arc */
                    // if(arcType === 1) {
                    //  //------ delete all arcs
                    //  if (arcQty > 1) {
                    //    DesignServ.workingWithAllArcs(0);
                    //  } else {
                    //    //------ delete one selected arc
                    //    DesignServ.deleteArc(DesignStor.design.selectedArc[0]);
                    //    DesignStor.design.selectedArc.length = 0;
                    //  }
                    //
                    // /** insert arc */
                    // } else {
                    //  //------ insert all arcs
                    //  if(arcQty > 1) {
                    //    DesignServ.workingWithAllArcs(1);
                    //  } else {
                    //    //------ insert one selected arc
                    //    DesignServ.createArc(DesignStor.design.selectedArc[0]);
                    //    DesignStor.design.selectedArc.length = 0;
                    //  }
                    // }

                }


                /**++++++++++ Edit Impost ++++++++*/

                function insertImpost(impostType) {
                    var isPermit = 1,
                        impostsQty = DesignStor.design.selectedImpost.length,
                        i;
                    GlobalStor.global.isChangedTemplate = 1;
                    if (impostType === 1) {
                        deactivMenu();
                        /** delete imposts */
                        if (impostsQty) {
                            for (i = 0; i < impostsQty; i += 1) {
                                DesignServ.deleteImpost(DesignStor.design.selectedImpost[i]);
                            }
                            $timeout(function () {
                                DesignStor.design.isImpostDelete = 0;
                            }, 300);
                        }
                    } else {
                        //TODO testing stage
                        if (impostType === 2 || impostType === 3) {

                            /** show drop submenu */
                            if (impostType === 4 || impostType === 8 || impostType === 12) {
                                if (DesignStor.design.isDropSubMenu === impostType) {
                                    DesignStor.design.isDropSubMenu = 0;
                                } else {
                                    DesignStor.design.isDropSubMenu = impostType;
                                    isPermit = 0;
                                }
                            }

                            if (isPermit) {
                                deactivMenu();
                                if (!impostsQty) {
                                    var glassQty = DesignStor.design.selectedGlass.length;
                                    if (glassQty) {
                                        /** insert imposts */
                                        for (i = 0; i < glassQty; i += 1) {
                                            DesignServ.createImpost(impostType, DesignStor.design.selectedGlass[i]);
                                        }
                                    }
                                } else {
                                    DesignServ.deselectAllImpost();
                                }
                            }
                        } else {
                            deactivMenu();
                            thisCtrl.config.isTest = 1;
                            GlobalStor.global.isTest = 1;
                            DesignServ.deselectAllGlass();
                            DesignServ.deselectAllImpost();
                        }

                    }
                }


                /**++++++++++ create Mirror ++++++++*/

                function initMirror() {
                    deactivMenu();
                    DesignServ.initMirror();
                }


                /**++++++++++ position by Axises ++++++++*/

                function positionAxis() {
                    GlobalStor.global.isChangedTemplate = 1;
                    deactivMenu();
                    DesignServ.positionAxises();
                }


                /**++++++++++ position by Glasses ++++++++*/

                function positionGlass() {
                    GlobalStor.global.isChangedTemplate = 1;
                    deactivMenu();
                    DesignServ.positionGlasses();
                }


                /**-------- Select menu item ---------*/
                function selectMenuItem(id) {
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

                /**----- open/close template pannel -------*/

                function showTemplates() {
                    if (GlobalStor.global.activePanel) {
                        // GlobalStor.global.activePanel = 0;
                        DesignServ.initAllImposts();
                        DesignServ.initAllGlass();
                        DesignServ.initAllArcs();
                        DesignServ.initAllDimension();
                    } else {
                        GlobalStor.global.activePanel = 1;
                    }
                }

                function selectProfileFast() {
                    //console.log("профиля");
                    DesignServ.saveSizeCheck();
                    $timeout(function () {
                        ConfigMenuServ.selectConfigPanel(2);
                    }, 2000);
                }

                function selectWindowsHardwareFast() {
                    //console.log("фурнитура");
                    DesignServ.saveSizeCheck();
                    $timeout(function () {
                        ConfigMenuServ.selectConfigPanel(4);
                    }, 2000);

                }

                function selectGlassFast() {
                    //console.log("стеклопакет");
                    DesignServ.saveSizeCheck();
                    $timeout(function () {
                        ConfigMenuServ.selectConfigPanel(3);
                    }, 2000);
                }

                /**----------- close Attantion dialog ----------*/

                function closeAttantion() {
                    thisCtrl.config.isTest = 0;
                    GlobalStor.global.isTest = 0;
                    DesignStor.design.isDimExtra = 0;
                    DesignStor.design.isSquareExtra = 0;
                    DesignStor.design.isDimSmall = 0;
                }

                function showStepsMobileFunc(step) {
                    if (DesignStor.design.showMobileStep === step) {
                        DesignStor.design.showMobileStep = 0;
                    } else {
                        DesignStor.design.showMobileStep = step;
                    }
                }

                function gethandleShapeIndex(id) {
                    let index = -1;
                    DesignStor.design.handleShapeList.forEach((item, itemindex) => {
                        if (item.id === id) {
                            index = itemindex;
                            // break;
                        }
                    });
                    return index;
                }

                /**========== FINISH ==========*/

                //------ clicking

                thisCtrl.designSaved = DesignServ.saveSizeCheck;
                thisCtrl.designCancel = DesignServ.designCancel;
                thisCtrl.selectMenuItem = selectMenuItem;
                thisCtrl.setDefaultConstruction = DesignServ.setDefaultConstruction;
                thisCtrl.showTemplates = showTemplates;

                //----- door config
                thisCtrl.toggleDoorConfig = DesignServ.toggleDoorConfig;
                thisCtrl.selectDoor = DesignServ.selectDoor;
                thisCtrl.selectSash = DesignServ.selectSash;
                thisCtrl.selectHandle = DesignServ.selectHandle;
                thisCtrl.selectLock = DesignServ.selectLock;
                thisCtrl.closeDoorConfig = DesignServ.closeDoorConfig;
                thisCtrl.saveDoorConfig = DesignServ.saveDoorConfig;
                thisCtrl.setDoorConfigDefault = DesignServ.setDoorConfigDefault;

                //------ edit design
                thisCtrl.insertSash = insertSash;
                thisCtrl.insertCorner = insertCorner;
                thisCtrl.insertImpost = insertImpost;
                thisCtrl.insertArc = insertArc;
                thisCtrl.initMirror = initMirror;
                thisCtrl.positionAxis = positionAxis;
                thisCtrl.positionGlass = positionGlass;
                thisCtrl.showStepsMobileFunc = showStepsMobileFunc;
                thisCtrl.gethandleShapeIndex = gethandleShapeIndex;

                //thisCtrl.setAddElementsTotalPrice = AddElementMenuServ.setAddElementsTotalPrice;

                thisCtrl.stepBack = DesignServ.stepBack;
                thisCtrl.closeAttantion = closeAttantion;
                thisCtrl.selectGlassFast = selectGlassFast;
                thisCtrl.selectProfileFast = selectProfileFast;
                thisCtrl.selectWindowsHardwareFast = selectWindowsHardwareFast;

                if ($location.path() !== "/mobile") {
                    $("#main-frame").removeClass("main-frame-mobView");
                    $("#app-container").removeClass("app-container-mobView");
                    $(window).load(function () {
                        MainServ.resize();
                    });
                    window.onresize = function () {
                        MainServ.resize();
                    };
                }
            });
})();