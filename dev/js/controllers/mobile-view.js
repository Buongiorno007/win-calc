(function () {
    "use strict";
    /**@ngInject*/
    angular
        .module("MainModule")
        .controller("MobileCtrl", function ($filter,
            $location,
            $timeout,
            $scope,
            $window,
            SVGServ,
            MainServ,
            NavMenuServ,
            localDB,
            UserStor,
            OrderStor,
            GeneralServ,
            GlobalStor,
            GlassesServ,
            DesignStor,
            globalConstants,
            ProductStor,
            AuxStor,
            CartStor) {
            var thisCtrl = this;
            GlobalStor.global.MobileTabActive = 0;
            GlobalStor.global.currOpenPage = 'mobile';
            thisCtrl.G = GlobalStor;
            thisCtrl.P = ProductStor;
            thisCtrl.U = UserStor;
            thisCtrl.O = OrderStor;
            thisCtrl.A = AuxStor;
            thisCtrl.C = CartStor;
            thisCtrl.D = DesignStor;

            thisCtrl.KARKAS = $filter("translate")("mainpage.KARKAS");
            thisCtrl.KONFIG = $filter("translate")("mainpage.KONFIG");
            thisCtrl.CART = $filter("translate")("mainpage.CART");
            thisCtrl.ROOM_SELECTION = $filter("translate")("mainpage.ROOM_SELECTION");
            thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
            thisCtrl.HEAT_TRANSFER = $filter('translate')('cart.HEAT_TRANSFER');
            thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
            thisCtrl.HEAT_TRANSFER_INFO_1 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_1');
            thisCtrl.HEAT_TRANSFER_INFO_2 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_2');
            thisCtrl.APPLY = $filter('translate')('common_words.APPLY');
            thisCtrl.CANCEL = $filter('translate')('add_elements.CANCEL');
            thisCtrl.ATENTION = $filter('translate')('natification.ATENTION');
            thisCtrl.TEMPLATE_SELECTION = $filter('translate')('panels.TEMPLATE_SELECTION');
            thisCtrl.HEAT_TRANSFER_INFO_3 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_3');
            thisCtrl.HEAT_TRANSFER_INFO_4 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_4');
            thisCtrl.HEAT_TRANSFER_INFO_5 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_5');
            thisCtrl.HEAT_TRANSFER_INFO_6 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_6');
            thisCtrl.HEAT_TRANSFER_INFO_7 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_7');
            thisCtrl.HEAT_TRANSFER_INFO_8 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_8');
            thisCtrl.HEAT_TRANSFER_INFO_9 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_9');
            thisCtrl.HEAT_TRANSFER_INFO_10 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_10');
            thisCtrl.HEAT_TRANSFER_INFO_11 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_11');

            thisCtrl.PC_POWER_INFO_1 = $filter('translate')('settings.PC_POWER_INFO_1');
            thisCtrl.PC_POWER_INFO_2 = $filter('translate')('settings.PC_POWER_INFO_2');

            thisCtrl.GO_TO_CALCULATION = $filter('translate')('settings.GO_TO_CALCULATION');
            thisCtrl.GEOLOCATION = $filter('translate')('settings.GEOLOCATION');
            thisCtrl.LANGUAGE = $filter('translate')('settings.LANGUAGE');
            thisCtrl.HINTS = $filter('translate')('settings.HINTS');
            thisCtrl.REPORT = $filter('translate')('settings.REPORT');
            thisCtrl.EXIT = $filter('translate')('settings.EXIT');
            thisCtrl.ORDER_HISTORY = $filter('translate')('settings.ORDER_HISTORY');
            thisCtrl.NAVMENU_ADD_ELEMENTS = $filter('translate')('mainpage.NAVMENU_ADD_ELEMENTS');



            thisCtrl.mobMenu = 0;
            thisCtrl.mobSize = 0;

            thisCtrl.mobWidth = self.innerWidth + 80;
            thisCtrl.mobHeight = self.innerHeight * 0.7;

            thisCtrl.mobWidthGlass = self.innerWidth;
            thisCtrl.mobHeightGlass = self.innerHeight * 0.65;

            MainServ.getPCPower();
            if (GlobalStor.global.productEditNumber && !ProductStor.product.is_addelem_only) {
                SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
                    .then(function (data) {
                        ProductStor.product.template = data;
                    });
            }
            localDB.getLocalStor().then((result) => {
                if (result)
                    if (!ProductStor.product.is_addelem_only) {
                        MainServ.profile();
                        MainServ.doorProfile();
                        MainServ.laminationDoor();
                    }
            });

            function saveProdAndGoToCart(go_to_cart) {
                checkForAddElem();
                GlobalStor.global.isNoChangedProduct = 0;
            }

            function saveAlertMobile() {
                GeneralServ.confirmAlert(
                    $filter('translate')('common_words.SAVE_OR_NO'),
                    $filter('translate')('  '),
                    saveProdAndGoToCart
                );
                GeneralServ.confirmPath(
                    setTab(4)
                );
            }

            function checkSavingProductMobile() {
                GlobalStor.global.isBox = 0;
                if (GlobalStor.global.isChangedTemplate) {
                    GlobalStor.global.isSavingAlert = 1;
                    saveAlertMobile();
                } else {
                    setTab(4);
                }
            }

            function setTab(newTab) {
                GlobalStor.global.activePanel = 0;
                if (GlobalStor.global.MobileTabActive === newTab) {
                    GlobalStor.global.MobileTabActive = 0;
                } else {
                    GlobalStor.global.MobileTabActive = newTab;
                }
            };

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
                if(GlobalStor.global.glasses.length) {
                    GlobalStor.global.glasses = GlobalStor.global.glasses.map((item) => {
                      return item.map((elem) => {
                        elem.apprPrice = GlassesServ.selectGlass(elem.id, elem.sku, elem.glass_color, elem)
                        return elem;
                      })
                    });
                    GlassesServ.selectGlass(GlobalStor.global.glasses[0][0].id, GlobalStor.global.glasses[0][0].sku, GlobalStor.global.glasses[0][0].glass_color, GlobalStor.global.glasses[0][0])
                  }
                //  ALERT
                GlobalStor.global.isNoChangedProduct = 1;
                if (!GlobalStor.global.isZeroPriceList.length) {
                    if (!ProductStor.product.is_addelem_only) {
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

            function openOrderDialog() {
                CartStor.cart.showCurrentTemp = 0;
                if (OrderStor.order.products.length) {
                    if (OrderStor.order.is_instalment) {
                        CartStor.cart.isCreditDialog = 1;
                    } else {
                        CartStor.cart.isOrderDialog = 1;
                    }
                }
                setTimeout(() => {
                    $(".user-field-phone").mask("+7(999) 999-99-99");
                }, 200);
            }

            function helpModalMobile() {
                const helpModalData = [
                  {
                    id: 1,
                    name: 'Как работает калькулятор?',
                    description: 'Всё очень просто! Приложение позволяет вам построить конструкцию, выбрать стеклопакет, изменить ламинацию, добавить подконник или водоотлив, далее вы оставляете нам свои данные (email и телефон) мы с вами связываемся и уточняем когда вам будет удобно принять ваш товар. Можете начать прямо сейчас! Переходите во вкладки с элементами и окновляйтесь вместе с РЕХАУ!',
                    img: './img/rehau-img/video-help-mobile.gif',
                  }
                ]
                MainServ.showInfoBox(1, helpModalData)
                console.log('check')
            }

            function isSet(tabNum) {
                return GlobalStor.global.MobileTabActive === tabNum;
            };

            function OpenPanel(panel) {
                GlobalStor.global.showCoefInfoBlock = !GlobalStor.global.showCoefInfoBlock;
                GlobalStor.global.activePanel = panel;
            }

            function showCoefInfoBlock() {
                console.log('CEHECE')
                GlobalStor.global.showCoefInfoBlock = !GlobalStor.global.showCoefInfoBlock;
            }

            function OpenMenu() {
                thisCtrl.mobMenu = !thisCtrl.mobMenu;
            }

            function mobileMenuClick(index) {
                switch (index) {
                    case 0: {
                        GlobalStor.global.mobileOrderHistory = 0;
                        thisCtrl.mobMenu = 0;
                        break;
                    }
                    case 1: {
                        $location.path("/location");
                        break;
                    }
                    case 2: {
                        GlobalStor.global.mobileOrderHistory = 1;
                        thisCtrl.mobMenu = 0;
                        // $location.path("/history");
                        break;
                    }
                    case 3: {
                        $location.path('/change-lang');
                        GlobalStor.global.prevOpenPage = 'mobile';
                        break;
                    }
                    case 4: {
                        break;
                    }
                    case 5: {
                        thisCtrl.mobMenu = 0;
                        GlobalStor.global.isMobileReport = !GlobalStor.global.isMobileReport;
                        if (!GlobalStor.global.isMobileReport) {
                            GlobalStor.global.isReport = 0;
                        }
                        break;
                    }
                    case 6: {
                        localStorage.clear();
                        localDB.db.clear().then(function () {
                            // Run this code once the database has been entirely deleted.
                            console.log('Database is now empty.');
                            location.reload();
                        }).catch(function (err) {
                            // This code runs if there were any errors
                            console.log(err);
                        });
                        // $location.path("/");
                        /**
                         * ЭТА ХУЙНЯ НУЖНA ДЛЯ ТОГО ЧТОБЫ ОБНУЛИТЬ ВСЕ ПЕРЕМЕННЫЕ
                         * ТАК КАК ПРО ОБЫЧНОМ ПЕРЕХОДЕ НА СТРАНИЦУ ЛОГИНА ДАННЫЕ СКАЧАННЫЕ С СЕРВЕРА ДОБАВЛЯЮТСЯ К УЖЕ СУЩЕСТВУЮЩИМ
                         **/
                        break;
                    }
                    case 7: {
                        thisCtrl.mobMenu = 0;
                        NavMenuServ.createAddElementsProduct();
                        break;
                    }
                }
            }

            function goToCart() {
                if (OrderStor.order.products.length) {
                    GlobalStor.global.showKarkas = 0;
                    GlobalStor.global.showConfiguration = 0;
                    GlobalStor.global.showCart = 1;
                    GlobalStor.global.activePanel = 0;
                    CartMenuServ.calculateOrderPrice();
                    CartMenuServ.joinAllAddElements();
                }
                else {
                    GeneralServ.infoAlert(
                        $filter('translate')('natification.ATENTION'),
                        $filter('translate')('common_words.SAVED_KONSTRUCTION_ATTENTION')
                    );
                }
                //  ALERT
                GlobalStor.global.isNoChangedProduct = 0;
            }


            /**
             * for testing
             * **/
            // $scope.getWindowOrientation = function () {
            //     return $window.orientation;
            // };
            //
            // $scope.$watch($scope.getWindowOrientation, function (newValue, oldValue) {
            //     console.log(newValue);
            //     switch (newValue) {
            //         case 0 : {
            //             $location.path('/mobile')
            //             break;
            //         }
            //         case 90 : {
            //             $location.path('/main')
            //             break;
            //         }
            //     }
            // }, true);
            //
            // angular.element($window).bind('orientationchange', function () {
            //     $scope.$apply();
            // });




            $("#main-frame").addClass("main-frame-mobView");
            $("#app-container").addClass("app-container-mobView");
            let obj = $("#main-frame");
            obj.css({
                "transform": "scale(1)",
                "left": "0px",
                "top": "0px",
            });


            /**========== FINISH ==========*/

            //------ clicking
            thisCtrl.closePanelMobile = MainServ.closePanelMobile;

            thisCtrl.mobileMenuClick = mobileMenuClick;
            thisCtrl.goToCart = goToCart;
            thisCtrl.OpenMenu = OpenMenu;
            thisCtrl.OpenPanel = OpenPanel;
            thisCtrl.helpModalMobile = helpModalMobile;
            thisCtrl.showCoefInfoBlock = showCoefInfoBlock;
            thisCtrl.checkSavingProductMobile = checkSavingProductMobile;
            thisCtrl.checkForAddElem = checkForAddElem;
            thisCtrl.openOrderDialog = openOrderDialog;
            thisCtrl.setTab = setTab;
            thisCtrl.isSet = isSet;

        });
})();
if (window.location.hostname !== 'localhost') {
    document.onkeydown = function (e) {
        if (event.keyCode == 123) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
            e.preventDefault()
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
            e.preventDefault()
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
            e.preventDefault()
            return false;
        }
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
            return false;
        }
    };

    document.addEventListener('contextmenu', event => event.preventDefault());
}
