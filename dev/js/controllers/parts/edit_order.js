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
    
    function okey() {
      RecOrderServ.extendProfile();
      RecOrderServ.extendGlass();
      RecOrderServ.extendHardware();
      RecOrderServ.extendLaminat();
    }
    function close () {
      GlobalStor.global.isEditBox = 0;
      GlobalStor.global.isBox = 0;
      HistoryStor.history.isBoxArray = [];
      HistoryStor.history.listName = [];
      HistoryStor.history.listNameHardware = [];
      HistoryStor.history.listNameProfiles = [];
    }
    function listName () {
      RecOrderServ.nameListLaminat();
      RecOrderServ.nameListGlasses();
    }

    /**========== FINISH ==========*/

    //------ clicking
thisCtrl.box = RecOrderServ.box;
thisCtrl.nameListLaminat = RecOrderServ.nameListLaminat;
thisCtrl.nameListGlasses = RecOrderServ.nameListGlasses;
thisCtrl.extendLaminat = RecOrderServ.extendLaminat;
thisCtrl.extendHardware = RecOrderServ.extendHardware;
thisCtrl.extendProfile = RecOrderServ.extendProfile;
thisCtrl.extendGlass = RecOrderServ.extendGlass;
thisCtrl.okey = okey;
thisCtrl.close = close;
thisCtrl.listName = listName;

  });
})();