(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('infoBoxCtrl',

      function (GlobalStor, InfoBoxServ, $filter, MainServ) {
        /*jshint validthis:true */
        var thisCtrl = this;
        thisCtrl.G = GlobalStor;
        //Country translation 
        thisCtrl.COUNTRY_NAME = $filter('translate')('natification.COUNTRY_NAME');
        thisCtrl.COUNTRY_DESKR = $filter('translate')('natification.COUNTRY_DESKR');
        thisCtrl.IDEAL_NAME = $filter('translate')('natification.IDEAL_NAME');
        thisCtrl.IDEAL_DESKR = $filter('translate')('natification.IDEAL_DESKR');

        thisCtrl.ASKING_PRICE = $filter('translate')('natification.ASKING_PRICE');
        //Profiles translation
        thisCtrl.PROFILE_TITLE = $filter('translate')('natification.PROFILE_TITLE');
        thisCtrl.PROFILE_DESKR = $filter('translate')('natification.PROFILE_DESKR');
        thisCtrl.PROFILE_TITLE_2 = $filter('translate')('natification.PROFILE_TITLE_2');
        thisCtrl.PROFILE_DESKR_2 = $filter('translate')('natification.PROFILE_DESKR_2');
        thisCtrl.PROFILE_TITLE_3 = $filter('translate')('natification.PROFILE_TITLE_3');
        thisCtrl.PROFILE_DESKR_3 = $filter('translate')('natification.PROFILE_DESKR_3');
        thisCtrl.PROFILE_TITLE_4 = $filter('translate')('natification.PROFILE_TITLE_4');
        thisCtrl.PROFILE_DESKR_4 = $filter('translate')('natification.PROFILE_DESKR_4');
        thisCtrl.PROFILE_TITLE_5 = $filter('translate')('natification.PROFILE_TITLE_5');
        thisCtrl.PROFILE_DESKR_5 = $filter('translate')('natification.PROFILE_DESKR_5');
        thisCtrl.PROFILE_TITLE_6 = $filter('translate')('natification.PROFILE_TITLE_6');
        thisCtrl.PROFILE_DESKR_6 = $filter('translate')('natification.PROFILE_DESKR_6');
        thisCtrl.PROFILE_TITLE_7 = $filter('translate')('natification.PROFILE_TITLE_7');
        thisCtrl.PROFILE_DESKR_7 = $filter('translate')('natification.PROFILE_DESKR_7');
        thisCtrl.PROFILE_TITLE_8 = $filter('translate')('natification.PROFILE_TITLE_8');
        thisCtrl.PROFILE_DESKR_8 = $filter('translate')('natification.PROFILE_DESKR_8');
        thisCtrl.PROFILE_TITLE_9 = $filter('translate')('natification.PROFILE_TITLE_9');
        thisCtrl.PROFILE_DESKR_9 = $filter('translate')('natification.PROFILE_DESKR_9');
        thisCtrl.PROFILE_TITLE_10 = $filter('translate')('natification.PROFILE_TITLE_10');
        thisCtrl.PROFILE_DESKR_10 = $filter('translate')('natification.PROFILE_DESKR_10');
        thisCtrl.PROFILE_TITLE_11 = $filter('translate')('natification.PROFILE_TITLE_11');
        thisCtrl.PROFILE_DESKR_11 = $filter('translate')('natification.PROFILE_DESKR_11');
        thisCtrl.PROFILE_TITLE_12 = $filter('translate')('natification.PROFILE_TITLE_12');
        thisCtrl.PROFILE_DESKR_12 = $filter('translate')('natification.PROFILE_DESKR_12');
        thisCtrl.PROFILE_TITLE_13 = $filter('translate')('natification.PROFILE_TITLE_13');
        thisCtrl.PROFILE_DESKR_13 = $filter('translate')('natification.PROFILE_DESKR_13');
        thisCtrl.PROFILE_TITLE_14 = $filter('translate')('natification.PROFILE_TITLE_14');
        thisCtrl.PROFILE_DESKR_14 = $filter('translate')('natification.PROFILE_DESKR_14');
        thisCtrl.PROFILE_TITLE_15 = $filter('translate')('natification.PROFILE_TITLE_15');
        thisCtrl.PROFILE_DESKR_15 = $filter('translate')('natification.PROFILE_DESKR_15');
        thisCtrl.PROFILE_TITLE_16 = $filter('translate')('natification.PROFILE_TITLE_16');
        thisCtrl.PROFILE_DESKR_16 = $filter('translate')('natification.PROFILE_DESKR_16');
        thisCtrl.PROFILE_TITLE_17 = $filter('translate')('natification.PROFILE_TITLE_17');
        thisCtrl.PROFILE_DESKR_17 = $filter('translate')('natification.PROFILE_DESKR_17');
        // These are already transfers of double-glazed windows
        thisCtrl.GLASS_TITLE = $filter('translate')('natification.GLASS_TITLE');
        thisCtrl.GLASS_DESKR = $filter('translate')('natification.GLASS_DESKR');
        thisCtrl.GLASS_TITLE_2 = $filter('translate')('natification.GLASS_TITLE_2');
        thisCtrl.GLASS_DESKR_2 = $filter('translate')('natification.GLASS_DESKR_2');
        thisCtrl.GLASS_TITLE_3 = $filter('translate')('natification.GLASS_TITLE_3');
        thisCtrl.GLASS_DESKR_3 = $filter('translate')('natification.GLASS_DESKR_3');
        thisCtrl.GLASS_TITLE_4 = $filter('translate')('natification.GLASS_TITLE_4');
        thisCtrl.GLASS_DESKR_4 = $filter('translate')('natification.GLASS_DESKR_4');
        thisCtrl.GLASS_TITLE_5 = $filter('translate')('natification.GLASS_TITLE_5');
        thisCtrl.GLASS_DESKR_5 = $filter('translate')('natification.GLASS_DESKR_5');
        thisCtrl.GLASS_TITLE_6 = $filter('translate')('natification.GLASS_TITLE_6');
        thisCtrl.GLASS_DESKR_6 = $filter('translate')('natification.GLASS_DESKR_6');
        thisCtrl.GLASS_TITLE_7 = $filter('translate')('natification.GLASS_TITLE_7');
        thisCtrl.GLASS_DESKR_7 = $filter('translate')('natification.GLASS_DESKR_7');
        thisCtrl.GLASS_TITLE_8 = $filter('translate')('natification.GLASS_TITLE_8');
        thisCtrl.GLASS_DESKR_8 = $filter('translate')('natification.GLASS_DESKR_8');
        thisCtrl.GLASS_TITLE_9 = $filter('translate')('natification.GLASS_TITLE_9');
        thisCtrl.GLASS_DESKR_9 = $filter('translate')('natification.GLASS_DESKR_9');
        thisCtrl.GLASS_TITLE_10 = $filter('translate')('natification.GLASS_TITLE_10');
        thisCtrl.GLASS_DESKR_10 = $filter('translate')('natification.GLASS_DESKR_10');
        thisCtrl.GLASS_TITLE_11 = $filter('translate')('natification.GLASS_TITLE_11');
        thisCtrl.GLASS_DESKR_11 = $filter('translate')('natification.GLASS_DESKR_11');
        thisCtrl.GLASS_TITLE_12 = $filter('translate')('natification.GLASS_TITLE_12');
        thisCtrl.GLASS_DESKR_12 = $filter('translate')('natification.GLASS_DESKR_12');
        thisCtrl.GLASS_TITLE_13 = $filter('translate')('natification.GLASS_TITLE_13');
        thisCtrl.GLASS_DESKR_13 = $filter('translate')('natification.GLASS_DESKR_13');
        thisCtrl.GLASS_TITLE_14 = $filter('translate')('natification.GLASS_TITLE_14');
        thisCtrl.GLASS_DESKR_14 = $filter('translate')('natification.GLASS_DESKR_14');
        thisCtrl.GLASS_TITLE_15 = $filter('translate')('natification.GLASS_TITLE_15');
        thisCtrl.GLASS_DESKR_15 = $filter('translate')('natification.GLASS_DESKR_15');
        thisCtrl.GLASS_TITLE_16 = $filter('translate')('natification.GLASS_TITLE_16');
        thisCtrl.GLASS_DESKR_16 = $filter('translate')('natification.GLASS_DESKR_16');
        thisCtrl.GLASS_TITLE_17 = $filter('translate')('natification.GLASS_TITLE_17');
        thisCtrl.GLASS_DESKR_17 = $filter('translate')('natification.GLASS_DESKR_17');

        //Translation AXOR
        thisCtrl.AXOR_TITLE = $filter('translate')('natification.AXOR_TITLE');
        thisCtrl.AXOR_DESKR = $filter('translate')('natification.AXOR_DESKR');
        thisCtrl.MACO_TITLE = $filter('translate')('natification.MACO_TITLE');
        thisCtrl.MACO_DESKR = $filter('translate')('natification.MACO_DESKR');

        // There are already translations of fittings
        thisCtrl.FITTINGS_TITLE = $filter('translate')('natification.FITTINGS_TITLE');
        thisCtrl.FITTINGS_DESKR = $filter('translate')('natification.FITTINGS_DESKR');
        thisCtrl.FITTINGS_TITLE_2 = $filter('translate')('natification.FITTINGS_TITLE_2');
        thisCtrl.FITTINGS_DESKR_2 = $filter('translate')('natification.FITTINGS_DESKR_2');
        thisCtrl.FITTINGS_TITLE_3 = $filter('translate')('natification.FITTINGS_TITLE_3');
        thisCtrl.FITTINGS_DESKR_3 = $filter('translate')('natification.FITTINGS_DESKR_3');
        thisCtrl.FITTINGS_TITLE_4 = $filter('translate')('natification.FITTINGS_TITLE_4');
        thisCtrl.FITTINGS_DESKR_4 = $filter('translate')('natification.FITTINGS_DESKR_4');
        thisCtrl.FITTINGS_TITLE_5 = $filter('translate')('natification.FITTINGS_TITLE_5');
        thisCtrl.FITTINGS_DESKR_5 = $filter('translate')('natification.FITTINGS_DESKR_5');
        thisCtrl.FITTINGS_TITLE_6 = $filter('translate')('natification.FITTINGS_TITLE_6');
        thisCtrl.FITTINGS_DESKR_6 = $filter('translate')('natification.FITTINGS_DESKR_6');
        thisCtrl.FITTINGS_TITLE_7 = $filter('translate')('natification.FITTINGS_TITLE_7');
        thisCtrl.FITTINGS_DESKR_7 = $filter('translate')('natification.FITTINGS_DESKR_7');
        thisCtrl.FITTINGS_TITLE_8 = $filter('translate')('natification.FITTINGS_TITLE_8');
        thisCtrl.FITTINGS_DESKR_8 = $filter('translate')('natification.FITTINGS_DESKR_8');
        /**============ METHODS ================*/

        /** close Info Box */
        function closeInfoBox(clickEvent) {
          clickEvent.stopPropagation();
          if (GlobalStor.global.showApply === 1) {
            GlobalStor.global.inform = 1;
          }
          GlobalStor.global.showApply = 0
          GlobalStor.global.isInfoBox = 0;
          GlobalStor.global.infoTitle = '';
          GlobalStor.global.infoImg = '';
          GlobalStor.global.infoLink = '';
          GlobalStor.global.infoDescrip = '';
        }


        /**========== FINISH ==========*/
        //------ clicking
        thisCtrl.extendUrl = MainServ.extendUrl;
        thisCtrl.closeInfoBox = closeInfoBox;
        thisCtrl.isApply = InfoBoxServ.isApply;


      });
})();