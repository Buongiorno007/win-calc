(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .controller('ProfilesCtrl',

            function ($filter,
                      globalConstants,
                      GlobalStor,
                      OrderStor,
                      ProductStor,
                      ProfileServ,
                      UserStor,
                      MainServ) {
                /*jshint validthis:true */
                var thisCtrl = this;
                thisCtrl.G = GlobalStor;
                thisCtrl.P = ProductStor;
                thisCtrl.U = UserStor;
                thisCtrl.O = OrderStor;

                thisCtrl.config = {
                    camera: $filter('translate')('panels.CAMERa'),
                    camer: $filter('translate')('panels.CAMER'),
                    camers: $filter('translate')('panels.CAMERs'),
                    DELAY_START: 5 * globalConstants.STEP,
                    DELAY_BLOCK: 2 * globalConstants.STEP,
                    DELAY_TYPING: 2.5 * globalConstants.STEP,
                    typing: 'on'
                };

                //------- translate
                thisCtrl.COUNTRY_NAME = $filter('translate')('panels.COUNTRY_NAME');
                thisCtrl.PROFILE_NAME = $filter('translate')('panels.PROFILE_NAME');
                thisCtrl.PROFILE_NAME_2 = $filter('translate')('panels.PROFILE_NAME_2');
                thisCtrl.PROFILE_NAME_3 = $filter('translate')('panels.PROFILE_NAME_3');
                thisCtrl.PROFILE_NAME_4 = $filter('translate')('panels.PROFILE_NAME_4');
                thisCtrl.PROFILE_NAME_5 = $filter('translate')('panels.PROFILE_NAME_5');
                thisCtrl.PROFILE_NAME_6 = $filter('translate')('panels.PROFILE_NAME_6');
                thisCtrl.PROFILE_NAME_7 = $filter('translate')('panels.PROFILE_NAME_7');
                thisCtrl.PROFILE_NAME_8 = $filter('translate')('panels.PROFILE_NAME_8');
                thisCtrl.PROFILE_NAME_9 = $filter('translate')('panels.PROFILE_NAME_9');
                thisCtrl.PROFILE_NAME_10 = $filter('translate')('panels.PROFILE_NAME_10');
                thisCtrl.PROFILE_NAME_11 = $filter('translate')('panels.PROFILE_NAME_11');
                thisCtrl.PROFILE_NAME_12 = $filter('translate')('panels.PROFILE_NAME_12');
                thisCtrl.PROFILE_NAME_13 = $filter('translate')('panels.PROFILE_NAME_13');
                thisCtrl.PROFILE_NAME_14 = $filter('translate')('panels.PROFILE_NAME_14');
                thisCtrl.PROFILE_NAME_15 = $filter('translate')('panels.PROFILE_NAME_15');
                thisCtrl.PROFILE_NAME_16 = $filter('translate')('panels.PROFILE_NAME_16');
                thisCtrl.PROFILE_NAME_17 = $filter('translate')('panels.PROFILE_NAME_17');
                thisCtrl.PROFILE_NAME_18 = $filter('translate')('panels.PROFILE_NAME_18');
                thisCtrl.PROFILE_NAME_19 = $filter('translate')('panels.PROFILE_NAME_19');
                thisCtrl.PROFILE_NAME_20 = $filter('translate')('panels.PROFILE_NAME_20');
                thisCtrl.PROFILE_NAME_21 = $filter('translate')('panels.PROFILE_NAME_21');
                thisCtrl.COUNTRY = $filter('translate')('panels.COUNTRY');
                thisCtrl.HEAT_INSULATION = $filter('translate')('panels.HEAT_INSULATION');
                thisCtrl.NOICE_INSULATION = $filter('translate')('panels.NOICE_INSULATION');
                thisCtrl.APPLY = $filter('translate')('common_words.APPLY');
                thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
                thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
                thisCtrl.CAMERa = $filter('translate')('panels.CAMERa');
                thisCtrl.CAMER = $filter('translate')('panels.CAMER');
                thisCtrl.CAMERs = $filter('translate')('panels.CAMERs');
                thisCtrl.HEAT_TRANSFER = $filter('translate')('cart.HEAT_TRANSFER');

                function ClickOnFolder(event) {
                    if ($(event.target).parent().attr('class') === 'producer') {
                        $('.profiles-list').animate({scrollTop: $(event.target).offset().top + $('.profiles-list').scrollTop() - 120}, 'slow');
                    } else {
                        $('.profiles-list').animate({scrollTop: $(event.target).offset().top + $('.profiles-list').scrollTop() - 100}, 'slow');
                    }
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


                function checkForAddElemScreen() {
                    // console.log("ProductStor.product", ProductStor.product);
                    if (!GlobalStor.global.isZeroPriceList.length) {
                        if (!ProductStor.product.is_addelem_only) {
                            // alert();
                            if (GlobalStor.global.dangerAlert < 1) {
                                if (ProductStor.product.beadsData.length > 0) {
                                    if (!OrderStor.order.products.length) {
                                        $('#qty').hide().show(0);
                                        $('#qty-mobile').hide().show(0);
                                        saveProduct();
                                    } else if (GlobalStor.global.isNewTemplate) {
                                        $('#qty').hide().show(0);
                                        $('#qty-mobile').hide().show(0);
                                        saveProduct();
                                    } else if (!GlobalStor.global.isChangedTemplate) {
                                        //  ALERT
                                        GlobalStor.global.isNoChangedProduct = 1;
                                    } else {
                                        $('#qty').hide().show(0);
                                        $('#qty-mobile').hide().show(0);
                                        saveProduct();
                                    }
                                } else {
                                    GeneralServ.isErrorProd(
                                        $filter('translate')('common_words.ERROR_PROD_BEADS')
                                    );
                                }
                            }
                        } else {
                            saveProduct();
                        }
                    } else {
                        var msg = thisCtrl.ATENTION_MSG1;//+" "+GlobalStor.global.isZeroPriceList+" "+thisCtrl.ATENTION_MSG2;
                        GlobalStor.global.isZeroPriceList.forEach(function (ZeroElem) {
                            msg += " " + ZeroElem + "\n";
                        });
                        msg += " \n" + thisCtrl.ATENTION_MSG2;
                        GeneralServ.infoAlert(
                            thisCtrl.ATENTION,
                            msg
                        );
                    }

                }

                /**========== FINISH ==========*/
                //------ clicking
                thisCtrl.extendUrl = MainServ.extendUrl;

                thisCtrl.ClickOnFolder = ClickOnFolder;
                thisCtrl.alert = alert;
                thisCtrl.checkForAddElem = ProfileServ.checkForAddElem;
                thisCtrl.checkForAddElemScreen = checkForAddElemScreen;
                thisCtrl.profileForAlert = ProfileServ.profileForAlert;
                thisCtrl.selectProfile = ProfileServ.selectProfile;
                thisCtrl.showInfoBox = MainServ.showInfoBox;

            });
})();
