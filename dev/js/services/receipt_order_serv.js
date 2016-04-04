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

            laminatObj = [],
            hardwareObj = [],
            glassObj = [],
            profilesObj = [],

            ordersQty = array.length, ord,
            laminatQty = GlobalStor.global.laminatCouples.length, glb,
            hardwaresQty = GlobalStor.global.hardwares.length, glbl,
            profilesQty = GlobalStor.global.profiles.length, glbp,
            glassesQty = GlobalStor.global.glasses.length, glbg;
            HistoryStor.history.isBoxArray = array;

        for(ord = 0; ord < ordersQty; ord+=1) {
          numLaminat.push(array[ord].lamination_id)
          numHardware.push(array[ord].hardware_id)
          numGlass.push(array[ord].glass_id)
          numProfile.push(array[ord].profile_id)
        }

        var laminatnln = numLaminat.length, nln,
            hardwaresnln = numHardware.length, hln,
            profilesnln = numProfile.length, pln,
            glassesnln = numGlass.length, gln;
                        
        for(glb = 0; glb < laminatQty; glb+=1) {
          for(ord = 0; ord < ordersQty; ord+=1) {
            if (GlobalStor.global.laminatCouples[glb].id === array[ord].lamination_id) {
              array[ord].nameIn = GlobalStor.global.laminatCouples[glb].laminat_in_name;
              array[ord].nameOut = GlobalStor.global.laminatCouples[glb].laminat_out_name;
            }
          }
        }
        
        for(glbl = 0; glbl < hardwaresQty; glbl+=1) {
          var globalQtyll = GlobalStor.global.hardwares[glbl].length, glbll;
          for(glbll = 0; glbll < globalQtyll; glbll+=1) {
            for(ord = 0; ord < ordersQty; ord+=1) {
              if(GlobalStor.global.hardwares[glbl][glbll].id === array[ord].hardware_id) {
                 array[ord].nameHardware = GlobalStor.global.hardwares[glbl][glbll].name;
              }  
            }
          }
        }
        
        for(glbg = 0; glbg < glassesQty; glbg+=1) {
          var globalQtygg = GlobalStor.global.glasses[glbg].length, glbgg;
          for(glbgg = 0; glbgg < globalQtygg; glbgg+=1) {
            for(ord = 0; ord < ordersQty; ord+=1) {
              if(''+GlobalStor.global.glasses[glbg][glbgg].id === array[ord].glass_id) {
                array[ord].nameGlass = GlobalStor.global.glasses[glbg][glbgg].name;
              }
            } 
          }
        } 
        for(glbp = 0; glbp < profilesQty; glbp+=1) {
          var globalQtypp = GlobalStor.global.profiles[glbp].length, glbpp;
          for(glbpp = 0; glbpp < globalQtypp; glbpp+=1) {
            for(ord = 0; ord < ordersQty; ord+=1) {
              if(GlobalStor.global.profiles[glbp][glbpp].id === array[ord].profile_id) {
                array[ord].nameProfiles = GlobalStor.global.profiles[glbp][glbpp].name;
              }             	
            }
          }
        }
      })
    }

    
    /**========== FINISH ==========*/

		thisFactory.publicObj = {
	      box:box
	    };
    	return thisFactory.publicObj;

    //------ clicking
    	box:box;
      listName:listName;
  });
})();