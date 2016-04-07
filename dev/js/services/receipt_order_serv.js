(function(){
  'use strict';
    /**@ngInject*/

  angular
    .module('BauVoiceApp')
    .factory('RecOrderServ',

  function ($q, GlobalStor, HistoryStor) {
	var thisFactory = this;

    /**============ METHODS ================*/
    function box() {
        var array = HistoryStor.history.isBoxArray,
            numLaminat = [],
            numHardware = [],
            numGlass = [],
            numProfile = [],

            laminatObj = [],
            hardwareObj = [],
            glassObj = [],
            profilesObj = [];
console.log('array', array)
        var ordersQty = array.length, ord,
            laminatQty = GlobalStor.global.laminatCouples.length, glb,
            hardwaresQty = GlobalStor.global.hardwares.length, glbl,
            profilesQty = GlobalStor.global.profiles.length, glbp,
            glassesQty = GlobalStor.global.glasses.length, glbg;

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



        for(ord = 0; ord < ordersQty; ord+=1) {
          if (array[ord].glass_id.length > 10) {
            var re = /\s*,\s*/;
            var arr = array[ord].glass_id.split(re);
          }
        }
      //================NameList for select==================//
        for(glb = 0; glb < laminatQty; glb+=1) {
          var nameIn,
              id,
              obj = {  
                  nameIn:'',
                  nameOut:'',
                  name: '',
                  img_in_id:'',
                  img_out_id:'',
                  id: 0,
                  profile_id: 0
                  };
          obj.profile_id = GlobalStor.global.laminatCouples[glb].profile_id,
          obj.id = GlobalStor.global.laminatCouples[glb].id,
          obj.nameIn = GlobalStor.global.laminatCouples[glb].laminat_in_name,
          obj.nameOut = GlobalStor.global.laminatCouples[glb].laminat_out_name,
          obj.img_in_id = GlobalStor.global.laminatCouples[glb].img_in_id
          obj.img_out_id = GlobalStor.global.laminatCouples[glb].img_out_id
          obj.name = GlobalStor.global.laminatCouples[glb].laminat_in_name + '/'+GlobalStor.global.laminatCouples[glb].laminat_out_name;
          HistoryStor.history.listName.push(obj);
          console.log('HistoryStor.history.isBoxArray', HistoryStor.history.isBoxArray)
        }
        for(glbl = 0; glbl < hardwaresQty; glbl+=1) {
         var globalQtyll = GlobalStor.global.hardwares[glbl].length, glbll;
          for(glbll = 0; glbll < globalQtyll; glbll+=1) {
           var name,
               id,
               obj = {  
                 name:'',
                 id: 0
               };
          obj.id = GlobalStor.global.hardwares[glbl][glbll].id,
          obj.name = GlobalStor.global.hardwares[glbl][glbll].name,
          HistoryStor.history.listNameHardware.push(obj);
          }
        }
        for(glbg = 0; glbg < glassesQty; glbg+=1) {
         var globalQtygg = GlobalStor.global.glasses[glbg].length, glbgg;;
          for(glbgg = 0; glbgg < globalQtygg; glbgg+=1) {
           var name,
               id,
               obj = {  
                 name:'',
                 id: 0
               };
          obj.id = GlobalStor.global.glasses[glbg][glbgg].id,
          obj.name = GlobalStor.global.glasses[glbg][glbgg].name
          HistoryStor.history.listNameGlass.push(obj);
          }
        }
        for(glbp = 0; glbp < profilesQty; glbp+=1) {
         var globalQtypp = GlobalStor.global.profiles[glbp].length, glbpp;
          for(glbpp = 0; glbpp < globalQtypp; glbpp+=1) {
           var name,
               id,
               obj = {  
                 name:'',
                 id: 0
               };
          obj.id = GlobalStor.global.profiles[glbp][glbpp].id,
          obj.name = GlobalStor.global.profiles[glbp][glbpp].name
          HistoryStor.history.listNameProfiles.push(obj);
          }
        }
      //================NameList for select==================//

      //================add name in array==================//  
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
      //================add name in array==================//    

    }

    function extend() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
        for(ord = 0; ord < ordersQty; ord+=1) {   
          if (HistoryStor.history.isBoxArray[ord].dataLamination !== undefined ) {
            delete HistoryStor.history.isBoxArray[ord].lamination_id;
            delete HistoryStor.history.isBoxArray[ord].nameIn;
            delete HistoryStor.history.isBoxArray[ord].nameOut;
            delete HistoryStor.history.isBoxArray[ord].lamination_in_id;
            delete HistoryStor.history.isBoxArray[ord].lamination_out_id;
            HistoryStor.history.isBoxArray[ord].lamination_id = HistoryStor.history.isBoxArray[ord].dataLamination.id;
            HistoryStor.history.isBoxArray[ord].nameIn = HistoryStor.history.isBoxArray[ord].dataLamination.nameIn;
            HistoryStor.history.isBoxArray[ord].nameOut = HistoryStor.history.isBoxArray[ord].dataLamination.nameOut;
            HistoryStor.history.isBoxArray[ord].lamination_in_id = HistoryStor.history.isBoxArray[ord].dataLamination.img_in_id;
            HistoryStor.history.isBoxArray[ord].lamination_out_id = HistoryStor.history.isBoxArray[ord].dataLamination.img_out_id;
            delete HistoryStor.history.isBoxArray[ord].dataLamination;
          }
          if (HistoryStor.history.isBoxArray[ord].dataHardware !== undefined) {
            delete HistoryStor.history.isBoxArray[ord].hardware_id;
            delete HistoryStor.history.isBoxArray[ord].nameHardware;
            HistoryStor.history.isBoxArray[ord].hardware_id = HistoryStor.history.isBoxArray[ord].dataHardware.id;
            HistoryStor.history.isBoxArray[ord].nameHardware = HistoryStor.history.isBoxArray[ord].dataHardware.name;
            delete HistoryStor.history.isBoxArray[ord].dataHardware;
          }
          if (HistoryStor.history.isBoxArray[ord].dataProfiles !== undefined) {
            delete HistoryStor.history.isBoxArray[ord].profile_id;
            delete HistoryStor.history.isBoxArray[ord].nameProfiles;
            HistoryStor.history.isBoxArray[ord].profile_id = HistoryStor.history.isBoxArray[ord].dataProfiles.id;
            HistoryStor.history.isBoxArray[ord].nameProfiles = HistoryStor.history.isBoxArray[ord].dataProfiles.name;
            delete HistoryStor.history.isBoxArray[ord].dataProfiles;
          }
          if (HistoryStor.history.isBoxArray[ord].dataGlass !== undefined) {
            delete HistoryStor.history.isBoxArray[ord].glass_id;
            delete HistoryStor.history.isBoxArray[ord].nameGlass;
            HistoryStor.history.isBoxArray[ord].glass_id = HistoryStor.history.isBoxArray[ord].dataGlass.id;
            HistoryStor.history.isBoxArray[ord].nameGlass = HistoryStor.history.isBoxArray[ord].dataGlass.name;
            delete HistoryStor.history.isBoxArray[ord].dataGlass;
          }
        }      
    }
    /**========== FINISH ==========*/

		thisFactory.publicObj = {
	      box:box,
        extend:extend
	    };
    	return thisFactory.publicObj;

    //------ clicking
    	box:box;
      extend:extend;
  });
})();