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

            id,
            name,
			      nameIn,
			      nameOut,

            ordersQty = array.length, ord,
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
          	var obj = {
          		nameIn:'',
          		nameOut:'',
          		id: 0
          		}
            if (GlobalStor.global.laminatCouples[glb].id === numLaminat[nln]) {
              if(!laminatQty) {
                obj.nameIn = GlobalStor.global.laminatCouples[glb].laminat_in_name,
                obj.nameOut = GlobalStor.global.laminatCouples[glb].laminat_out_name,
                obj.id = numLaminat[nln];
              } else {
                obj.nameIn = GlobalStor.global.laminatCouples[glb].laminat_in_name,
                obj.nameOut = GlobalStor.global.laminatCouples[glb].laminat_out_name,
                obj.id = numLaminat[nln];
              }
              	laminatObj.push(obj)
            }
          }
        }
        
        for(glbl = 0; glbl < hardwaresQty; glbl+=1) {
          var globalQtyll = GlobalStor.global.hardwares[glbl].length, glbll;
          for(glbll = 0; glbll < globalQtyll; glbll+=1) {
            for(hln = 0; hln < hardwaresnln; hln+=1) {
            	var obj = {
	          		name:'',
	          		id: 0
          			}
              if(GlobalStor.global.hardwares[glbl][glbll].id === numHardware[hln]) {
                obj.name = GlobalStor.global.hardwares[glbl][glbll].name,
                obj.id = numHardware[hln],
                hardwareObj.push(obj)
              }  
            }
          }
        }
        
        for(glbp = 0; glbp < profilesQty; glbp+=1) {
          var globalQtypp = GlobalStor.global.profiles[glbp].length, glbpp;
          for(glbpp = 0; glbpp < globalQtypp; glbpp+=1) {
            for(pln = 0; pln < profilesnln; pln+=1) {
            	var obj = {
	          		name:'',
	          		id: 0
          			}
              if(GlobalStor.global.profiles[glbp][glbpp].id === numProfile[pln]) {
                obj.name = GlobalStor.global.profiles[glbp][glbpp].name,
                obj.id = numProfile[pln]
                profilesObj.push(obj)
              }             	
            }
          }
        }
   
        for(glbg = 0; glbg < glassesQty; glbg+=1) {
          var globalQtygg = GlobalStor.global.glasses[glbg].length, glbgg;
          for(glbgg = 0; glbgg < globalQtygg; glbgg+=1) {
            for(gln = 0; gln<glassesnln; gln+=1) {
            	var obj = {
	          		name:'',
	          		id: 0
          			}
              if(''+GlobalStor.global.glasses[glbg][glbgg].id === numGlass[gln]) {
                obj.name = GlobalStor.global.glasses[glbg][glbgg].name,
                obj.id = numGlass[gln],
                glassObj.push(obj)
              }
            } 
          }
        } 

		HistoryStor.history.isLaminat = angular.copy(laminatObj);
		HistoryStor.history.isHardware = angular.copy(hardwareObj);
		HistoryStor.history.isGlass = angular.copy(glassObj);
		HistoryStor.history.isProfiles = angular.copy(profilesObj);
		console.log('isLaminat', HistoryStor.history.isLaminat)
        var result = {
			laminatObj:laminatObj,
			profilesObj:profilesObj,
			glassObj:glassObj,
			hardwareObj:hardwareObj
        	}
        deferred.resolve(1);
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