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
                      ProductStor,
                      DesignServ) {
                /*jshint validthis:true */
                var thisCtrl = this;
                thisCtrl.G = GlobalStor;
                thisCtrl.P = ProductStor;

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

                /**========== FINISH ==========*/

                //------ clicking
                thisCtrl.openLaminatFolder = openLaminatFolder;
                thisCtrl.selectLaminat = selectLaminat;
                thisCtrl.initLaminatFilter = initLaminatFilter;
                thisCtrl.showInfoBox = MainServ.showInfoBox;

            });
})();
