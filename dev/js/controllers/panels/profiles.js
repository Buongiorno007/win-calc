(function () {
  'use strict';
  /**@ngInject*/
  angular.module('MainModule').controller(
    'ProfilesCtrl',

    function (
      $filter,
      globalConstants,
      GlobalStor,
      OrderStor,
      ProductStor,
      ProfileServ,
      UserStor,
      MainServ,
      HardwareServ,
      GlassesServ
    ) {
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
      thisCtrl.COUNTRY_NAME = $filter('translate')('panels.COUNTRY_NAME');
      thisCtrl.PROFILE_NAME = $filter('translate')('panels.PROFILE_NAME');
      thisCtrl.PROFILE_NAME_2 = $filter('translate')('panels.PROFILE_NAME_2');
      thisCtrl.PROFILE_NAME_3 = $filter('translate')('panels.PROFILE_NAME_3');
      thisCtrl.PROFILE_NAME_4 = $filter('translate')('panels.PROFILE_NAME_4');
      thisCtrl.PROFILE_NAME_5 = $filter('translate')('panels.PROFILE_NAME_5');
      thisCtrl.PROFILE_NAME_6 = $filter('translate')('panels.PROFILE_NAME_6');
      thisCtrl.PROFILE_NAME_7 = $filter('translate')('panels.PROFILE_NAME_7');
      thisCtrl.PROFILE_NAME_8 = $filter('translate')('panels.PROFILE_NAME_8');
      thisCtrl.PROFILE_NAME_9 = $filter('translate')('panels.PROFILE_NAME_9');
      thisCtrl.PROFILE_NAME_10 = $filter('translate')('panels.PROFILE_NAME_10');
      thisCtrl.PROFILE_NAME_11 = $filter('translate')('panels.PROFILE_NAME_11');
      thisCtrl.PROFILE_NAME_12 = $filter('translate')('panels.PROFILE_NAME_12');
      thisCtrl.PROFILE_NAME_13 = $filter('translate')('panels.PROFILE_NAME_13');
      thisCtrl.PROFILE_NAME_14 = $filter('translate')('panels.PROFILE_NAME_14');
      thisCtrl.PROFILE_NAME_15 = $filter('translate')('panels.PROFILE_NAME_15');
      thisCtrl.PROFILE_NAME_16 = $filter('translate')('panels.PROFILE_NAME_16');
      thisCtrl.PROFILE_NAME_17 = $filter('translate')('panels.PROFILE_NAME_17');
      thisCtrl.PROFILE_NAME_18 = $filter('translate')('panels.PROFILE_NAME_18');
      thisCtrl.PROFILE_NAME_19 = $filter('translate')('panels.PROFILE_NAME_19');
      thisCtrl.PROFILE_NAME_20 = $filter('translate')('panels.PROFILE_NAME_20');
      thisCtrl.PROFILE_NAME_21 = $filter('translate')('panels.PROFILE_NAME_21');
      thisCtrl.COUNTRY = $filter('translate')('panels.COUNTRY');
      thisCtrl.HEAT_INSULATION = $filter('translate')('panels.HEAT_INSULATION');
      thisCtrl.NOICE_INSULATION = $filter('translate')(
        'panels.NOICE_INSULATION'
      );
      thisCtrl.APPLY = $filter('translate')('common_words.APPLY');
      thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
      thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
      thisCtrl.CAMERa = $filter('translate')('panels.CAMERa');
      thisCtrl.CAMER = $filter('translate')('panels.CAMER');
      thisCtrl.CAMERs = $filter('translate')('panels.CAMERs');
      thisCtrl.HEAT_TRANSFER = $filter('translate')('cart.HEAT_TRANSFER');

      function ClickOnFolder(event) {
        if ($(event.target).parent().attr('class') === 'producer') {
          $('.profiles-list').animate(
            {
              scrollTop:
                $(event.target).offset().top +
                $('.profiles-list').scrollTop() -
                120
            },
            'slow'
          );
        } else {
          $('.profiles-list').animate(
            {
              scrollTop:
                $(event.target).offset().top +
                $('.profiles-list').scrollTop() -
                100
            },
            'slow'
          );
        }
      }

      function selectSet(sets) {
        const setToAply = sets.set[0];
        GlobalStor.global.activeSet = setToAply;
        ProfileServ.selectProfile(setToAply.profile_systems_id);
        HardwareServ.selectHardware(setToAply.window_hardware_groups_id);
        GlassesServ.selectGlass(setToAply.list_id);

        return new Promise((resolve) => {
          setTimeout(() => {
            ProfileServ.selectProfile(setToAply.profile_systems_id);
            HardwareServ.selectHardware(setToAply.window_hardware_groups_id);
            GlassesServ.selectGlass(setToAply.list_id);
            resolve();
            ProductStor.product.currentSet = sets;
          }, 1);
        });
      }

      /**========== FINISH ==========*/
      //------ clicking
      thisCtrl.extendUrl = MainServ.extendUrl;

      thisCtrl.ClickOnFolder = ClickOnFolder;
      thisCtrl.alert = alert;
      thisCtrl.selectSet = selectSet;
      thisCtrl.checkForAddElem = ProfileServ.checkForAddElem;
      thisCtrl.profileForAlert = ProfileServ.profileForAlert;
      thisCtrl.selectProfile = ProfileServ.selectProfile;
      thisCtrl.showInfoBox = MainServ.showInfoBox;
    }
  );
})();
