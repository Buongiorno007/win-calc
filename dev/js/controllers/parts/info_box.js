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

        thisCtrl.GLASS_TITLE_55 = $filter('translate')('natification.GLASS_TITLE_55');
        thisCtrl.GLASS_DESKR_55 = $filter('translate')('natification.GLASS_DESKR_55');

        thisCtrl.GLASS_TITLE_18 = $filter('translate')('natification.GLASS_TITLE_18');
        thisCtrl.GLASS_DESKR_18 = $filter('translate')('natification.GLASS_DESKR_18');
        thisCtrl.GLASS_TITLE_19 = $filter('translate')('natification.GLASS_TITLE_19');
        thisCtrl.GLASS_DESKR_19 = $filter('translate')('natification.GLASS_DESKR_19');
        thisCtrl.GLASS_TITLE_20 = $filter('translate')('natification.GLASS_TITLE_20');
        thisCtrl.GLASS_DESKR_20 = $filter('translate')('natification.GLASS_DESKR_20');
        thisCtrl.GLASS_TITLE_21 = $filter('translate')('natification.GLASS_TITLE_21');
        thisCtrl.GLASS_DESKR_21 = $filter('translate')('natification.GLASS_DESKR_21');
        thisCtrl.GLASS_TITLE_22 = $filter('translate')('natification.GLASS_TITLE_22');
        thisCtrl.GLASS_DESKR_22 = $filter('translate')('natification.GLASS_DESKR_22');
        thisCtrl.GLASS_TITLE_23 = $filter('translate')('natification.GLASS_TITLE_23');
        thisCtrl.GLASS_DESKR_23 = $filter('translate')('natification.GLASS_DESKR_23');
        thisCtrl.GLASS_TITLE_24 = $filter('translate')('natification.GLASS_TITLE_24');
        thisCtrl.GLASS_DESKR_24 = $filter('translate')('natification.GLASS_DESKR_24');
        thisCtrl.GLASS_TITLE_25 = $filter('translate')('natification.GLASS_TITLE_25');
        thisCtrl.GLASS_DESKR_25 = $filter('translate')('natification.GLASS_DESKR_25');
        thisCtrl.GLASS_TITLE_26 = $filter('translate')('natification.GLASS_TITLE_26');
        thisCtrl.GLASS_DESKR_26 = $filter('translate')('natification.GLASS_DESKR_26');
        thisCtrl.GLASS_TITLE_27 = $filter('translate')('natification.GLASS_TITLE_27');
        thisCtrl.GLASS_DESKR_27 = $filter('translate')('natification.GLASS_DESKR_27');
        thisCtrl.GLASS_TITLE_28 = $filter('translate')('natification.GLASS_TITLE_28');
        thisCtrl.GLASS_DESKR_28 = $filter('translate')('natification.GLASS_DESKR_28');
        thisCtrl.GLASS_TITLE_29 = $filter('translate')('natification.GLASS_TITLE_29');
        thisCtrl.GLASS_DESKR_29 = $filter('translate')('natification.GLASS_DESKR_29');
        thisCtrl.GLASS_TITLE_30 = $filter('translate')('natification.GLASS_TITLE_30');
        thisCtrl.GLASS_DESKR_30 = $filter('translate')('natification.GLASS_DESKR_30');
        thisCtrl.GLASS_TITLE_31 = $filter('translate')('natification.GLASS_TITLE_31');
        thisCtrl.GLASS_DESKR_31 = $filter('translate')('natification.GLASS_DESKR_31');
        thisCtrl.GLASS_TITLE_32 = $filter('translate')('natification.GLASS_TITLE_32');
        thisCtrl.GLASS_DESKR_32 = $filter('translate')('natification.GLASS_DESKR_32');
        thisCtrl.GLASS_TITLE_33 = $filter('translate')('natification.GLASS_TITLE_33');
        thisCtrl.GLASS_DESKR_33 = $filter('translate')('natification.GLASS_DESKR_33');
        thisCtrl.GLASS_TITLE_34 = $filter('translate')('natification.GLASS_TITLE_34');
        thisCtrl.GLASS_DESKR_34 = $filter('translate')('natification.GLASS_DESKR_34');
        thisCtrl.GLASS_TITLE_35 = $filter('translate')('natification.GLASS_TITLE_35');
        thisCtrl.GLASS_DESKR_35 = $filter('translate')('natification.GLASS_DESKR_35');
        thisCtrl.GLASS_TITLE_36 = $filter('translate')('natification.GLASS_TITLE_36');
        thisCtrl.GLASS_DESKR_36 = $filter('translate')('natification.GLASS_DESKR_36');
        thisCtrl.GLASS_TITLE_37 = $filter('translate')('natification.GLASS_TITLE_37');
        thisCtrl.GLASS_DESKR_37 = $filter('translate')('natification.GLASS_DESKR_37');
        thisCtrl.GLASS_TITLE_38 = $filter('translate')('natification.GLASS_TITLE_38');
        thisCtrl.GLASS_DESKR_38 = $filter('translate')('natification.GLASS_DESKR_38');
        thisCtrl.GLASS_TITLE_39 = $filter('translate')('natification.GLASS_TITLE_39');
        thisCtrl.GLASS_DESKR_39 = $filter('translate')('natification.GLASS_DESKR_39');
        thisCtrl.GLASS_TITLE_40 = $filter('translate')('natification.GLASS_TITLE_40');
        thisCtrl.GLASS_DESKR_40 = $filter('translate')('natification.GLASS_DESKR_40');
        thisCtrl.GLASS_TITLE_41 = $filter('translate')('natification.GLASS_TITLE_41');
        thisCtrl.GLASS_DESKR_41 = $filter('translate')('natification.GLASS_DESKR_41');
        thisCtrl.GLASS_TITLE_42 = $filter('translate')('natification.GLASS_TITLE_42');
        thisCtrl.GLASS_DESKR_42 = $filter('translate')('natification.GLASS_DESKR_42');
        thisCtrl.GLASS_TITLE_43 = $filter('translate')('natification.GLASS_TITLE_43');
        thisCtrl.GLASS_DESKR_43 = $filter('translate')('natification.GLASS_DESKR_43');
        thisCtrl.GLASS_TITLE_44 = $filter('translate')('natification.GLASS_TITLE_44');
        thisCtrl.GLASS_DESKR_44 = $filter('translate')('natification.GLASS_DESKR_44');
        thisCtrl.GLASS_TITLE_45 = $filter('translate')('natification.GLASS_TITLE_45');
        thisCtrl.GLASS_DESKR_45 = $filter('translate')('natification.GLASS_DESKR_45');
        thisCtrl.GLASS_TITLE_46 = $filter('translate')('natification.GLASS_TITLE_46');
        thisCtrl.GLASS_DESKR_46 = $filter('translate')('natification.GLASS_DESKR_46');
        thisCtrl.GLASS_TITLE_47 = $filter('translate')('natification.GLASS_TITLE_47');
        thisCtrl.GLASS_DESKR_47 = $filter('translate')('natification.GLASS_DESKR_47');
        thisCtrl.GLASS_TITLE_48 = $filter('translate')('natification.GLASS_TITLE_48');
        thisCtrl.GLASS_DESKR_48 = $filter('translate')('natification.GLASS_DESKR_48');
        thisCtrl.GLASS_TITLE_49 = $filter('translate')('natification.GLASS_TITLE_49');
        thisCtrl.GLASS_DESKR_49 = $filter('translate')('natification.GLASS_DESKR_49');
        thisCtrl.GLASS_TITLE_50 = $filter('translate')('natification.GLASS_TITLE_50');
        thisCtrl.GLASS_DESKR_50 = $filter('translate')('natification.GLASS_DESKR_50');
        thisCtrl.GLASS_TITLE_51 = $filter('translate')('natification.GLASS_TITLE_51');
        thisCtrl.GLASS_DESKR_51 = $filter('translate')('natification.GLASS_DESKR_51');
        thisCtrl.GLASS_TITLE_52 = $filter('translate')('natification.GLASS_TITLE_52');
        thisCtrl.GLASS_DESKR_52 = $filter('translate')('natification.GLASS_DESKR_52');
        thisCtrl.GLASS_TITLE_53 = $filter('translate')('natification.GLASS_TITLE_53');
        thisCtrl.GLASS_DESKR_53 = $filter('translate')('natification.GLASS_DESKR_53');
        thisCtrl.GLASS_TITLE_54 = $filter('translate')('natification.GLASS_TITLE_54');
        thisCtrl.GLASS_DESKR_54 = $filter('translate')('natification.GLASS_DESKR_54');

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