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
                                            localDB,
                                            UserStor,
                                            OrderStor,
                                            GlobalStor,
                                            DesignStor,
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


            thisCtrl.mobMenu = 0;
            thisCtrl.mobSize = 0;
            if (self.innerWidth > self.innerHeight) {
                thisCtrl.mobSize = self.innerHeight;
            } else {
                thisCtrl.mobSize = self.innerWidth + 70;
            }
            thisCtrl.mobWidth = self.innerWidth + 70;
            thisCtrl.mobHeight = self.innerHeight * 0.8;

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

            function setTab(newTab) {
                GlobalStor.global.activePanel = 0;
                if (GlobalStor.global.MobileTabActive === newTab) {
                    GlobalStor.global.MobileTabActive = 0;
                } else {
                    GlobalStor.global.MobileTabActive = newTab;
                }
            };

            function isSet(tabNum) {
                return GlobalStor.global.MobileTabActive === tabNum;
            };

            function OpenPanel(panel) {
                GlobalStor.global.showCoefInfoBlock = !GlobalStor.global.showCoefInfoBlock;
                GlobalStor.global.activePanel = panel;
            }

            function showCoefInfoBlock() {
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
                        }).catch(function (err) {
                            // This code runs if there were any errors
                            console.log(err);
                        });
                        // $location.path("/");
                        /**
                         * ЭТА ХУЙНЯ НУЖНA ДЛЯ ТОГО ЧТОБЫ ОБНУЛИТЬ ВСЕ ПЕРЕМЕННЫЕ
                         * ТАК КАК ПРО ОБЫЧНОМ ПЕРЕХОДЕ НА СТРАНИЦУ ЛОГИНА ДАННЫЕ СКАЧАННЫЕ С СЕРВЕРА ДОБАВЛЯЮТСЯ К УЖЕ СУЩЕСТВУЮЩИМ
                         **/
                        location.reload();
                        break;
                    }
                }
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


            $("#closeSizeCaclulator").on('click', (event) => {
                console.log(event);
            }, false);


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
            thisCtrl.OpenMenu = OpenMenu;
            thisCtrl.OpenPanel = OpenPanel;
            thisCtrl.showCoefInfoBlock = showCoefInfoBlock;
            thisCtrl.setTab = setTab;
            thisCtrl.isSet = isSet;

        });
})();

$('input').keypress(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        alert('You pressed enter! - keypress');
    }
});