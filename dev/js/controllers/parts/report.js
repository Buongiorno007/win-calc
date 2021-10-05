(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .controller('ReportCtrl',

            function ($rootScope,
                      $filter,
                      $location,
                      localDB,
                      GeneralServ,
                      GlobalStor,
                      ProductStor,
                      UserStor,
                      $scope) {
                /*jshint validthis:true */
                var thisCtrl = this;
                thisCtrl.G = GlobalStor;
                thisCtrl.P = ProductStor;
                thisCtrl.U = UserStor;

                thisCtrl.config = {
                    reportMenu: [],
                    reportFilterId: undefined,
                    reportPriceTotal: 0,
                    reportPriceBase: 0
                };

                //------- translate
                thisCtrl.NAME_LABEL = $filter('translate')('add_elements.NAME_LABEL');
                thisCtrl.ARTICUL_LABEL = $filter('translate')('add_elements.ARTICUL_LABEL');
                thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');
                thisCtrl.SIZE_LABEL = $filter('translate')('add_elements.SIZE_LABEL');
                thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
                thisCtrl.CALL_ORDER_TOTAL_PRICE = $filter('translate')('cart.CALL_ORDER_TOTAL_PRICE');


                /**============ METHODS ================*/
                if ($location.path() === "/mobile") {
                    showReport();
                }
                var glassPrices = []
                function culcReportPriceTotal(group) {
                    var currReportList = [];
                    if (group) {
                        currReportList = ProductStor.product.report.filter(function (item) {
                            return item.element_group_id === group;
                        });
                    } else {
                        currReportList = angular.copy(ProductStor.product.report);
                    }

                    if (currReportList.length) {
                        localDB.selectLocalDB(localDB.tablesLocalDB.glass_prices.tableName, {
                        }).then(function(result) {
                            glassPrices = result[0]
                        })
                        currReportList.map((element) => {
                            if (element.element_group_id === 8) {
                                if (glassPrices.col_1_range > 0) {
                                    if (element.size < glassPrices.col_1_range) {
                                        element.price = glassPrices.col_1_price
                                        element.priceReal = (element.price * element.size) * GlobalStor.global.margins.coeff
                                    } 
                                } if (glassPrices.col_2_range_1 > 0) {
                                    if ((element.size > glassPrices.col_2_range_1) && (element.size < glassPrices.col_2_range_2 || glassPrices.col_2_range_2 === 0)) {
                                        element.price = glassPrices.col_2_price
                                        element.priceReal = (element.price * element.size) * GlobalStor.global.margins.coeff
                                    }
                                } if (glassPrices.col_3_range_1 > 0) {
                                    if (element.size > glassPrices.col_3_range_1 && (element.size < glassPrices.col_3_range_2 || glassPrices.col_3_range_2 === 0)) {
                                        element.price = glassPrices.col_3_price
                                        element.priceReal = (element.price * element.size) * GlobalStor.global.margins.coeff
                                    }
                                } if (glassPrices.col_4_range_1 > 0) {
                                    if ((element.size > glassPrices.col_4_range_1) && (element.size < glassPrices.col_4_range_2 || glassPrices.col_4_range_2 === 0)) {
                                        element.price = glassPrices.col_4_price
                                        element.priceReal = (element.price * element.size) * GlobalStor.global.margins.coeff
                                    }
                                }
                                if (glassPrices.col_5_range > 0) {
                                    if (element.size > glassPrices.col_5_range) {
                                        element.price = glassPrices.col_5_price
                                        element.priceReal = (element.price * element.size) * GlobalStor.global.margins.coeff
                                    }
                                }
                            } 
                        })
                        thisCtrl.config.reportPriceBase = GeneralServ.roundingValue(currReportList.reduce(function (sum, item) {
                            return {price: sum.price + item.price};
                        }).price, 2);
                        thisCtrl.config.reportPriceTotal = GeneralServ.roundingValue(currReportList.reduce(function (sum, item) {
                            return {priceReal: sum.priceReal + item.priceReal};
                        }).priceReal, 2);
                    } else {
                        thisCtrl.config.reportPriceTotal = 0;
                        thisCtrl.config.reportPriceBase = 0;
                    }
                }


                function sortReport(groupId) {
                    /** cuclulate Total Price of group of Report */
                    culcReportPriceTotal(groupId);
                    if (groupId) {
                        thisCtrl.config.reportFilterId = groupId;
                    } else {
                        thisCtrl.config.reportFilterId = undefined;
                    }
                }


                function showReport() {
                    GlobalStor.global.isReport = !GlobalStor.global.isReport;
                    /** cuclulate Total Price of Report */
                    culcReportPriceTotal();
                    /** download report Menu */
                    if (GlobalStor.global.isReport) {
                        localDB.selectLocalDB(localDB.tablesLocalDB.elements_groups.tableName).then(function (result) {
                            thisCtrl.config.reportMenu = result.filter(function (item) {
                                return item.position > 0;
                            });
                            thisCtrl.config.reportMenu.unshift({
                                id: 0,
                                name: $filter('translate')('common_words.ALL')
                            });
                        });
                    }
                    if ($location.path() !== "/mobile") {
                        $rootScope.$apply();
                    }
                }

                function closeReport() {
                    GlobalStor.global.isReport = 0;
                    GlobalStor.global.isMobileReport = 0;
                }

                $('.main-content').off("keypress").keypress(function (event) {
                    // console.log(UserStor.userInfo.user_type);
                    //console.log('RRRRRRRRR', event.keyCode);
                    //------ show report only for Plands (5,7)
                    if (UserStor.userInfo.user_type === 5 || UserStor.userInfo.user_type === 7) {
                        //----- Button 'R'
                        if (event.which === 1082 || event.which === 114) {
                            showReport();
                        }
                    }
                });


                /**========== FINISH ==========*/

                //------ clicking
                //thisCtrl.showReport = showReport;
                thisCtrl.closeReport = closeReport;
                thisCtrl.sortReport = sortReport;


            });
})();