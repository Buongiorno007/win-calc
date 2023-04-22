(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .controller('TemplatesCtrl',

            function ($location,
                      $filter,
                      globalConstants,
                      MainServ,
                      GeneralServ,
                      TemplatesServ,
                      NavMenuServ,
                      optionsServ,
                      GlobalStor,
                      DesignStor,
                      OrderStor,
                      ProductStor,
                      UserStor) {
                /*jshint validthis:true */
                var thisCtrl = this;
                thisCtrl.constants = globalConstants;
                thisCtrl.G = GlobalStor;
                thisCtrl.O = OrderStor;
                thisCtrl.P = ProductStor;
                thisCtrl.D = DesignStor;
                thisCtrl.U = UserStor;
                thisCtrl.tab = 0;
                thisCtrl.templateList = [];

                thisCtrl.config = {
                    DELAY_TEMPLATE_ELEMENT: 5 * globalConstants.STEP,
                    typing: 'on'
                };

                thisCtrl.templateName = [
                    'panels.TEMPLATE_WINDOW_HAND',
                    'panels.TEMPLATE_BALCONY_HAND',
                    'panels.TEMPLATE_BALCONY_ENTER',
                    'panels.TEMPLATE_DOOR_HAND'
                ];
                thisCtrl.templateNameRehau = [
                    'panels.TEMPLATE_WINDOW_HAND'
                ]
                thisCtrl.selected = ProductStor.product.construction_type;
                //------- translate
                thisCtrl.TEMPLATE_WINDOW_HAND = $filter('translate')('panels.TEMPLATE_WINDOW_HAND');
                thisCtrl.TEMPLATE_BALCONY_HAND = $filter('translate')('panels.TEMPLATE_BALCONY_HAND');
                thisCtrl.TEMPLATE_DOOR_HAND = $filter('translate')('panels.TEMPLATE_DOOR_HAND');

                thisCtrl.TEMPLATE_WINDOW = $filter('translate')('panels.TEMPLATE_WINDOW');
                thisCtrl.TEMPLATE_DOOR = $filter('translate')('panels.TEMPLATE_DOOR');
                thisCtrl.TEMPLATE_BALCONY_ENTER = $filter('translate')('panels.TEMPLATE_BALCONY_ENTER');
                thisCtrl.TEMPLATE_BALCONY = $filter('translate')('panels.TEMPLATE_BALCONY');
                thisCtrl.APPLY = $filter('translate')('common_words.APPLY');


                //---------- download templates Img icons
                optionsServ.getTemplateImgIcons(function (results) {
                    if (results.status) {
                        GlobalStor.global.templatesImgs = results.data.templateImgs;
                        thisCtrl.templateList = results.data.templateImgs;
                    } else {
                        console.log(results);
                    }
                });




                /**============ METHODS ================*/


                //------ click on top button to change template type
                function toggleTemplateType() {
                    GlobalStor.global.isTemplateTypeMenu = !GlobalStor.global.isTemplateTypeMenu;
                }

                //------- Select new Template Type
                function selectNewTemplateType(marker) {
                    GlobalStor.global.activePanel = -1;
                    GlobalStor.global.selectedTemplate = -1;
                    thisCtrl.selected = marker;
                    GlobalStor.global.templatesType = marker;
                    optionsServ.getTemplateImgIcons(function (results) {
                        if (results.status) {
                            GlobalStor.global.templatesImgs = results.data.templateImgs.filter(function (data) {
                                return data.type === marker;
                            });
                        }
                        ;
                    });
                    GlobalStor.global.showTemplates = true;
                    GlobalStor.global.goLeft = true;
                    MainServ.downloadAllTemplates(marker).then(function (data) {
                        if (data) {
                            GlobalStor.global.templatesSourceSTORE = angular.copy(data);
                            GlobalStor.global.templatesSource = angular.copy(data);
                        }
                    });
                    GlobalStor.global.isTemplateTypeMenu = 0;
                }

                function downloadTemplateForMobile(marker, id) {
                    selectNewTemplateType(marker);
                    /*ЭТО ДИКИЙ КОСТЫЛЬ. ПРОСТИТЕ.*/
                    let selected_id = id;
                    if (marker === 2) {
                        selected_id = id - 11;
                    } else if (marker === 3) {
                        selected_id = id - 16;
                    } else if (marker === 4) {
                        selected_id = id - 14;
                    }
                    TemplatesServ.selectNewTemplate(selected_id, id);
                }

                function saveProduct() {
                    GlobalStor.global.showCoefInfoBlock = 0;
                    GlobalStor.global.servicesPriceIndex = -1;
                    GlobalStor.global.continued = 0;
                    ProductStor.product.product_qty = angular.copy(GlobalStor.global.product_qty);
                    MainServ.preparePrice(
                        ProductStor.product.template,
                        ProductStor.product.profile.id,
                        ProductStor.product.glass,
                        ProductStor.product.hardware.id,
                        ProductStor.product.lamination.lamination_in_id
                    ).then(function () {
                        if (globalConstants.serverIP === 'http://api.calc.csokna.ru' || globalConstants.serverIP === 'https://api.windowscalculator.net') {
                            ProductStor.product.template_source.report = ProductStor.product.report;
                        }
                        if (MainServ.inputProductInOrder()) {
                            GlobalStor.global.construction_count = 0;
                            OrderStor.order.products.forEach(function (product) {
                                GlobalStor.global.construction_count += parseInt(product.product_qty);
                            });
                            GlobalStor.global.product_qty = 1;
                            if (ProductStor.product.is_addelem_only) {
                                if ($location.path() === "/mobile") {
                                    GlobalStor.global.MobileTabActive = 4;
                                }
                                GlobalStor.global.isLoader = 0;
                                if ($location.path() !== "/mobile") {
                                    MainServ.createNewProduct();
                                    $timeout(() => {
                                        NavMenuServ.createAddElementsProduct();
                                    }, 100);
                                }

                            }
                        }
                    });

                }


                function checkForAddElem() {
                  if (!GlobalStor.global.isChangedTemplate) {
                    GlobalStor.global.isChangedTemplate = DesignStor.design.designSteps.length ? 1 : 0;
                  }
                  if (!GlobalStor.global.isZeroPriceList.length) {
                    if (!ProductStor.product.is_addelem_only) {
                      // alert();
                      if (GlobalStor.global.dangerAlert < 1) {
                        if (ProductStor.product.beadsData.length > 0) {
                          if (OrderStor.order.products.length === 0) {
                            saveProduct();
                          } else if (GlobalStor.global.isNewTemplate === 1) {
                            saveProduct();
                          } else if (GlobalStor.global.isChangedTemplate === 0) {
                            //  ALERT
                            GlobalStor.global.isNoChangedProduct = 1;
                          } else {
                            saveProduct();
                          }
                        } else {
                          GeneralServ.isErrorProd(
                            $filter("translate")("common_words.ERROR_PROD_BEADS")
                          );
                        }
                      }
                    } else {
                      saveAddElems();
                    }
                  } else {
                    var msg = thisCtrl.ATENTION_MSG1; //+" "+GlobalStor.global.isZeroPriceList+" "+thisCtrl.ATENTION_MSG2;
                    GlobalStor.global.isZeroPriceList.forEach(function (ZeroElem) {
                      msg += " " + ZeroElem + "\n";
                    });
                    msg += " \n" + thisCtrl.ATENTION_MSG2;
                    GeneralServ.infoAlert(thisCtrl.ATENTION, msg);
                  }
                }

                function setTab(newTab) {
                    if (newTab === 0) {
                        NavMenuServ.createAddElementsProduct();
                    }
                    if (thisCtrl.tab === newTab) {
                        thisCtrl.tab = 0;
                    } else {
                        thisCtrl.tab = newTab;
                    }
                }

                function isSet(tabNum) {
                    return thisCtrl.tab === tabNum;
                }

                function closeTemplatePanelMobile() {
                    GlobalStor.global.MobileTabActive = 0;
                }



                /**========== FINISH ==========*/

                //------ clicking
                thisCtrl.setTab = setTab;
                thisCtrl.isSet = isSet;
                thisCtrl.checkForAddElem = checkForAddElem;
                thisCtrl.saveProduct = saveProduct;
                thisCtrl.downloadTemplateForMobile = downloadTemplateForMobile;
                thisCtrl.closeTemplatePanelMobile = closeTemplatePanelMobile;
                thisCtrl.selectNewTemplate = TemplatesServ.selectNewTemplate;
                thisCtrl.toggleTemplateType = toggleTemplateType;
                thisCtrl.closeButton = TemplatesServ.closeButton;
                thisCtrl.selectNewTemplateType = selectNewTemplateType;

            });
})();
