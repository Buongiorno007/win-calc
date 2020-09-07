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

                /**========== FINISH ==========*/
                //------ clicking
                thisCtrl.extendUrl = MainServ.extendUrl;

                thisCtrl.ClickOnFolder = ClickOnFolder;
                thisCtrl.alert = alert;
                thisCtrl.checkForAddElem = ProfileServ.checkForAddElem;
                thisCtrl.profileForAlert = ProfileServ.profileForAlert;
                thisCtrl.selectProfile = ProfileServ.selectProfile;
                thisCtrl.showInfoBox = MainServ.showInfoBox;

            });
})();
