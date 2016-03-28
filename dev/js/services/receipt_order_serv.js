(function(){
  'use strict';
    /**@ngInject*/

  angular
    .module('BauVoiceApp')
    .factory('RecOrderServ',

  function ($q, HistoryServ, GlobalStor, HistoryStor) {
	var thisFactory = this;

    /**============ METHODS ================*/
    function box() {
    	var  deferred = $q.defer();
      HistoryServ.downloadProducts1().then(function(data) {
        var array = angular.copy(data),
            numLaminat = [],
            numHardware = [],
            numGlass = [],
            numProfile = [],
            namLaminatIn = '',
            namLaminatOut = '',
            namProfile = '',
            namGlass = '',
            namHardware = '',
            ordersQty = HistoryStor.history.isBoxArray.length, ord,
            laminatQty = GlobalStor.global.laminatCouples.length, glb,
            hardwaresQty = GlobalStor.global.hardwares.length, glbl,
            profilesQty = GlobalStor.global.profiles.length, glbp,
            glassesQty = GlobalStor.global.glasses.length, glbg;
            HistoryStor.history.isBoxArray = array;
           

        for(ord = 0; ord < ordersQty; ord+=1) {
          numLaminat.push(HistoryStor.history.isBoxArray[ord].lamination_id)
          numHardware.push(HistoryStor.history.isBoxArray[ord].hardware_id)
          numGlass.push(HistoryStor.history.isBoxArray[ord].glass_id)
          numProfile.push(HistoryStor.history.isBoxArray[ord].profile_id)
        }
            
        var laminatnln = numLaminat.length, nln,
            hardwaresnln = numHardware.length, hln,
            profilesnln = numProfile.length, pln,
            glassesnln = numGlass.length, gln;

        for(glb = 0; glb < laminatQty; glb+=1) {
          for(nln = 0; nln < laminatnln; nln+=1) {
            if (GlobalStor.global.laminatCouples[glb].id === numLaminat[nln]) {
              if(!laminatQty) {
                namLaminatIn += ' '+GlobalStor.global.laminatCouples[glb].laminat_in_name,
                namLaminatOut += ' '+ GlobalStor.global.laminatCouples[glb].laminat_out_name;
              } else {
                namLaminatIn += ' '+GlobalStor.global.laminatCouples[glb].laminat_in_name+',',
                namLaminatOut += ' '+ GlobalStor.global.laminatCouples[glb].laminat_out_name+',';
              }
            }
          }
        }
        for(glbl = 0; glbl < hardwaresQty; glbl+=1) {
          var globalQtyll = GlobalStor.global.hardwares[glbl].length, glbll;
          for(glbll = 0; glbll < globalQtyll; glbll+=1) {
            for(hln = 0; hln < hardwaresnln; hln+=1) {
              if(GlobalStor.global.hardwares[glbl][glbll].id === numHardware[hln]) {
                namHardware += ' '+GlobalStor.global.hardwares[glbl][glbll].name
              } 
            }
          }
        }
        for(glbp = 0; glbp < profilesQty; glbp+=1) {
          var globalQtypp = GlobalStor.global.profiles[glbp].length, glbpp;
          for(glbpp = 0; glbpp < globalQtypp; glbpp+=1) {
            for(pln = 0; pln < profilesnln; pln+=1) {
              if(GlobalStor.global.profiles[glbp][glbpp].id === numProfile[pln]) {
                namProfile = GlobalStor.global.profiles[glbp][glbpp].name
              }
            }
          }
        }
        for(glbg = 0; glbg < glassesQty; glbg+=1) {
          var globalQtygg = GlobalStor.global.glasses[glbg].length, glbgg;
          for(glbgg = 0; glbgg < globalQtygg; glbgg+=1) {
            for(gln = 0; gln<glassesnln; gln+=1) {
              if(''+GlobalStor.global.glasses[glbg][glbgg].id === numGlass[gln]) {
                namGlass = GlobalStor.global.glasses[glbg][glbgg].name
              }
            } 
          }
        } 
        var result = {
			numLaminat:numLaminat,
			numHardware:numHardware,
			numGlass: numGlass,
			numProfile: numProfile,
			namLaminatIn: namLaminatIn,
			namLaminatOut: namLaminatOut,
			namProfile: namProfile,
			namGlass: namGlass,
			namHardware: namHardware
        	}
        deferred.resolve(result);
      })
      return deferred.promise;
    }
    /**========== FINISH ==========*/

		thisFactory.publicObj = {
	      box:box
	    };
    	return thisFactory.publicObj;

    //------ clicking
    	box:box;
  });
})();