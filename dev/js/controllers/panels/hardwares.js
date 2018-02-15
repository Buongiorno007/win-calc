(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .controller('HardwaresCtrl',

            function ($filter,
                      globalConstants,
                      GlobalStor,
                      OrderStor,
                      ProductStor,
                      DesignStor,
                      UserStor,
                      MainServ,
                      AnalyticsServ,
                      HardwareServ) {
                /*jshint validthis:true */
                var thisCtrl = this;
                thisCtrl.G = GlobalStor;
                thisCtrl.P = ProductStor;
                thisCtrl.U = UserStor;
                thisCtrl.O = OrderStor;
                thisCtrl.config = {
                    DELAY_START: 5 * globalConstants.STEP,
                    DELAY_BLOCK: 2 * globalConstants.STEP,
                    DELAY_TYPING: 2.5 * globalConstants.STEP,
                    typing: 'on'
                };
                thisCtrl.APPLY = $filter('translate')('common_words.APPLY');
                console.log(GlobalStor.global.hardwares);

                //------- translate

                thisCtrl.BRAND = $filter('translate')('panels.BRAND');
                thisCtrl.COUNTRY = $filter('translate')('panels.COUNTRY');
                thisCtrl.CORROSION_COEFF = $filter('translate')('panels.CORROSION_COEFF');
                thisCtrl.BURGLAR_COEFF = $filter('translate')('panels.BURGLAR_COEFF');
                thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
                thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
                thisCtrl.HEAT_TRANSFER = $filter('translate')('cart.HEAT_TRANSFER');
                thisCtrl.NOICE_INSULATION = $filter('translate')('panels.NOICE_INSULATION');
                /**========== FINISH ==========*/

                //------ clicking
                thisCtrl.closePanelMobile = MainServ.closePanelMobile;
                thisCtrl.selectHardware = HardwareServ.selectHardware;
                thisCtrl.showInfoBox = MainServ.showInfoBox;

            });
})();
