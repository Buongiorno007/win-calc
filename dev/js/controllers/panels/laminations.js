(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('LaminationsCtrl', laminationSelectorCtrl);

  function laminationSelectorCtrl($timeout, $filter, globalConstants, MainServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };

    //------ clicking
    thisCtrl.selectLaminat = selectLaminat;
    thisCtrl.initLaminatFilter = initLaminatFilter;
    thisCtrl.showInfoBox = MainServ.showInfoBox;

    //============ methods ================//


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
      MainServ.setCurrLamination(id);


      //MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
      //  ProductStor.product.glass.length = 0;
      //  MainServ.parseTemplate().then(function () {
      //    //------ save analytics data
      //    /** send analytics data to Server*/
      //    //TODO AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, id, 4);
      //  });
      //});

    }

  }
})();
