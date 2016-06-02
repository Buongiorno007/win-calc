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
      // console.log('HistoryStor.history.isBoxArray', HistoryStor.history.isBoxArray)
      // console.log('HistoryStor.history.orders', HistoryStor.history.orders)
      // console.log('HistoryStor.history.isBoxDopElem', HistoryStor.history.isBoxDopElem)
      // console.log('HistoryStor.history.infoOrder', HistoryStor.history.infoOrder)

      var ordersQty = HistoryStor.history.isBoxArray.length, ord,
          laminatQty = GlobalStor.global.laminatCouples.length, glb,
          hardwaresQty = GlobalStor.global.hardwares.length, glbl,
          profilesQty = GlobalStor.global.profiles.length, glbp,
          glassesQty = GlobalStor.global.glassesAll.length, glbg;
          console.log(HistoryStor.history.infoOrder, '1')
      for(var u=0; u<HistoryStor.history.infoOrder.length; u+=1) {
        HistoryStor.history.information = []
        HistoryStor.history.information = angular.copy(HistoryStor.history.infoOrder[u])
      }
 

      for(ord = 0; ord < ordersQty; ord+=1) {
        if(HistoryStor.history.isBoxArray[ord].glass_id !== "") {
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
      }
      for(ord = 0; ord < ordersQty; ord +=1) {
        HistoryStor.history.isBoxArray[ord].chosenAddElements = [
          [], // 0 - grids
          [], // 1 - visors
          [], // 2 - spillways
          [], // 3 - outSlope
          [], // 4 - louvers
          [], // 5 - inSlope
          [], // 6 - connectors
          [], // 7 - fans
          [], // 8 - windowSill
          [], // 9 - handles
          [], // 10 - others
          [], // 11 - shutters 
          [], // 12 - grating 
          [], // 13 - blind 
          [], // 14 - shut 
          [], // 15 - grat 
          [], // 16 - vis 
          []  // 17 - spil 
        ];
      }
      for(ord = 0; ord < ordersQty; ord+=1) {
        if(HistoryStor.history.isBoxArray[ord].glass_id !== "") {
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
      }
       divideAddElem();
    }
    function divideAddElem() {
     /*divide into groups of additional elements*/
      var id = [20, 21, 9, 19, 26, 19, 12, 27, 8, 24, 18, 99, 9999, 999, 999, 9999],
          name = [
            'add_elements.GRIDS',
            'add_elements.VISORS',
            'add_elements.SPILLWAYS',
            'add_elements.OUTSIDE',
            'add_elements.LOUVERS',
            'add_elements.INSIDE',
            'add_elements.CONNECTORS',
            'add_elements.FAN',
            'add_elements.WINDOWSILLS',
            'add_elements.HANDLELS',
            'add_elements.OTHERS',
            'add_elements.BLIND',
            'add_elements.GRATING',
            'add_elements.SHUTTERS',
            'add_elements.SHUTTERS',
            'add_elements.GRATING'
          ];
      for (var q = 0; q<HistoryStor.history.isBoxDopElem.length; q+=1) {
        for(var i = 0; i<GlobalStor.global.addElementsAll.length; i+=1) {
          for(var d = 0; d<GlobalStor.global.addElementsAll[i].elementsList.length; d+=1) {
            for(var u = 0; u<GlobalStor.global.addElementsAll[i].elementsList[d].length; u+=1) {
              if (HistoryStor.history.isBoxDopElem[q].element_id === GlobalStor.global.addElementsAll[i].elementsList[d][u].id) {
                HistoryStor.history.isBoxDopElem[q].list_group_id = GlobalStor.global.addElementsAll[i].elementsList[d][u].list_group_id
                HistoryStor.history.isBoxDopElem[q].listAddElem = GlobalStor.global.addElementsAll[i].elementsList[d]
                HistoryStor.history.isBoxDopElem[q].selectedAddElem = GlobalStor.global.addElementsAll[i].elementsList[d][u]
                HistoryStor.history.isBoxDopElem[q].selectedWidth = HistoryStor.history.isBoxDopElem[q].element_width
                HistoryStor.history.isBoxDopElem[q].selectedHeight = HistoryStor.history.isBoxDopElem[q].element_height
                HistoryStor.history.isBoxDopElem[q].selectedQuantity = HistoryStor.history.isBoxDopElem[q].element_qty
                  break
              }
            }
          }
        }  
        for (var n=0; n<id.length; n+=1) {
          if (HistoryStor.history.isBoxDopElem[q].list_group_id === id[n]) {
            HistoryStor.history.isBoxDopElem[q].list_group_name = name[n]
            HistoryStor.history.isBoxDopElem[q].idex = n
          }
        }
      }
    }
    function extendAddElem() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      var addElem = [];
      var width = 0;
      var qty = 0;
      var ind = 0;
      var block = 0;
      HistoryStor.history.isBoxDop = [];
      for(ord = 0; ord < ordersQty; ord+=1) {
        for (var q = 0; q<HistoryStor.history.isBoxDopElem.length; q+=1) {
          if(HistoryStor.history.isBoxArray[ord].product_id === HistoryStor.history.isBoxDopElem[q].product_id) {
            width = HistoryStor.history.isBoxDopElem[q].selectedWidth || 0;
            qty = HistoryStor.history.isBoxDopElem[q].selectedQuantity;
            ind = HistoryStor.history.isBoxDopElem[q].element_type;
            block = HistoryStor.history.isBoxDopElem[q].element_type;
            addElem = HistoryStor.history.isBoxDopElem[q].selectedAddElem;
            HistoryStor.history.isBoxDop = addElem;
            HistoryStor.history.isBoxDop.element_width = 1*width;
            HistoryStor.history.isBoxDop.element_qty = 1*qty;
            HistoryStor.history.isBoxDop.block_id = block;
            HistoryStor.history.isBoxDop.element_type = ind;
            pushSelectedAddElement(HistoryStor.history.isBoxArray[ord], HistoryStor.history.isBoxDop, ind)
          }
        }
      }
    }
    function pushSelectedAddElement(currProduct, currElement, ind) {
      var index = ind,
          existedElement;
      currProduct.chosenAddElements[index].push(currElement);
      existedElement = checkExistedSelectAddElement(currProduct.chosenAddElements[index], currElement);
      if(!existedElement) {
        var newElementSource = {
              element_type: index,
              element_width: 0,
              element_height: 0,
              block_id: 0
            },
        newElement = angular.extend(newElementSource, currElement);
        currProduct.chosenAddElements[index].push(newElement);
      } 
    }
    function checkExistedSelectAddElement(elementsArr, currElement) {
      var elementsQty = elementsArr.length, isExist = 0;
      while(--elementsQty > -1){
        if(elementsArr[elementsQty].id === currElement.id) {
          /** if element has width and height */
          if(currElement.element_width && currElement.element_height) {
            if(elementsArr[elementsQty].element_width === currElement.element_width) {
              if(elementsArr[elementsQty].element_height === currElement.element_height) {
                isExist+=1;
              }
            }
          }
          /** if element has only width */
          if(currElement.element_width && !currElement.element_height) {
            if(elementsArr[elementsQty].element_width === currElement.element_width) {
              isExist+=1;
            }
          }
          /** if element has only qty */
          if(!currElement.element_width && !currElement.element_height) {
            isExist+=1;
          }
        }
      }
      return isExist;
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
        if (HistoryStor.history.isBoxArray[ord].profile_id !== "undefined") {
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
        }
        for(ord=0;ord<ordersQty; ord+=1){
          if (HistoryStor.history.isBoxArray[ord].profile_id !== "undefined") {
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
              if (HistoryStor.history.isBoxArray[ord].profile_id !== "undefined") {
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
        } else if (HistoryStor.history.isBoxArray[ord].profile_id !== 0 && HistoryStor.history.isBoxArray[ord].dataProfiles === undefined && HistoryStor.history.isBoxArray[ord].profile_id !== "undefined") {
          HistoryStor.history.errorСhecking +=1;
        }
      }    
    }
    function extendGlass() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord = 0; ord < ordersQty; ord+=1) { 
        if  (HistoryStor.history.isBoxArray[ord].glass_id !== "") {
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
        } else {
          var obj = {
            lamination_id: 0,
            lamination_in_id: 1,
            lamination_out_id: 1
            }
            obj.lamination_id =  HistoryStor.history.isBoxArray[ord].lamination_id;
            obj.lamination_in_id = HistoryStor.history.isBoxArray[ord].lamination_in_id;
            obj.lamination_out_id = HistoryStor.history.isBoxArray[ord].lamination_out_id;
            HistoryStor.history.isBoxArray[ord].lamination = [];
            HistoryStor.history.isBoxArray[ord].lamination.push(obj)
        }
      }    
    }
    function glassesForProductStor() {
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord = 0; ord < ordersQty; ord+=1) {  
        if  (HistoryStor.history.isBoxArray[ord].glass_id !== "") {
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
    }
    function errorChecking () {
      HistoryStor.history.errorСhecking = 0;
      var ordersQty = HistoryStor.history.isBoxArray.length, ord;
      for(ord=0; ord<ordersQty; ord+=1 ) {
        if(HistoryStor.history.isBoxArray[ord].glass_id !== "") {
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
    }
    function profileForAlert() {
      GlobalStor.global.continued = 0;
      HistoryStor.history.dataProfiles = [];
      var promises = HistoryStor.history.isBoxArray.map(function (item) {
        return localDB.selectLocalDB(
        localDB.tablesLocalDB.beed_profile_systems.tableName, {
          'profile_system_id': item.dataProfiles.id
        });
      });
      $q.all(promises).then(function(result) {
        HistoryStor.history.dataProfiles = angular.copy(result)
      })
    }
    function alert() {
      GlobalStor.global.nameAddElem = [];
      var name = '';
      var product = 0;
      var tr = '';
        for(var u=0; u<HistoryStor.history.isBoxDopElem.length; u+=1) {
          var obj = {
            name : '',
            product : 0,
            tr: ''
          };
          for (var y = 0; y<HistoryStor.history.dataProfiles.length; y+=1) {
            for (var r = 0; r<HistoryStor.history.dataProfiles[y].length; r+=1) {
              if (HistoryStor.history.isBoxDopElem[u].product_id === y+1) {        
                if (HistoryStor.history.isBoxDopElem[u].selectedAddElem.id === HistoryStor.history.dataProfiles[y][r].list_id) {
                  obj.tr = HistoryStor.history.isBoxDopElem[u].selectedAddElem.name;
                } else {
                  obj.name = HistoryStor.history.isBoxDopElem[u].selectedAddElem.name;
                  obj.product = HistoryStor.history.isBoxDopElem[u].product_id;
                }    
              }
            }
          }
          GlobalStor.global.nameAddElem.push(obj)
        }
        for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
          if(GlobalStor.global.nameAddElem[d].name === GlobalStor.global.nameAddElem[d].tr) {
            delete GlobalStor.global.nameAddElem[d].name;
          }
        }
        for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
          if(GlobalStor.global.nameAddElem[d].name !== undefined && GlobalStor.global.continued === 0) {
            GlobalStor.global.dangerAlert = 1;
          }
        }
    }
    /**========== FINISH ==========*/

		thisFactory.publicObj = {
      box:box,
      alert:alert,
      extendAddElem: extendAddElem,
      pushSelectedAddElement:pushSelectedAddElement,
      divideAddElem: divideAddElem,
      checkExistedSelectAddElement:checkExistedSelectAddElement,
      errorChecking: errorChecking,
      dopTemplateSource:dopTemplateSource,
      glassesForProductStor:glassesForProductStor,
      nameListLaminat:nameListLaminat,
      templateSource: templateSource,
      profileForAlert: profileForAlert,
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
      alert:alert;
      pushSelectedAddElement:pushSelectedAddElement;
      profileForAlert:profileForAlert;
      extendAddElem: extendAddElem;
      divideAddElem: divideAddElem;
      glassesForProductStor:glassesForProductStor;
      templateSource:templateSource;
      nameListLaminat:nameListLaminat;
      nameListGlasses:nameListGlasses;
      extendLaminat:extendLaminat;
      extendHardware:extendHardware;
      extendProfile:extendProfile;
      extendGlass:extendGlass;
      checkExistedSelectAddElement:checkExistedSelectAddElement;
      clear: clear;
  });
})();