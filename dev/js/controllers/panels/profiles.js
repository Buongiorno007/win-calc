(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ProfilesCtrl',

  function(
    $filter,
    globalConstants,
    GlobalStor,
    ProductStor,
    ProfileServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

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

    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.alert = alert;
    thisCtrl.checkForAddElem = ProfileServ.checkForAddElem;
    thisCtrl.profileForAlert = ProfileServ.profileForAlert;
    thisCtrl.selectProfile = ProfileServ.selectProfile;

  });
})();
