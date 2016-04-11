(function(){
  'use strict';
    /**@ngInject*/

  angular
    .module('BauVoiceApp')
    .factory('RecOrderServ',

  function ($q, GlobalStor, HistoryStor, ProductStor) {
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

        var ordersQty = array.length, ord,
            laminatQty = GlobalStor.global.laminatCouples.length, glb,
            hardwaresQty = GlobalStor.global.hardwares.length, glbl,
            profilesQty = GlobalStor.global.profiles.length, glbp,
            glassesQty = GlobalStor.global.glasses.length, glbg;

        for(ord = 0; ord < ordersQty; ord+=1) {
          array[ord].nameGlass = [];
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
          if (array[ord].glass_id.length) {
            var re = /\s*,\s*/,
                arr = array[ord].glass_id.split(re);
                delete array[ord].glass_id;
                array[ord].glass_id = arr;      
            var arrLength = arr.length, tst;
            
            for(tst=0; tst<arrLength; tst+=1) {
              var obj = {
                    id: 0
                  };
              obj.id = arr[tst];
              array[ord].glass_id.push(obj)
            }
          }
        }

        //================NameList for select================//
          for(glb = 0; glb < laminatQty; glb+=1) {
            var nameIn,
                id,
                obj = {  
                    name: '',
                    nameIn:'',
                    nameOut:'',
                    id: 0,
                    img_in_id: 0,
                    img_out_id: 0,
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
        //================NameList for select================//

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
                var arrQty = array[ord].glass_id.length, tst;
                var obj = {
                  name: ''
                }
                for(tst=0; tst<arrQty; tst+=1) {
                  if(''+GlobalStor.global.glasses[glbg][glbgg].id === array[ord].glass_id[tst]) {                 
                    obj.name = GlobalStor.global.glasses[glbg][glbgg].name;  
                    array[ord].nameGlass.push(obj)
                  }
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
        clear();
        for(ord = 0; ord < ordersQty; ord+=1) {  
          HistoryStor.history.isBoxArray[ord].template_source = JSON.parse(HistoryStor.history.isBoxArray[ord].template_source)
        console.log( HistoryStor.history.isBoxArray[ord].template_source, '1111')
        }
    }

    function clear() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord = 0; ord < ordersQty; ord+=1) {
        var tests = HistoryStor.history.isBoxArray[ord].glass_id.length, tts;
          for (tts=0; tts<tests; tts+=1) {
            if(typeof HistoryStor.history.isBoxArray[ord].glass_id[tts] === 'string') {
              delete HistoryStor.history.isBoxArray[ord].glass_id[tts];
              }
            }
          } 
          
       }

      function nameListGlasses() {
        var ordersQty = HistoryStor.history.isBoxArray.length, ord;
        var listNameGlass = [];
        var glassAllQty = GlobalStor.global.glassesAll.length, all;
          for(ord=0; ord<ordersQty; ord+=1 ) {
            for(all=0; all<glassAllQty; all+=1) {
              if(HistoryStor.history.isBoxArray[ord].dataProfiles) {
                if(HistoryStor.history.isBoxArray[ord].dataProfiles.id === GlobalStor.global.glassesAll[all].profileId) {
                  var listGlass = GlobalStor.global.glassesAll[all].glasses.length, lst;
                  for(lst = 0; lst < listGlass; lst+=1) {
                    var subListQty = GlobalStor.global.glassesAll[all].glasses[lst].length, lstt,
                    name,
                    id,
                    sku,
                    obj = {  
                      name:'',
                      id: 0,
                      sku: 0
                    };
                    for(lstt=0; lstt<subListQty; lstt+=1) {
                      obj.id = GlobalStor.global.glassesAll[all].glasses[lst][lstt].id,
                      obj.name = GlobalStor.global.glassesAll[all].glasses[lst][lstt].name,
                      obj.sku = GlobalStor.global.glassesAll[all].glasses[lst][lstt].sku
                      listNameGlass.push(obj);
                      HistoryStor.history.isBoxArray[ord].listNameGlass = listNameGlass;
                    }
                  }
                }
              }
            }
          }
          console.log(HistoryStor.history.isBoxArray)
      }
      console.log(HistoryStor.history.isBoxArray)
    function extendLaminat() {
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
        }    
    }
    function extendHardware() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
        for(ord = 0; ord < ordersQty; ord+=1) {   
          if (HistoryStor.history.isBoxArray[ord].dataHardware !== undefined) {
            delete HistoryStor.history.isBoxArray[ord].hardware_id;
            delete HistoryStor.history.isBoxArray[ord].nameHardware;
            HistoryStor.history.isBoxArray[ord].hardware_id = HistoryStor.history.isBoxArray[ord].dataHardware.id;
            HistoryStor.history.isBoxArray[ord].nameHardware = HistoryStor.history.isBoxArray[ord].dataHardware.name;
            delete HistoryStor.history.isBoxArray[ord].dataHardware;
          }
        }    
    }
    function extendProfile() {
      nameListGlasses()
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
        for(ord = 0; ord < ordersQty; ord+=1) {   
          if (HistoryStor.history.isBoxArray[ord].dataProfiles !== undefined) {
            delete HistoryStor.history.isBoxArray[ord].profile_id;
            delete HistoryStor.history.isBoxArray[ord].nameProfiles;
            HistoryStor.history.isBoxArray[ord].profile_id = HistoryStor.history.isBoxArray[ord].dataProfiles.id;
            HistoryStor.history.isBoxArray[ord].nameProfiles = HistoryStor.history.isBoxArray[ord].dataProfiles.name;
            delete HistoryStor.history.isBoxArray[ord].dataProfiles;
          }
        }    
    }
    function extendGlass() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
        for(ord = 0; ord < ordersQty; ord+=1) {   

            var arrayBoxQty = HistoryStor.history.isBoxArray[ord].nameGlass.length, tst;
            var glassId,
                nameGlass;
            for (tst = 0; tst<arrayBoxQty; tst+=1) {
              if(tst === 0){
                glassId = HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.id;
                nameGlass = HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.name;
              } else {
                glassId += ', '+HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.id;
                nameGlass += ', '+HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.name;
              }
            }
              delete HistoryStor.history.isBoxArray[ord].nameGlass;
              HistoryStor.history.isBoxArray[ord].glass_id = glassId+'';
        }    
        console.log('tests', HistoryStor.history.isBoxArray)
    }
    /**========== FINISH ==========*/

		thisFactory.publicObj = {
	      box:box,
        extendLaminat:extendLaminat,
        extendHardware:extendHardware,
        extendProfile:extendProfile,
        extendGlass:extendGlass,
        nameListGlasses:nameListGlasses,
        clear: clear
	    };
    	return thisFactory.publicObj;

    //------ clicking
    	box:box;
      nameListGlasses:nameListGlasses;
      extendLaminat:extendLaminat;
      extendHardware:extendHardware;
      extendProfile:extendProfile;
      extendGlass:extendGlass;
      clear: clear;
  });
})();