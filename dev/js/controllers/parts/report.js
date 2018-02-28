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
                      UserStor) {
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

                function culcReportPriceTotal(group) {
                    var currReportList;
                    if (group) {
                        currReportList = ProductStor.product.report.filter(function (item) {
                            return item.element_group_id === group;
                        });
                    } else {
                        currReportList = angular.copy(ProductStor.product.report);
                    }
                    if (currReportList.length) {
                        thisCtrl.config.reportPriceTotal = GeneralServ.roundingValue(currReportList.reduce(function (sum, item) {
                            return {priceReal: sum.priceReal + item.priceReal};
                        }).priceReal, 2);
                        thisCtrl.config.reportPriceBase = GeneralServ.roundingValue(currReportList.reduce(function (sum, item) {
                            return {price: sum.price + item.price};
                        }).price, 2);
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
                            thisCtrl.config.reportMenu.push({
                                id: 0,
                                name: $filter('translate')('common_words.ALL')
                            });
                        });
                    }
                    $rootScope.$apply();
                }
                function closeReport(){
                    console.log('closeReport');
                    GlobalStor.global.isReport = 0;
                    GlobalStor.global.isMobileReport = 1;
                }

                $('.main-content').off("keypress").keypress(function (event) {
                    //      console.log(UserStor.userInfo.user_type);
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