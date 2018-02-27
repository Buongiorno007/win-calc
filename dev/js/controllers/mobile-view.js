(function () {
    "use strict";
    /**@ngInject*/
    angular
        .module("MainModule")
        .controller("MobileCtrl", function ($filter,
                                            $timeout,
                                            SVGServ,
                                            MainServ,
                                            localDB,
                                            UserStor,
                                            OrderStor,
                                            GlobalStor,
                                            ProductStor) {
            var thisCtrl = this;
            GlobalStor.global.MobileTabActive = 0;

            thisCtrl.G = GlobalStor;
            thisCtrl.P = ProductStor;
            thisCtrl.U = UserStor;
            thisCtrl.O = OrderStor;

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
            thisCtrl.ATENTION = $filter('translate')('natification.ATENTION');
            thisCtrl.HEAT_TRANSFER_INFO_3 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_3');
            thisCtrl.HEAT_TRANSFER_INFO_4 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_4');
            thisCtrl.HEAT_TRANSFER_INFO_5 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_5');
            thisCtrl.HEAT_TRANSFER_INFO_6 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_6');
            thisCtrl.HEAT_TRANSFER_INFO_7 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_7');
            thisCtrl.HEAT_TRANSFER_INFO_8 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_8');
            thisCtrl.HEAT_TRANSFER_INFO_9 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_9');
            thisCtrl.HEAT_TRANSFER_INFO_10 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_10');
            thisCtrl.HEAT_TRANSFER_INFO_11 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_11');
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

            window.addEventListener('load', function () {
                var maybePreventPullToRefresh = false;
                var lastTouchY = 0;
                var touchstartHandler = function (e) {
                    if (e.touches.length != 1) return;
                    lastTouchY = e.touches[0].clientY;
                    // Pull-to-refresh will only trigger if the scroll begins when the
                    // document's Y offset is zero.
                    maybePreventPullToRefresh =
                        window.pageYOffset == 0;
                }

                var touchmoveHandler = function (e) {
                    var touchY = e.touches[0].clientY;
                    var touchYDelta = touchY - lastTouchY;
                    lastTouchY = touchY;

                    if (maybePreventPullToRefresh) {
                        // To suppress pull-to-refresh it is sufficient to preventDefault the
                        // first overscrolling touchmove.
                        maybePreventPullToRefresh = false;
                        if (touchYDelta > 0) {
                            e.preventDefault();
                            return;
                        }
                    }
                }

                document.addEventListener('touchstart', touchstartHandler, false);
                document.addEventListener('touchmove', touchmoveHandler, false);
            });


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

            thisCtrl.OpenPanel = OpenPanel;
            thisCtrl.showCoefInfoBlock = showCoefInfoBlock;
            thisCtrl.setTab = setTab;
            thisCtrl.isSet = isSet;
        });
})();
