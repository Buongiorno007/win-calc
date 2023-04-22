(function () {
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
        GeneralServ,
        localDB
      ) {
        var thisFactory = this;

        /**============ METHODS1 ================*/
        function box() {
          var productArray = HistoryStor.history.isBoxArray.products;
          async.eachSeries(productArray, calculate, function (err, result) {
            console.log('end', HistoryStor.history.isBoxArray);
          });

          function calculate(products, _cb) {
            async.waterfall([
              function (_callback) {
                JSON.parse(products.template_source);
                if (products.is_addelem_only === 0) {
                  if (products.glass_id !== "") {
                    products.nameGlass = [];
                    if (products.glass_id.length) {
                      var re = /\s*,\s*/,
                        arr = products.glass_id.split(re);
                      products.glass_id = [];
                      products.glass_id = angular.copy(arr);
                      var arrQty = arr.length, tst;
                    }
                  }
                  //================NameList for select================//
                  var hardwares = GlobalStor.global.hardwares;
                  for (var x = 0; x < hardwares.length; x += 1) {
                    for (var y = 0; y < hardwares[x].length; y += 1) {
                      var name,
                        id,
                        obj = {
                          name: '',
                          id: 0,
                        };
                      obj.id = GlobalStor.global.hardwares[x][y].id;
                      obj.name = GlobalStor.global.hardwares[x][y].name;
                      HistoryStor.history.listNameHardware.push(obj);
                    }
                  }
                  var profiles = GlobalStor.global.profiles;
                  for (var z = 0; z < profiles.length; z += 1) {
                    for (var r = 0; r < profiles[z].length; r += 1) {
                      obj = {
                      };
                      obj = GlobalStor.global.profiles[z][r];
                      HistoryStor.history.listNameProfiles.push(obj);
                    }
                  }
                }
                var addElementDATA = products.addElementDATA;
                var generalAddElem = GeneralServ.addElementDATA;
                for (var h = 0; h < addElementDATA.length; h += 1) {
                  if (addElementDATA[h].length > 0) {
                    for (var e = 0; e < addElementDATA[h].length; e += 1) {
                      for (var s = 0; s < generalAddElem.length; s += 1) {
                        if (addElementDATA[h][e].list_group_id === generalAddElem[s].id) {
                          addElementDATA[h][e].list_group_name = generalAddElem[s].name;
                          addElementDATA[h][e].list = [];
                        }
                      }
                    }
                  }
                }
                //================NameList for select================//

                //================add name in array==================//
                if (products.is_addelem_only === 0) {
                  var laminatCouples = GlobalStor.global.laminatCouples;
                  var lamination = {
                    id: 0,
                    laminat_in_name: 0,
                    laminat_out_name: 0,
                    lamination_in_id: 0,
                    lamination_out_id: 0,
                    img_in_id: '',
                    img_out_id: ''
                  }
                  for (var w = 0; w < laminatCouples.length; w += 1) {
                    if (laminatCouples[w].id === products.lamination_id) {
                      lamination.id = laminatCouples[w].id;
                      lamination.laminat_in_name = laminatCouples[w].laminat_in_name;
                      lamination.laminat_out_name = laminatCouples[w].laminat_out_name;
                      lamination.lamination_in_id = laminatCouples[w].lamination_in_id;
                      lamination.lamination_out_id = laminatCouples[w].lamination_out_id;
                      lamination.img_in_id = laminatCouples[w].img_in_id;
                      lamination.img_out_id = laminatCouples[w].img_out_id;
                      products.lamination = angular.copy(lamination)
                    }
                  }
                  for (var c = 0; c < hardwares.length; c += 1) {
                    for (var d = 0; d < hardwares[c].length; d += 1) {
                      if (hardwares[c][d].id === products.hardware_id) {
                        products.hardwares = hardwares[c][d];
                      }
                    }
                  }
                  var glasses = products.glass_id;
                  for (var b = 0; b < glasses.length; b += 1) {
                    var glassesAll = GlobalStor.global.glassesAll;
                    for (var f = 0; f < glassesAll.length; f += 1) {
                      for (var g = 0; g < glassesAll[f].glasses.length; g += 1) {
                        for (var k = 0; k < glassesAll[f].glasses[g].length; k += 1) {
                          var obj = {
                            name: '',
                            id: 0
                          };
                          if (products.profile_id === glassesAll[f].profileId) {
                            if (products.glass_id[b] === '' + glassesAll[f].glasses[g][k].id) {
                              obj.id = glassesAll[f].glasses[g][k].id;
                              obj.name = glassesAll[f].glasses[g][k].name;
                              products.nameGlass.push(obj);
                            }
                          }
                        }
                      }
                    }
                  }
                  for (var m = 0; m < profiles.length; m += 1) {
                    for (var t = 0; t < profiles[m].length; t += 1) {
                      if (profiles[m][t].id === products.profile_id) {
                        products.nameProfiles = profiles[m][t].name;
                      }
                    }
                  }
                }
                var addElementDATA = products.addElementDATA;
                var addElementsAll = GlobalStor.global.addElementsAll;
                for (var g = 0; g < addElementsAll.length; g += 1) {
                  for (var l = 0; l < addElementsAll[g].elementsList.length; l += 1) {
                    for (var n = 0; n < addElementsAll[g].elementsList[l].length; n += 1) {
                      for (var o = 0; o < addElementDATA.length; o += 1) {
                        for (var a = 0; a < addElementDATA[o].length; a += 1) {
                          if (addElementDATA[o][a].list_group_id === addElementsAll[g].elementsList[l][n].list_group_id)
                            addElementDATA[o][a].list.push(addElementsAll[g].elementsList[l][n])
                        }
                      }
                    }
                  }
                }

                //================add name in array==================//   

                _callback();
              },
            ],
              function (err, result) {
                if (err) {
                  //console.log('err', err)
                  return _cb(err);
                }
                _cb(null);
              });
          }
        }
        function nameListGlasses(product_id) {
          var products = HistoryStor.history.isBoxArray.products;
          var glassesAll = GlobalStor.global.glassesAll;
          var listNameGlass = [];
          for (var x = 0; x < products.length; x += 1) {
            for (var y = 0; y < glassesAll.length; y += 1) {
              if (products[x].dataProfiles) {
                if (products[x].product_id === product_id) {
                  if (products[x].dataProfiles.id === glassesAll[y].profileId) {
                    for (var w = 0; w < glassesAll[y].glasses.length; w += 1) {
                      for (var z = 0; z < glassesAll[y].glasses[w].length; z += 1) {
                        var obj = {
                          name: '',
                          id: 0,
                          sku: 0
                        };
                        obj.id = glassesAll[y].glasses[w][z];
                        obj.name = glassesAll[y].glasses[w][z].name;
                        obj.sku = glassesAll[y].glasses[w][z].sku;
                        listNameGlass.push(obj);
                        products[x].listNameGlass = angular.copy(listNameGlass);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        function nameListLaminat(product_id) {
          var products = HistoryStor.history.isBoxArray.products;
          var laminatCouples = GlobalStor.global.laminatCouples;
          var listNameLaminat = [];
          for (var x = 0; x < products.length; x += 1) {
            for (var y = 0; y < laminatCouples.length; y += 1) {
              if (products[x].dataProfiles) {
                if (products[x].product_id === product_id) {
                  var obj = {
                    name: '',
                    nameIn: '',
                    nameOut: '',
                    id: 0,
                    img_in_id: 0,
                    img_out_id: 0,
                    profile_id: 0,
                    lamination: ''
                  };
                  if (products[x].dataProfiles.id === laminatCouples[y].profile_id) {
                    obj.profile_id = laminatCouples[y].profile_id;
                    obj.id = laminatCouples[y].id;
                    obj.nameIn = (laminatCouples[y].lamination_in_id > 1) ? GlobalStor.global.laminatCouples[y].laminat_in_name : $filter('translate')(GlobalStor.global.laminatCouples[y].laminat_in_name);
                    obj.nameOut = (laminatCouples[y].lamination_out_id > 1) ? GlobalStor.global.laminatCouples[y].laminat_out_name : $filter('translate')(GlobalStor.global.laminatCouples[y].laminat_out_name);
                    obj.img_in_id = laminatCouples[y].img_in_id;
                    obj.img_out_id = laminatCouples[y].img_out_id;
                    obj.lamination = laminatCouples[y];
                    obj.name = obj.nameIn + '/' + obj.nameOut;
                    listNameLaminat.push(obj);
                    products[x].listNameLaminat = listNameLaminat;
                  } else if (laminatCouples[y].id === 0) {
                    obj.profile_id = laminatCouples[y].profile_id;
                    obj.id = laminatCouples[y].id;
                    obj.nameIn = (laminatCouples[y].lamination_in_id > 1) ? GlobalStor.global.laminatCouples[y].laminat_in_name : $filter('translate')(GlobalStor.global.laminatCouples[y].laminat_in_name);
                    obj.nameOut = (laminatCouples[y].lamination_out_id > 1) ? GlobalStor.global.laminatCouples[y].laminat_out_name : $filter('translate')(GlobalStor.global.laminatCouples[y].laminat_out_name);
                    obj.img_in_id = laminatCouples[y].img_in_id;
                    obj.img_out_id = laminatCouples[y].img_out_id;
                    obj.lamination = laminatCouples[y];
                    obj.name = obj.nameIn + '/' + obj.nameOut;
                    listNameLaminat.push(obj);
                    products[x].listNameLaminat = listNameLaminat;
                  }
                }
              }
            }
          }
        }
        /**============ METHODS1 ================*/

        /**============ METHODS2 ================*/
        function extend() {
          var info = {};
          var obj = [];
          info.customer_age = HistoryStor.history.isBoxArray.customer_age;
          info.customer_city = HistoryStor.history.isBoxArray.customer_city;
          info.customer_city_id = HistoryStor.history.isBoxArray.customer_city_id;
          info.customer_education = HistoryStor.history.isBoxArray.customer_education;
          info.customer_flat = HistoryStor.history.isBoxArray.customer_flat;
          info.customer_floor = HistoryStor.history.isBoxArray.customer_floor;
          info.customer_house = HistoryStor.history.isBoxArray.customer_house;
          info.customer_infoSource = HistoryStor.history.isBoxArray.customer_infoSource;
          info.customer_location = HistoryStor.history.isBoxArray.customer_location;
          info.customer_name = HistoryStor.history.isBoxArray.customer_name;
          info.customer_occupation = HistoryStor.history.isBoxArray.customer_occupation;
          info.customer_phone = HistoryStor.history.isBoxArray.customer_phone;
          info.customer_sex = HistoryStor.history.isBoxArray.customer_sex;
          info.discount_addelem = HistoryStor.history.isBoxArray.discount_addelem;
          info.discount_addelem_max = HistoryStor.history.isBoxArray.discount_addelem_max;
          info.discount_construct = HistoryStor.history.isBoxArray.discount_construct;
          info.discount_construct_max = HistoryStor.history.isBoxArray.discount_construct_max;
          HistoryStor.history.isBoxArray.info = angular.copy(info)

          var productArray = HistoryStor.history.isBoxArray.products;
          async.eachSeries(productArray, calculate, function (err, result) {
            console.log('end', HistoryStor.history.isBoxArray);
          });
          function calculate(products, _cb) {
            async.waterfall([
              function (_callback) {

                if (products.dataProfiles) {
                  products.profile = products.dataProfiles
                } else {
                  products.profile = ''
                }
                if (products.dataProfiles) {
                  if (products.nameGlass) {
                    products.template_source = JSON.parse(products.template_source);
                    var tempOldGlass = angular.copy(products.glass_id)
                    for (var x = 0; x < products.nameGlass.length; x += 1) {
                      products.glass_id[x] = products.nameGlass[x].dataGlass.id;
                      products.template_source.beads[x].glassId = products.nameGlass[x].dataGlass.id.id;
                      for (var b = 0; b < products.template_source.details.length; b += 1) {
                        if (products.template_source.details[b].glassId === tempOldGlass[x] * 1) {
                          products.template_source.details[b].glassId = products.nameGlass[x].dataGlass.id.id;
                          products.template_source.details[b].glassTxt = products.nameGlass[x].dataGlass.id.sku;
                          products.template_source.details[b].glass_type = products.nameGlass[x].dataGlass.id.glass_color;
                        }
                      }
                    }
                    delete products.nameGlass;
                  }
                }
                if (products.dataHardware) {
                  products.hardware_id = products.dataHardware.id
                  delete products.dataHardware;
                } else {
                  products.hardware_id = ''
                }
                if (products.dataLamination) {
                  products.lamination = angular.copy(products.dataLamination.lamination);
                  delete products.dataLamination;
                } else {
                  products.lamination = ''
                }

                for (var y = 0; y < products.addElementDATA.length; y += 1) {
                  if (products.addElementDATA[y].length > 0) {
                    for (var z = 0; z < products.addElementDATA[y].length; z += 1) {
                      products.addElementDATA[y][z].selectedAddElem.element_width = products.addElementDATA[y][z].width * 1
                      products.addElementDATA[y][z].selectedAddElem.element_qty = products.addElementDATA[y][z].qty * 1
                      products.addElementDATA[y][z].selectedAddElem.element_height = products.addElementDATA[y][z].height * 1
                      products.addElementDATA[y][z].selectedAddElem.element_type = products.addElementDATA[y][z].element_type
                      products.addElementDATA[y][z].selectedAddElem.block_id = products.addElementDATA[y][z].block_id

                      obj.push(products.addElementDATA[y][z].selectedAddElem);
                    }
                    products.addElementDATA[y] = [];
                    console.log(obj, 'obj')
                    products.addElementDATA[y] = angular.copy(obj);
                    obj = [];
                  }
                }
                _callback();
              },
            ],
              function (err, result) {
                if (err) {
                  //console.log('err', err)
                  return _cb(err);
                }
                _cb(null);
              });
          }
        }
        /**============ METHODS2 ================*/


        // function profileForAlert() {
        //   GlobalStor.global.continued = 0;
        //   HistoryStor.history.dataProfiles = [];
        //   var promises = HistoryStor.history.isBoxArray.products.map(function (item) {
        //     return localDB.selectLocalDB(
        //     localDB.tablesLocalDB.beed_profile_systems.tableName, {
        //       'profile_system_id': item.dataProfiles.id
        //     });
        //   });
        //   $q.all(promises).then(function(result) {
        //     HistoryStor.history.dataProfiles = angular.copy(result)
        //   })
        // }
        // function alert() {
        //   GlobalStor.global.nameAddElem = [];
        //   var products = HistoryStor.history.isBoxArray.products;
        //   var name = '';
        //   var product = 0;
        //   var tr = '';
        //     for(var u=0; u<products.length; u+=1) {
        //       for(var x=0; x<products[u].addElementDATA.length; x+=1) {
        //       var obj = {
        //         name : '',
        //         product : 0,
        //         tr: ''
        //       };
        //         for (var y = 0; y<HistoryStor.history.dataProfiles.length; y+=1) {
        //           for (var r = 0; r<HistoryStor.history.dataProfiles[y].length; r+=1) {
        //             if (products[u].product_id === y+1) {
        //               for(var p = 0; p<products[u].addElementDATA[x].length; p+=1) {
        //                 if (products[u].addElementDATA[x][p].selectedAddElem.id === HistoryStor.history.dataProfiles[y][r].list_id) {
        //                   obj.tr = products[u].addElementDATA[x][p].selectedAddElem.name;
        //                 } else {
        //                   obj.name = products[u].addElementDATA[x][p].selectedAddElem.name;
        //                   obj.product = products[u].product_id;
        //                 }    
        //               }
        //             }
        //           }
        //         }
        //       }
        //       GlobalStor.global.nameAddElem.push(obj)
        //     }
        //     for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
        //       if(GlobalStor.global.nameAddElem[d].name === GlobalStor.global.nameAddElem[d].tr) {
        //         delete GlobalStor.global.nameAddElem[d].name;
        //       }
        //     }
        //     for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
        //       if(GlobalStor.global.nameAddElem[d].name !== undefined && GlobalStor.global.continued === 0) {
        //         GlobalStor.global.dangerAlert = 1;
        //       }
        //     }
        // }
        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          box: box,
          extend: extend,
          // alert:alert,
          nameListLaminat: nameListLaminat,
          // profileForAlert:profileForAlert,
          nameListGlasses: nameListGlasses,
        };
        return thisFactory.publicObj;

        //------ clicking
        box: box;
        extend: extend;
        // alert:alert;
        // profileForAlert:profileForAlert;
        nameListLaminat: nameListLaminat;
        nameListGlasses: nameListGlasses;

      });
})();
