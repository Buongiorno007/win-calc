(function(){
  'use strict';
    /**@ngInject*/

  angular
    .module('BauVoiceApp')
    .factory('RecOrderServ',

  function (
    $q,
    $filter,
    GlobalStor, 
    HistoryStor, 
    ProductStor,
    localDB
  ) {
	var thisFactory = this;

    /**============ METHODS ================*/
    function box() {
      //      console.log('HistoryStor.history.isBoxArray', HistoryStor.history.isBoxArray)
      //      console.log('HistoryStor.history.orders', HistoryStor.history.orders)
      var ordersQty = HistoryStor.history.isBoxArray.length, ord,
          laminatQty = GlobalStor.global.laminatCouples.length, glb,
          hardwaresQty = GlobalStor.global.hardwares.length, glbl,
          profilesQty = GlobalStor.global.profiles.length, glbp,
          glassesQty = GlobalStor.global.glassesAll.length, glbg;

      for(ord = 0; ord < ordersQty; ord+=1) {
        HistoryStor.history.isBoxArray[ord].nameGlass = [];
        if (HistoryStor.history.isBoxArray[ord].glass_id.length) {
          var re = /\s*,\s*/,
              arr = HistoryStor.history.isBoxArray[ord].glass_id.split(re);
              delete HistoryStor.history.isBoxArray[ord].glass_id;
              HistoryStor.history.isBoxArray[ord].glass_id = arr; 
          var arrQty = arr.length, tst;
          for(tst=0; tst<arrQty; tst+=1) {
            var obj = {
                  id: 0
                };
            obj.id = arr[tst];
            HistoryStor.history.isBoxArray[ord].glass_id.push(obj);
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
            obj.id = GlobalStor.global.hardwares[glbl][glbll].id;
            obj.name = GlobalStor.global.hardwares[glbl][glbll].name;
            obj.hardware = GlobalStor.global.hardwares[glbl][glbll];
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
          obj.id = GlobalStor.global.profiles[glbp][glbpp].id;
          obj.name = GlobalStor.global.profiles[glbp][glbpp].name;
          HistoryStor.history.listNameProfiles.push(obj);
          }
        }
      //================NameList for select================//

      //================add name in array==================//  
        for(glb = 0; glb < laminatQty; glb+=1) {
          for(ord = 0; ord < ordersQty; ord+=1) {
            if (GlobalStor.global.laminatCouples[glb].id === HistoryStor.history.isBoxArray[ord].lamination_id) {
              HistoryStor.history.isBoxArray[ord].nameIn = GlobalStor.global.laminatCouples[glb].laminat_in_name;
              HistoryStor.history.isBoxArray[ord].nameOut = GlobalStor.global.laminatCouples[glb].laminat_out_name;
              HistoryStor.history.isBoxArray[ord].img_in_id = GlobalStor.global.laminatCouples[glb].lamination_in_id;
              HistoryStor.history.isBoxArray[ord].img_out_id = GlobalStor.global.laminatCouples[glb].lamination_out_id;
            }
          }
        }   
        for(glbl = 0; glbl < hardwaresQty; glbl+=1) {
          var globalQtyll = GlobalStor.global.hardwares[glbl].length, glbll;
          for(glbll = 0; glbll < globalQtyll; glbll+=1) {
            for(ord = 0; ord < ordersQty; ord+=1) {
              if(GlobalStor.global.hardwares[glbl][glbll].id === HistoryStor.history.isBoxArray[ord].hardware_id) {
                 HistoryStor.history.isBoxArray[ord].nameHardware = GlobalStor.global.hardwares[glbl][glbll].name;
              }  
            }
          }
        }       
        for(ord = 0; ord < ordersQty; ord+=1) {
          var arrQty = HistoryStor.history.isBoxArray[ord].glass_id.length, tst;
            for(tst=0; tst<arrQty; tst+=1) {
              for(glbg = 0; glbg < glassesQty; glbg+=1) {
                var globalQtygg = GlobalStor.global.glassesAll[glbg].glasses.length, glbgg;
                for(glbgg = 0; glbgg < globalQtygg; glbgg+=1) { 
                  var subListQty = GlobalStor.global.glassesAll[glbg].glasses[glbgg].length, lstt;
                  for(lstt=0; lstt<subListQty; lstt+=1) {
                    var obj = {
                        name: '',
                        id: 0
                        }
                    if(HistoryStor.history.isBoxArray[ord].profile_id === GlobalStor.global.glassesAll[glbg].profileId) {
                      if (HistoryStor.history.isBoxArray[ord].glass_id[tst]) {
                        var number = HistoryStor.history.isBoxArray[ord].glass_id[tst];
                        if(number === ''+GlobalStor.global.glassesAll[glbg].glasses[glbgg][lstt].id) {    
                          obj.id = GlobalStor.global.glassesAll[glbg].glasses[glbgg][lstt].id;
                          obj.name = GlobalStor.global.glassesAll[glbg].glasses[glbgg][lstt].name;
                          HistoryStor.history.isBoxArray[ord].nameGlass.push(obj);
                        }
                      }
                    }
                  }              
                }
              }
            }
          } 
        for(glbp = 0; glbp < profilesQty; glbp+=1) {
          var globalQtypp = GlobalStor.global.profiles[glbp].length, glbpp;
          for(glbpp = 0; glbpp < globalQtypp; glbpp+=1) {
            for(ord = 0; ord < ordersQty; ord+=1) {
              if(GlobalStor.global.profiles[glbp][glbpp].id === HistoryStor.history.isBoxArray[ord].profile_id) {
                HistoryStor.history.isBoxArray[ord].nameProfiles = GlobalStor.global.profiles[glbp][glbpp].name;
              }             	
            }
          }
        }
      //================add name in array==================//   

      for(ord = 0; ord < ordersQty; ord+=1) {  
        HistoryStor.history.isBoxArray[ord].template_source = JSON.parse(HistoryStor.history.isBoxArray[ord].template_source);
      }
      clear();
    }
    function clear() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord = 0; ord < ordersQty; ord+=1) {
        var tests = HistoryStor.history.isBoxArray[ord].glass_id.length;
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
                    obj.id = GlobalStor.global.glassesAll[all].glasses[lst][lstt].id;
                    obj.name = GlobalStor.global.glassesAll[all].glasses[lst][lstt].name;
                    obj.sku = GlobalStor.global.glassesAll[all].glasses[lst][lstt].sku;
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
            if(HistoryStor.history.isBoxArray[ord].product_id === product_id) {
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
              if(HistoryStor.history.isBoxArray[ord].dataProfiles.id === GlobalStor.global.laminatCouples[glb].profile_id) {
                obj.profile_id = GlobalStor.global.laminatCouples[glb].profile_id;
                obj.id = GlobalStor.global.laminatCouples[glb].id;
                obj.nameIn = (GlobalStor.global.laminatCouples[glb].lamination_in_id > 1) ? GlobalStor.global.laminatCouples[glb].laminat_in_name : $filter('translate')(GlobalStor.global.laminatCouples[glb].laminat_in_name);
                obj.nameOut = (GlobalStor.global.laminatCouples[glb].lamination_out_id > 1) ? GlobalStor.global.laminatCouples[glb].laminat_out_name : $filter('translate')(GlobalStor.global.laminatCouples[glb].laminat_out_name);
                obj.img_in_id = GlobalStor.global.laminatCouples[glb].img_in_id;
                obj.img_out_id = GlobalStor.global.laminatCouples[glb].img_out_id;
                obj.lamination = GlobalStor.global.laminatCouples[glb];
                obj.name = obj.nameIn + '/'+obj.nameOut;
                listNameLaminat.push(obj);
                HistoryStor.history.isBoxArray[ord].listNameLaminat = listNameLaminat;
              } else if (GlobalStor.global.laminatCouples[glb].id === 0) {
                obj.profile_id = GlobalStor.global.laminatCouples[glb].profile_id;
                obj.id = GlobalStor.global.laminatCouples[glb].id;
                obj.nameIn = (GlobalStor.global.laminatCouples[glb].lamination_in_id > 1) ? GlobalStor.global.laminatCouples[glb].laminat_in_name : $filter('translate')(GlobalStor.global.laminatCouples[glb].laminat_in_name);
                obj.nameOut = (GlobalStor.global.laminatCouples[glb].lamination_out_id > 1) ? GlobalStor.global.laminatCouples[glb].laminat_out_name : $filter('translate')(GlobalStor.global.laminatCouples[glb].laminat_out_name);
                obj.img_in_id = GlobalStor.global.laminatCouples[glb].img_in_id;
                obj.img_out_id = GlobalStor.global.laminatCouples[glb].img_out_id;
                obj.lamination = GlobalStor.global.laminatCouples[glb];
                obj.name = obj.nameIn + '/'+obj.nameOut;
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
          HistoryStor.history.isBoxArrayCopy[ord].glass_id.push(obj);
          HistoryStor.history.isBoxArrayCopy[ord].n_glass_id.push(objn);

        }
          HistoryStor.history.isBoxArrayCopy[ord].glass_id.splice(0, ([subOrdersQty]/2)+1);
          HistoryStor.history.isBoxArrayCopy[ord].n_glass_id.splice(0, ([subOrdersQty]/2)+1);
      }
      for(ord=0;ord<ordersQty; ord+=1){
        var tempSourQty = HistoryStor.history.isBoxArray[ord].template_source.details.length, tsq;
        var oldGlassQty = HistoryStor.history.isBoxArrayCopy[ord].glass_id.length, ogt;
        for(ogt=0; ogt<oldGlassQty; ogt+=1) {
          for(tsq=1; tsq<tempSourQty; tsq+=1) {
            if(1*HistoryStor.history.isBoxArrayCopy[ord].glass_id[ogt].old === HistoryStor.history.isBoxArray[ord].template_source.details[tsq].glassId) {
              if( typeof HistoryStor.history.isBoxArray[ord].template_source.details[tsq].glassId === 'number') {
                HistoryStor.history.isBoxArray[ord].template_source.details[tsq].glassId = HistoryStor.history.isBoxArrayCopy[ord].n_glass_id[ogt].newId;
              }
            }
          }
        }
        for(tsq=1; tsq<tempSourQty; tsq+=1) {
          HistoryStor.history.isBoxArray[ord].template_source.details[tsq].glassId = HistoryStor.history.isBoxArray[ord].template_source.details[tsq].glassId*1;
        }
      }
      dopTemplateSource();
    }
    function dopTemplateSource() {
      var globalQty = GlobalStor.global.glassesAll.length, g;
      for (g=0; g<globalQty; g+=1) {
        var glassesQty = GlobalStor.global.glassesAll[g].glasses.length;
        for(var i=0; i<glassesQty; i+=1) {
          var firstglassesQty = GlobalStor.global.glassesAll[g].glasses[i].length;
          for (var it = 0; it<firstglassesQty; it+=1) {     
            var ordersQty = HistoryStor.history.isBoxArray.length, ord;
            for(ord = 0; ord < ordersQty; ord+=1) {    
              var templateSourceQty = HistoryStor.history.isBoxArray[ord].template_source.details.length;
              for (var b=0; b<templateSourceQty; b+=1) {
                if ( GlobalStor.global.glassesAll[g].glasses[i][it].id === HistoryStor.history.isBoxArray[ord].template_source.details[b].glassId) {
                   HistoryStor.history.isBoxArray[ord].template_source.details[b].glassTxt = GlobalStor.global.glassesAll[g].glasses[i][it].sku;
                }
              }
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
        } else if ( HistoryStor.history.isBoxArray[ord].hardware_id !== 0 && HistoryStor.history.isBoxArray[ord].dataHardware === undefined) {
          HistoryStor.history.errorСhecking +=1;
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
        } else if (HistoryStor.history.isBoxArray[ord].profile_id !== 0 && HistoryStor.history.isBoxArray[ord].dataProfiles === undefined) {
          HistoryStor.history.errorСhecking +=1;
        }
      }    
    }
    function extendGlass() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord = 0; ord < ordersQty; ord+=1) {   
          var arrayBoxQty = HistoryStor.history.isBoxArray[ord].nameGlass.length, tst;
          var glassId,
              sku,
              nameGlass;
          for (tst = 0; tst<arrayBoxQty; tst+=1) {
            if (HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass !== undefined) {
              if(tst === 0){
                glassId = HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.id;
                nameGlass = HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.name;
                sku = HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.sku;
              } 
              else {
                glassId += ', '+HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.id;
                nameGlass += ', '+HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.name;
                sku += ', '+HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass.sku;
              }
            } else if (HistoryStor.history.isBoxArray[ord].nameGlass[tst].dataGlass === undefined) {
              HistoryStor.history.errorСhecking +=1;

            }
          } 
            HistoryStor.history.isBoxArray[ord].glass_id = glassId+'';
            HistoryStor.history.isBoxArrayCopy[ord].sku = sku;
      }   
          glassesForProductStor();
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
        }
      }    
    }
    function glassesForProductStor() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord = 0; ord < ordersQty; ord+=1) {  
        HistoryStor.history.isBoxArray[ord].glasses = [];
        var sp = /\s*,\s*/;
        var array = HistoryStor.history.isBoxArray[ord].glass_id.split(sp);
        var arrayQty = array.length, arr;
        var glasses = [];
        var glassQty = GlobalStor.global.glassesAll.length, gqt;
        for (arr=0; arr<arrayQty; arr+=1) {
          for(gqt=0;gqt<glassQty; gqt+=1) {
            var glassesQty = GlobalStor.global.glassesAll[gqt].glasses.length, gst;
            for (gst=0; gst<glassesQty; gst+=1) {
              var glassssQty = GlobalStor.global.glassesAll[gqt].glasses[gst].length, sss;
              for (sss=0; sss<glassssQty; sss+=1) {
                if(1*array[arr] === GlobalStor.global.glassesAll[gqt].glasses[gst][sss].id) {
                  if (GlobalStor.global.glassesAll[gqt].profileId === HistoryStor.history.isBoxArray[ord].profile_id) {
                    glasses = GlobalStor.global.glassesAll[gqt].glasses[gst][sss];
                    HistoryStor.history.isBoxArray[ord].glasses.push(glasses);
                  }
                }
              }
            }
          }
        }
      }
    }

    function errorChecking () {
      HistoryStor.history.errorСhecking = 0;
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord=0; ord<ordersQty; ord+=1 ) {
        if (HistoryStor.history.isBoxArray[ord].dataProfiles === undefined) {
          HistoryStor.history.errorСhecking +=1;
          break
        }
        if (HistoryStor.history.isBoxArray[ord].dataHardware === undefined && HistoryStor.history.isBoxArray[ord].hardware_id !==0) {
          HistoryStor.history.errorСhecking +=1;
          break
        }
        if (HistoryStor.history.isBoxArray[ord].dataLamination === undefined) {
          HistoryStor.history.errorСhecking +=1;
          break
        }
        var nameGlassQty = HistoryStor.history.isBoxArray[ord].nameGlass.length;
        for (var i=0; i<nameGlassQty; i+=1) {
          if (HistoryStor.history.isBoxArray[ord].nameGlass[i].dataGlass === undefined) {
            HistoryStor.history.errorСhecking +=1;
            break
          }
        }
      }
    }
    /**========== FINISH ==========*/

		thisFactory.publicObj = {
      box:box,
      errorChecking: errorChecking,
      dopTemplateSource:dopTemplateSource,
      glassesForProductStor:glassesForProductStor,
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
      glassesForProductStor:glassesForProductStor;
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