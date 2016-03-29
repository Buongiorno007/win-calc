(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('LaminationsCtrl',

  function(
    $filter,
    globalConstants,
    MainServ,
    GlobalStor,
    OrderStor,
    ProductStor,
    UserStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };

    //------- translate
    thisCtrl.LAMINAT_INSIDE = $filter('translate')('panels.LAMINAT_INSIDE');
    thisCtrl.LAMINAT_OUTSIDE = $filter('translate')('panels.LAMINAT_OUTSIDE');



    /**============ METHODS ================*/

    /** init Laminat Filter */
    function initLaminatFilter(typeId) {
      //console.info('init filter --- ', typeId);
      var laminatQty = GlobalStor.global.laminats.length;
      while(--laminatQty > -1) {
        if(GlobalStor.global.laminats[laminatQty].type_id === typeId) {
          GlobalStor.global.laminats[laminatQty].isActive = !GlobalStor.global.laminats[laminatQty].isActive;
          //console.info('init filter --- ', GlobalStor.global.laminats[laminatQty]);
          MainServ.laminatFiltering();
        }
      }
    }


    //------------ Select lamination
    function selectLaminat(id) {
      //console.info('select lamin --- ', id);
      MainServ.setCurrLamination(ProductStor.product, id);

      MainServ.setProfileByLaminat(id).then(function() {
        //------ save analytics data
        /** send analytics data to Server*/
//TODO AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id,OrderStor.order.id,ProductStor.product.template_id, id, 4);
      });

    }


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.selectLaminat = selectLaminat;
    thisCtrl.initLaminatFilter = initLaminatFilter;
    thisCtrl.showInfoBox = MainServ.showInfoBox;

  });
})();
