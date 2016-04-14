(function(){
  'use strict';
    /**@ngInject*/

  angular
    .module('BauVoiceApp')
    .factory('RecOrderServ',

  function ($q, GlobalStor, HistoryStor, ProductStor, localDB) {
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
          for(glbl = 0; glbl < hardwaresQty; glbl+=1) {
           var globalQtyll = GlobalStor.global.hardwares[glbl].length, glbll;
            for(glbll = 0; glbll < globalQtyll; glbll+=1) {
             var name,
                 id,
                 obj = {  
                   name:'',
                   id: 0,
                   hardware:''
                 };

            obj.id = GlobalStor.global.hardwares[glbl][glbll].id,
            obj.name = GlobalStor.global.hardwares[glbl][glbll].name,
            obj.hardware = GlobalStor.global.hardwares[glbl][glbll],
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
                  name: '',
                  id: 0
                }
                for(tst=0; tst<arrQty; tst+=1) {
                  if(''+GlobalStor.global.glasses[glbg][glbgg].id === array[ord].glass_id[tst]) {                 
                    obj.name = GlobalStor.global.glasses[glbg][glbgg].name;
                    obj.id = GlobalStor.global.glasses[glbg][glbgg].id;
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
        }
    }
    function clear() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord = 0; ord < ordersQty; ord+=1) {
        var tests = HistoryStor.history.isBoxArray[ord].glass_id.length;
        var tets = angular.copy(tests)
        HistoryStor.history.isBoxArray[ord].glass_id.splice(0,[tests]/2);                 
      } 
    }
    function nameListGlasses(product_id) {

      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      var glassAllQty = GlobalStor.global.glassesAll.length, all;
        for(ord=0; ord<ordersQty; ord+=1 ) {
          var listNameGlass = [];
          for(all=0; all<glassAllQty; all+=1) {
            if(HistoryStor.history.isBoxArray[ord].dataProfiles) {
              if (HistoryStor.history.isBoxArray[ord].product_id === product_id) {
                if(HistoryStor.history.isBoxArray[ord].dataProfiles.id === GlobalStor.global.glassesAll[all].profileId) {
                  var listGlass = GlobalStor.global.glassesAll[all].glasses.length, lst;
                  for(lst = 0; lst < listGlass; lst+=1) {
                    var subListQty = GlobalStor.global.glassesAll[all].glasses[lst].length, lstt;
                    for(lstt=0; lstt<subListQty; lstt+=1) {
                      var name,
                          id,
                          sku,
                          obj = {  
                            name:'',
                            id: 0,
                            sku: 0
                          };
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
        }    
    }
    function nameListLaminat(product_id) {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      var listNameLaminat = [];
      var laminatAllQty = GlobalStor.global.laminatCouples.length, glb;
        for(ord=0; ord<ordersQty; ord+=1 ) {
          for(glb=0; glb<laminatAllQty; glb+=1) {
            if(HistoryStor.history.isBoxArray[ord].dataProfiles) {
              if (HistoryStor.history.isBoxArray[ord].product_id === product_id) {
                if(HistoryStor.history.isBoxArray[ord].dataProfiles.id === GlobalStor.global.laminatCouples[glb].profile_id) {
                  var nameIn,
                      id,
                      obj = {  
                          name: '',
                          nameIn:'',
                          nameOut:'',
                          id: 0,
                          img_in_id: 0,
                          img_out_id: 0,
                          profile_id: 0,
                          lamination: ''
                          };
                  obj.profile_id = GlobalStor.global.laminatCouples[glb].profile_id,
                  obj.id = GlobalStor.global.laminatCouples[glb].id,
                  obj.nameIn = GlobalStor.global.laminatCouples[glb].laminat_in_name,
                  obj.nameOut = GlobalStor.global.laminatCouples[glb].laminat_out_name,
                  obj.img_in_id = GlobalStor.global.laminatCouples[glb].img_in_id,
                  obj.img_out_id = GlobalStor.global.laminatCouples[glb].img_out_id,
                  obj.lamination = GlobalStor.global.laminatCouples[glb],
                  obj.name = GlobalStor.global.laminatCouples[glb].laminat_in_name + '/'+GlobalStor.global.laminatCouples[glb].laminat_out_name;
                  listNameLaminat.push(obj);
                  HistoryStor.history.isBoxArray[ord].listNameLaminat = listNameLaminat;  
                }
              }
            }
          }
        }    
    }
    function templateSource() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
        for (ord = 0; ord<ordersQty; ord+=1) {

          delete HistoryStor.history.isBoxArrayCopy[ord].hardware_id;
          delete HistoryStor.history.isBoxArrayCopy[ord].lamination_id;
          delete HistoryStor.history.isBoxArrayCopy[ord].lamination_in_id;
          delete HistoryStor.history.isBoxArrayCopy[ord].lamination_out_id;
          delete HistoryStor.history.isBoxArrayCopy[ord].order_id;
          delete HistoryStor.history.isBoxArrayCopy[ord].product_id;
          delete HistoryStor.history.isBoxArrayCopy[ord].profile_id;
          delete HistoryStor.history.isBoxArrayCopy[ord].template_source;

          var re = /\s*,\s*/,
              arrayOld = HistoryStor.history.isBoxArrayCopy[ord].glass_id.split(re),
              arrayNew = HistoryStor.history.isBoxArray[ord].glass_id.split(re);
              HistoryStor.history.isBoxArrayCopy[ord].glass_id = arrayOld;
              HistoryStor.history.isBoxArrayCopy[ord].n_glass_id = arrayNew;
              
          var subOrdersQty = HistoryStor.history.isBoxArrayCopy[ord].glass_id.length, srd;
          for (srd=0; srd<subOrdersQty; srd+=1) {
            var obj = {
                  old: 0
                },
                objn = {
                  newId: 0
                };
            objn.newId = HistoryStor.history.isBoxArrayCopy[ord].n_glass_id[srd];
            obj.old = HistoryStor.history.isBoxArrayCopy[ord].glass_id[srd];
            HistoryStor.history.isBoxArrayCopy[ord].glass_id.push(obj)
            HistoryStor.history.isBoxArrayCopy[ord].n_glass_id.push(objn)
          }
              HistoryStor.history.isBoxArrayCopy[ord].glass_id.splice(0, ([subOrdersQty]/2)+1);
              HistoryStor.history.isBoxArrayCopy[ord].n_glass_id.splice(0, ([subOrdersQty]/2)+1);
        }
      for(ord=0;ord<ordersQty; ord+=1){
        var tempSourQty = HistoryStor.history.isBoxArray[ord].template_source.details.length, tsq;
        var oldGlassQty = HistoryStor.history.isBoxArrayCopy[ord].glass_id.length, ogt;
          for(ogt=0; ogt<oldGlassQty; ogt+=1) {
            for(tsq=0; tsq<tempSourQty; tsq+=1) {
              if(HistoryStor.history.isBoxArray[ord].template_source.details[tsq].glassId === 1*HistoryStor.history.isBoxArrayCopy[ord].glass_id[ogt].old) {
                HistoryStor.history.isBoxArray[ord].template_source.details[tsq].glassId = HistoryStor.history.isBoxArrayCopy[ord].n_glass_id[ogt].newId  
              }
            }
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
            HistoryStor.history.isBoxArray[ord].hardware = HistoryStor.history.isBoxArray[ord].dataHardware.hardware;
            delete HistoryStor.history.isBoxArray[ord].dataHardware;
          }
        }    
    }
    function extendProfile() {
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
              } 
              else {
                glassId += ', '+HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.id;
                nameGlass += ', '+HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.name;
              }
            }
              delete HistoryStor.history.isBoxArray[ord].nameGlass;
              HistoryStor.history.isBoxArray[ord].glass_id = glassId+'';
        }   
        glasses();
    }
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
            HistoryStor.history.isBoxArray[ord].lamination = HistoryStor.history.isBoxArray[ord].dataLamination.lamination;
            var GlassQty = HistoryStor.history.isBoxArray[ord].glasses.length, gls;
              for(gls=0; gls < GlassQty; gls+=1) {
                 HistoryStor.history.isBoxArray[ord].glasses[gls].lamination_in_id = HistoryStor.history.isBoxArray[ord].dataLamination.img_in_id;
                 HistoryStor.history.isBoxArray[ord].glasses[gls].lamination_out_id = HistoryStor.history.isBoxArray[ord].dataLamination.img_out_id;
              }

            delete HistoryStor.history.isBoxArray[ord].dataLamination;
          }
        }    
    }
    function glasses() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
        for(ord = 0; ord < ordersQty; ord+=1) {  
          HistoryStor.history.isBoxArray[ord].glasses = [];
          var re = /\s*,\s*/,
              array = HistoryStor.history.isBoxArray[ord].glass_id.split(re);
              var arrayQty = array.length, arr;
          var glasses = [];
          var glassQty = GlobalStor.global.glassesAll.length, gqt;
          for(gqt=0;gqt<glassQty; gqt+=1) {
            var glassesQty = GlobalStor.global.glassesAll[gqt].glasses.length, gst;
            for (gst=0; gst<glassesQty; gst+=1) {
              for (arr=0; arr<arrayQty; arr+=1) {
                var glassssQty = GlobalStor.global.glassesAll[gqt].glasses[gst].length, sss;
                for (sss=0; sss<glassssQty; sss+=1) {
                  if( GlobalStor.global.glassesAll[gqt].glasses[gst][sss].id === 1*array[arr]) {
                    if (GlobalStor.global.glassesAll[gqt].profileId === HistoryStor.history.isBoxArray[ord].profile_id) {
                      glasses = GlobalStor.global.glassesAll[gqt].glasses[gst][sss];
                      HistoryStor.history.isBoxArray[ord].glasses.push(glasses)
                    }
                  }
                }
              }
            }
          }
        }
    }


    /**========== FINISH ==========*/

		thisFactory.publicObj = {
	      box:box,
        glasses: glasses,
        nameListLaminat:nameListLaminat,
        templateSource: templateSource,
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
      templateSource:templateSource;
      nameListLaminat:nameListLaminat;
      nameListGlasses:nameListGlasses;
      extendLaminat:extendLaminat;
      extendHardware:extendHardware;
      extendProfile:extendProfile;
      extendGlass:extendGlass;
      clear: clear;
  });
})();