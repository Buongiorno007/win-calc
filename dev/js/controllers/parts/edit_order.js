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
    HistoryServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.G = GlobalStor;

    /**============ METHODS ================*/
    function box() {
      HistoryServ.downloadProducts1().then(function(data) {
        var array = angular.copy(data),
            numLaminat = '',
            numHardware = '',
            numGlass = '',
            numProfile = '',
              namLaminatIn = '',
              namLaminatOut = '',
              namProfile = '',
              namGlass = '',
              namHardware = '',
            ordersQty = HistoryStor.history.isBoxArray.length, ord,
            globalQty = GlobalStor.global.laminatCouples.length, glb,
            globalQtyl = GlobalStor.global.hardwares.length, glbl,
            globalQtyp = GlobalStor.global.profiles.length, glbp,
            globalQtyg = GlobalStor.global.glasses.length, glbg;
            HistoryStor.history.isBoxArray = array;

              for(ord = 0; ord < ordersQty; ord+=1) {
                numLaminat = HistoryStor.history.isBoxArray[ord].lamination_id,
                numHardware = HistoryStor.history.isBoxArray[ord].hardware_id,
                numGlass = HistoryStor.history.isBoxArray[ord].glass_id,
                numProfile = HistoryStor.history.isBoxArray[ord].profile_id;
              }


              for(glb = 0; glb < globalQty; glb+=1) {
                if (GlobalStor.global.laminatCouples[glb].id === numLaminat) {
                  namLaminatIn = GlobalStor.global.laminatCouples[glb].laminat_in_name
                  namLaminatOut = GlobalStor.global.laminatCouples[glb].laminat_out_name
                }
              }


              for(glbl = 0; glbl < globalQtyl; glbl+=1) {
                var globalQtyll = GlobalStor.global.hardwares[glbl].length, glbll;
                  for(glbll = 0; glbll < globalQtyll; glbll+=1) {
                    if (GlobalStor.global.hardwares[glbl][glbll].id === numHardware) {
                      namHardware = GlobalStor.global.hardwares[glbl][glbll].name
                    } 
                  }
              }

              for(glbp = 0; glbp < globalQtyp; glbp+=1) {
                var globalQtypp = GlobalStor.global.profiles[glbp].length, glbpp;
                  for(glbpp = 0; glbpp < globalQtypp; glbpp+=1) {
                    if (GlobalStor.global.profiles[glbp][glbpp].id === numProfile) {
                      namProfile = GlobalStor.global.profiles[glbp][glbpp].name
                    }
                  }
              }

              for(glbg = 0; glbg < globalQtyg; glbg+=1) {
                var globalQtygg = GlobalStor.global.glasses[glbg].length, glbgg;
                  for(glbgg = 0; glbgg < globalQtygg; glbgg+=1) {
                    if (GlobalStor.global.glasses[glbg][glbgg].id === (+numGlass)) {
                      namGlass = GlobalStor.global.glasses[glbg][glbgg].name
                    }
                  } 
              }
      })
    }


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.box = box;
  });
})();