(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .controller('EditOrderCtrl',

  function(
    $filter,
    OrderStor,
    HistoryStor,
    CartStor,
    GlobalStor,
    RecOrderServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.G = GlobalStor;


    thisCtrl.CONFIGMENU_PROFILE = $filter('translate')('mainpage.CONFIGMENU_PROFILE');
    thisCtrl.CONFIGMENU_GLASS = $filter('translate')('mainpage.CONFIGMENU_GLASS');
    thisCtrl.CONFIGMENU_HARDWARE = $filter('translate')('mainpage.CONFIGMENU_HARDWARE');
    thisCtrl.CONFIGMENU_LAMINATION = $filter('translate')('mainpage.CONFIGMENU_LAMINATION');

    /**============ METHODS ================*/
    
    function profileOK() {
      RecOrderServ.extendProfile();
  }
    function glassOK() {
      RecOrderServ.extendGlass();
  }
    function hardwareOK() {
      RecOrderServ.extendHardware();

  }
    function laminationOK() {
      RecOrderServ.extendLaminat();
  }


    /**========== FINISH ==========*/

    //------ clicking
thisCtrl.box = RecOrderServ.box;
thisCtrl.extendLaminat = RecOrderServ.extendLaminat;
thisCtrl.extendHardware = RecOrderServ.extendHardware;
thisCtrl.extendProfile = RecOrderServ.extendProfile;
thisCtrl.extendGlass = RecOrderServ.extendGlass;
thisCtrl.profileOK = profileOK;
thisCtrl.glassOK = glassOK;
thisCtrl.hardwareOK = hardwareOK;
thisCtrl.laminationOK = laminationOK;
  });
})();