(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('MainServ',

  function(
    $location,
    $q,
    $filter,
    $timeout,
    localDB,
    GeneralServ,
    SVGServ,
    loginServ,
    optionsServ,
    AnalyticsServ,
    GlobalStor,
    OrderStor,
    ProductStor,
    UserStor,
    AuxStor,
    CartStor,
    DesignStor,
    HistoryStor
  ) {
    /*jshint validthis:true */
    var thisFactory = this;





    /**============ METHODS ================*/

    /**---------- Close Room Selector Dialog ---------*/
    function closeRoomSelectorDialog() {
      GlobalStor.global.showRoomSelectorDialog = 0;
      GlobalStor.global.selectRoom = 1;
      GlobalStor.global.configMenuTips = (GlobalStor.global.startProgramm) ? 1 : 0;
      //playSound('fly');
    }

    function setDefaultDoorConfig() {
      ProductStor.product.door_shape_id = 0;
      ProductStor.product.door_sash_shape_id = 0;
      ProductStor.product.door_handle_shape_id = 0;
      ProductStor.product.door_lock_shape_id = 0;
    }



    function setDefaultAuxParam() {
      AuxStor.aux.isWindowSchemeDialog = 0;
      AuxStor.aux.isAddElementListView = 0;
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.isAddElementListView = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AuxStor.aux.addElementGroups.length = 0;
      AuxStor.aux.searchingWord = '';
      AuxStor.aux.isGridSelectorDialog = 0;
    }

    function prepareMainPage() {
      GlobalStor.global.isNavMenu = 0;
      GlobalStor.global.isConfigMenu = 1;
      GlobalStor.global.activePanel = 0;
      setDefaultAuxParam();
      if(GlobalStor.global.startProgramm) {
        $timeout(function() {
          GlobalStor.global.showRoomSelectorDialog = 1;
        }, 2000);
       // $timeout(closeRoomSelectorDialog, 5000);
      }
    }



    function saveUserEntry() {
      $timeout(function() {
        localDB.exportUserEntrance(UserStor.userInfo.phone, UserStor.userInfo.device_code);
      }, 5000);

//TODO offline
//      ++UserStor.userInfo.entries;
//      var data = {entries: UserStor.userInfo.entries},
//          dataToSend = [
//            {
//              model: 'users',
//              rowId: UserStor.userInfo.id,
//              field: JSON.stringify(data)
//            }
//          ];
//       localDB.updateLocalDB(localDB.tablesLocalDB.user.tableName, data, {'id': UserStor.userInfo.id});
//       localDB.updateServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, dataToSend).then(function(data) {
//        if(!data) {
//          //----- if no connect with Server save in Export LocalDB
//          localDB.insertRowLocalDB(dataToSend, localDB.tablesLocalDB.export.tableName);
//        }
//      });
    }




    /**  Create Order Id and Date */

    function createOrderID() {
      var currTime = new Date().getTime().toString();
      return (UserStor.userInfo.id + '' + currTime.slice(4, currTime.length))*1;
    }

    function createOrderData() {
      var productDay;
      //----------- create order number for new project
      OrderStor.order.id = createOrderID();
      //------ set delivery day
      OrderStor.order.order_date = new Date().getTime();
      productDay = new Date(OrderStor.order.order_date).getDate() + GlobalStor.global.deliveryCoeff.standart_time;
      OrderStor.order.delivery_date = new Date().setDate(productDay);
      OrderStor.order.new_delivery_date = angular.copy(OrderStor.order.delivery_date);
    }



    function setCurrDiscounts() {
      OrderStor.order.discount_construct = angular.copy(UserStor.userInfo.discountConstr);
      OrderStor.order.discount_addelem = angular.copy(UserStor.userInfo.discountAddElem);
    }


    function setCurrTemplate() {
      ProductStor.product.construction_type = GlobalStor.global.rooms[0].group_id;
      ProductStor.product.template_id = (GlobalStor.global.rooms[0].template_id - 1);
    }






    //-------- get default json template
    function downloadAllTemplates(type) {
      var deferred = $q.defer();

      switch(type) {
        case 1:
          optionsServ.getTemplatesWindow(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_WINDOW');
              deferred.resolve(results.data.windows);
            } else {
              console.log(results);
            }
          });
          break;
        case 2:
          optionsServ.getTemplatesWindowDoor(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY_ENTER');
              deferred.resolve(results.data.windowDoor);
            } else {
              console.log(results);
            }
          });
          break;
        case 3:
          optionsServ.getTemplatesBalcony(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY');
              deferred.resolve(results.data.balconies);
            } else {
              console.log(results);
            }
          });
          break;
        case 4:
          optionsServ.getTemplatesDoor(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_DOOR');
              deferred.resolve(results.data.doors);
            } else {
              console.log(results);
            }
          });
          break;
      }
      return deferred.promise;
    }


    function fineItemById(id, list) {
      var typeQty = list.length, itemQty;
      while(--typeQty > -1) {
        itemQty = list[typeQty].length;
        while(--itemQty > -1) {
          if(list[typeQty][itemQty].id === id) {
            return list[typeQty][itemQty];
          }
        }
      }
    }


    function downloadProfileDepth(elementId) {
      var defer = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'id': elementId}).then(function(result) {
        var resultObj = {};
        if (result.length) {
          resultObj.a = result[0].a;
          resultObj.b = result[0].b;
          resultObj.c = result[0].c;
          resultObj.d = result[0].d;
        }
        defer.resolve(resultObj);
      });
      return defer.promise;
    }


    //-------- set default profile
    function setCurrentProfile(product, id) {
      var deferred = $q.defer();
      if(id) {
        product.profile = angular.copy(fineItemById(id, GlobalStor.global.profiles));
      } else {
        product.profile = angular.copy(GlobalStor.global.profiles[0][0]);
      }
      //------- set Depths
      $q.all([
        downloadProfileDepth(product.profile.rama_list_id),
        downloadProfileDepth(product.profile.rama_still_list_id),
        downloadProfileDepth(product.profile.stvorka_list_id),
        downloadProfileDepth(product.profile.impost_list_id),
        downloadProfileDepth(product.profile.shtulp_list_id)
      ]).then(function (result) {
        product.profileDepths.frameDepth = result[0];
        product.profileDepths.frameStillDepth = result[1];
        product.profileDepths.sashDepth = result[2];
        product.profileDepths.impostDepth = result[3];
        product.profileDepths.shtulpDepth = result[4];
        deferred.resolve(1);
      });
      return deferred.promise;
    }

    function doorProfile() {
      var door = []
      async.eachSeries(GlobalStor.global.doorsLaminations,calculate, function (err, result) {
        GlobalStor.global.doorsLaminations = angular.copy(door);
      });

      function calculate (product, _cb) {
          async.waterfall([
            function (_callback) {
              localDB.selectLocalDB(
                localDB.tablesLocalDB.lists.tableName, {
                  'id': product.rama_list_id}, 'parent_element_id').then(function(result) {
                  _callback(null ,result);
                });
            },
            function (result, _callback) {
              localDB.selectLocalDB(
                localDB.tablesLocalDB.elements_profile_systems.tableName, {'element_id': result[0].parent_element_id}, 'profile_system_id').then(function(result2) {
                  product.profileId = result2[0].profile_system_id;
                  door.push(product)
                  _callback(null, product.profileId);
              });     
            }
          ], function (err, result) {
            if (err) {
              return _cb(err, result);
            }
          _cb(null, result);
        });
      }
    }

    function getGlassFromTemplateBlocks(template) {
      var blocksQty = template.details.length,
          glassIds = [];
      while(--blocksQty > 0) {
        if(!template.details[blocksQty].children.length) {
          if(template.details[blocksQty].glassId) {
            glassIds.push(angular.copy(template.details[blocksQty].glassId));
          }
        }
      }
      return glassIds;
    }

    function setGlassToTemplateBlocks(type, template, glassId, glassName, blockId) {
      var blocksQty = template.details.length;
      while(--blocksQty > 0) {
        if(blockId) {
          /** set glass to template block by its Id */
          if(template.details[blocksQty].id === blockId) {
            template.details[blocksQty].glassId = glassId;
            template.details[blocksQty].glassTxt = glassName;
            template.details[blocksQty].glass_type = type;
            break;
          }
        } else {
          /** set glass to all template blocks */
          //if(!template.details[blocksQty].children.length) {
          template.details[blocksQty].glassId = glassId;
          template.details[blocksQty].glassTxt = glassName;
          template.details[blocksQty].glass_type = type;
          //}
        }
      }
    }



    function setCurrentGlass(product, id) {
      console.log(product, id, 'product, id')
      //------- cleaning glass in product
      product.glass.length = 0;
      if(id) {
        //----- get Glass Ids from template and check dublicates
        var glassIds = GeneralServ.removeDuplicates(getGlassFromTemplateBlocks(ProductStor.product.template)),
            glassIdsQty = glassIds.length;
        //------- glass filling by new elements
        while(--glassIdsQty > -1) {
          product.glass.push(fineItemById(glassIds[glassIdsQty], GlobalStor.global.glasses));
        }
      } else {
        //----- set default glass in ProductStor
        var tempGlassArr = GlobalStor.global.glassesAll.filter(function(item) {
          return item.profileId === product.profile.id;
        });
        if(tempGlassArr.length) {
          GlobalStor.global.glassTypes = angular.copy(tempGlassArr[0].glassTypes);
          GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
          product.glass.push(angular.copy(GlobalStor.global.glasses[0][0]));
          GlobalStor.global.selectGlassId = product.glass[0].id;
          GlobalStor.global.selectGlassName = product.glass[0].sku;
          /** set Glass to all template blocks without children */
          setGlassToTemplateBlocks(product.glass[0].glass_type, ProductStor.product.template_source, product.glass[0].id, product.glass[0].sku);
        }
      }
    }




    function checkSashInTemplate(template) {
      var templQty = template.details.length,
          counter = 0;
      while(--templQty > 0) {
        if(template.details[templQty].blockType === 'sash') {
          counter+=1;
          GlobalStor.global.checkSashInTemplate = counter;
        }
      }
      return counter;
    }



    function saveTemplateInProduct(templateIndex) {
      var defer = $q.defer();
      if(!GlobalStor.global.isChangedTemplate) {
        ProductStor.product.template_source = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
      }
      setCurrentGlass(ProductStor.product);
      //----- create template
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
        .then(function(result) {
          ProductStor.product.template = angular.copy(result);
          GlobalStor.global.isSashesInTemplate = checkSashInTemplate(ProductStor.product.template_source);
          //        console.log('TEMPLATE +++', ProductStor.product.template);
          //----- create template icon
          SVGServ.createSVGTemplateIcon(ProductStor.product.template_source, ProductStor.product.profileDepths)
            .then(function(result) {
              //------ show elements of room
              GlobalStor.global.isRoomElements = 1;
              ProductStor.product.templateIcon = angular.copy(result);
              defer.resolve(1);
            });
        });     
      return defer.promise;
    }


    function saveTemplateInProductForOrder(templateIndex) {
      //-----копия функции создания template для подсчета цены.
      var defer = $q.defer();
               //----- set default glass in ProductStor
        var tempGlassArr = GlobalStor.global.glassesAll.filter(function(item) {
          return item.profileId === ProductStor.product.profile.id;
        });
        if(tempGlassArr.length) {
          GlobalStor.global.glassTypes = angular.copy(tempGlassArr[0].glassTypes);
          GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
          GlobalStor.global.selectGlassId = ProductStor.product.glass[0].id;
          GlobalStor.global.selectGlassName = ProductStor.product.glass[0].sku;
        }
        ProductStor.product.template_source;
      //----- create template
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
        .then(function(result) {
          ProductStor.product.template = angular.copy(result);
          GlobalStor.global.isSashesInTemplate = checkSashInTemplate(ProductStor.product.template_source);
          //------ show elements of room
         
          //----- console.log('TEMPLATE +++', ProductStor.product.template);
          //----- create template icon
        GlobalStor.global.isRoomElements = 1;
        defer.resolve(1);
        });    
      return defer.promise;
    }



    function setCurrentHardware(product, id) {
      if(id) {
        product.hardware = fineItemById(id, GlobalStor.global.hardwares);
      } else {
        //----- set default hardware in ProductStor
        if(GlobalStor.global.isSashesInTemplate) {
          product.hardware = GlobalStor.global.hardwares[0][0];
        } else {
          product.hardware = {};
        }
      }
    }




    /** set Bead Id */
    function setBeadId(profileId, laminatId) {
      var deff = $q.defer(),
          promisBeads = ProductStor.product.glass.map(function(item) {
            var deff2 = $q.defer();
            if(item.glass_width) {
              localDB.selectLocalDB(
                localDB.tablesLocalDB.beed_profile_systems.tableName,
                {'profile_system_id': profileId, "glass_width": item.glass_width},
                'list_id'
              ).then(function(beadIds) {
                  //console.log('beadIds', beadIds);
                  var beadsQty = beadIds.length,
                      beadObj = {
                        glassId: item.id,
                        beadId: 0
                      };
                  if(beadsQty) {
                    //console.log('beads++++', beadIds);
                    //----- if beads more one
                    if(beadsQty > 1) {
                      //----- go to kits and find bead width required laminat Id
                      var pomisList = beadIds.map(function(item2) {
                        var deff3 = $q.defer();
                        localDB.selectLocalDB(
                          localDB.tablesLocalDB.lists.tableName,
                          {'id': item2.list_id},
                          'beed_lamination_id as id')
                          .then(function(lamId) {
                            //console.log('lamId++++', lamId);
                            if(lamId) {
                              if(lamId[0].id === laminatId) {
                                deff3.resolve(1);
                              } else {
                                deff3.resolve(0);
                              }
                            } else {
                              deff3.resolve(0);
                            }
                          });
                        return deff3.promise;
                      });

                      $q.all(pomisList).then(function(results) {
                        //console.log('finish++++', results);
                        var resultQty = results.length;
                        while(--resultQty > -1) {
                          if(results[resultQty]) {
                            beadObj.beadId = beadIds[resultQty].list_id;
                            deff2.resolve(beadObj);
                          }
                        }
                        if(!beadObj.beadId) {
                          console.log('Error in bead!!');
                          deff2.resolve(0);
                        }
                      });

                    } else {
                      beadObj.beadId = beadIds[0].list_id;
                      deff2.resolve(beadObj);
                    }

                  } else {
                    console.log('Error in bead!!');
                    deff2.resolve(0);
                  }
                });
            } else {
              console.log('item.glass_width === 0');
              deff2.resolve(0);
            }
            return deff2.promise;
          });

      deff.resolve($q.all(promisBeads));
      return deff.promise;
    }



    function setProductPriceTOTAL(Product) {
      var deliveryCoeff = GlobalStor.global.deliveryCoeff.percents[GlobalStor.global.deliveryCoeff.standart_time],
          priceDis = GeneralServ.setPriceDis(Product.template_price, OrderStor.order.discount_construct);
      //playSound('price');
      Product.product_price = GeneralServ.roundingValue( Product.template_price + Product.addelem_price );
      Product.productPriceDis = (priceDis + Product.addelemPriceDis);
      //------ add Discount of standart delivery day of Plant
      if(deliveryCoeff) {
        Product.productPriceDis = GeneralServ.setPriceDis(Product.productPriceDis, deliveryCoeff);
      }
      GlobalStor.global.isLoader = 0;
    }





    //---------- Price define
    function calculationPrice(obj) {
      var deferred = $q.defer();
      localDB.calculationPrice(obj).then(function (result) {
        var priceObj = angular.copy(result),
            priceMargin;
        if(priceObj.priceTotal) {
          /** DOOR add handle and lock Ids */
          if(ProductStor.product.construction_type === 4) {
            localDB.calcDoorElemPrice(ProductStor.product.doorHandle, ProductStor.product.doorLock.elem)
              .then(function(doorResult) {
                //console.log(doorResult, 'doorResult')
                var doorData = angular.copy(doorResult);
                priceObj.priceTotal += doorData.priceTot;
                priceObj.constrElements = priceObj.constrElements.concat(doorData.elements);
                priceMargin = GeneralServ.addMarginToPrice(priceObj.priceTotal, GlobalStor.global.margins.coeff);
                ProductStor.product.template_price = GeneralServ.roundingValue(priceMargin, 2);
                setProductPriceTOTAL(ProductStor.product);
                deferred.resolve(priceObj);
              });
          } else {
            priceMargin = GeneralServ.addMarginToPrice(priceObj.priceTotal, GlobalStor.global.margins.coeff);
            ProductStor.product.template_price = GeneralServ.roundingValue(priceMargin, 2);
            setProductPriceTOTAL(ProductStor.product);
            deferred.resolve(priceObj);
          }

        } else {
          ProductStor.product.template_price = 0;
          deferred.resolve(0);
        }
      });
      return deferred.promise;
    }



    function prepareReport(elementList) {
      var report = [],
          elementListQty = elementList.length,
          ind, tempObj, reportQty, exist, priceMarg;
      if(elementListQty) {
        for (ind = 0; ind < elementListQty; ind+=1) {
          tempObj = angular.copy(elementList[ind]);
          tempObj.element_id = angular.copy(tempObj.id);
          tempObj.amount = angular.copy(tempObj.qty);
          delete tempObj.id;
          delete tempObj.amendment_pruninng;
          delete tempObj.currency_id;
          delete tempObj.qty;
          delete tempObj.waste;
          if (ind) {
            reportQty = report.length;
            exist = 0;
            if (reportQty) {
              while (--reportQty > -1) {
                if (report[reportQty].element_id === tempObj.element_id && report[reportQty].size === tempObj.size) {
                  exist++;
                  report[reportQty].amount += tempObj.amount;
                  report[reportQty].priceReal += tempObj.priceReal;
                }
              }
              if (!exist) {
                report.push(tempObj);
              }
            }
          } else {
            report.push(tempObj);
          }
        }
        //------ add margins to price of every elements
        reportQty = report.length;
        while(--reportQty > -1) {
          report[reportQty].amount = GeneralServ.roundingValue(report[reportQty].amount, 3);
          priceMarg = GeneralServ.addMarginToPrice(report[reportQty].priceReal, GlobalStor.global.margins.coeff);
          report[reportQty].priceReal = GeneralServ.roundingValue(priceMarg, 2);
        }
      }
      return report;
    }



    //---------- Coeffs define
    function calculateCoeffs(objXFormedPrice) {
      var glassSqT = 0,
          glassSizeQty = objXFormedPrice.sizes[5].length,
          glassQty = ProductStor.product.glass.length,
          glassHeatCT = 0,
          profHeatCT = 0,
          heatCoeffTotal = 0,
          g;

      /** working with glasses */
      while(--glassSizeQty > -1) {
        /** culculate glass Heat Coeff Total */
        for(g = 0; g < glassQty; g+=1) {
          if(objXFormedPrice.sizes[5][glassSizeQty].elemId == ProductStor.product.glass[g].id) {
            //$.isNumeric
            if(!angular.isNumber(ProductStor.product.glass[g].transcalency)){
              ProductStor.product.glass[g].transcalency = 1;
            }
            glassHeatCT += objXFormedPrice.sizes[5][glassSizeQty].square/ProductStor.product.glass[g].transcalency; //Sglasses
          }
        }
        /** get total glasses square */
        glassSqT += objXFormedPrice.sizes[5][glassSizeQty].square; //Sстекломакетов
      }
      glassHeatCT = GeneralServ.roundingValue(glassHeatCT);
      glassSqT = GeneralServ.roundingValue(glassSqT, 3);

      /** culculate profile Heat Coeff Total */
      if(!angular.isNumber(ProductStor.product.profile.heat_coeff_value)) {
        ProductStor.product.profile.heat_coeff_value = 1;
      }
      profHeatCT = (ProductStor.product.template_square - glassSqT)/ProductStor.product.profile.heat_coeff_value;

      heatCoeffTotal = profHeatCT + glassHeatCT;
      /** calculate Heat Coeff Total */
      if(UserStor.userInfo.therm_coeff_id) {
        /** R */
        ProductStor.product.heat_coef_total = GeneralServ.roundingValue(
          ProductStor.product.template_square/heatCoeffTotal
        );
      } else {
        /** U */
        ProductStor.product.heat_coef_total = GeneralServ.roundingValue(
          ProductStor.product.template_square/heatCoeffTotal
        );
      }

    }





    /**--------- create object for price calculation ----------*/

    function preparePrice(template, profileId, glassIds, hardwareId, laminatId) {   
      try {
        var deferred = $q.defer();
        GlobalStor.global.isLoader = 1;
        setBeadId(profileId, laminatId).then(function(beadResult) {
          console.info(beadResult, 'beadResult')
          if(beadResult.length && beadResult[0]) {
            var beadIds = GeneralServ.removeDuplicates(angular.copy(beadResult).map(function (item) {
              console.info(item, 'item')
              var beadQty = template.priceElements.beadsSize.length;
              while (--beadQty > -1) {
                if (template.priceElements.beadsSize[beadQty].glassId === item.glassId) {
                  template.priceElements.beadsSize[beadQty].elemId = item.beadId;
                }
              }
              return item.beadId;
            })), objXFormedPrice = {
              laminationId: laminatId,
              ids: [
                ProductStor.product.profile.rama_list_id,
                ProductStor.product.profile.rama_still_list_id,
                ProductStor.product.profile.stvorka_list_id,
                ProductStor.product.profile.impost_list_id,
                ProductStor.product.profile.shtulp_list_id,
                (glassIds.length > 1) ? glassIds.map(function (item) {
                  return item.id;
                }) : glassIds[0].id,
                (beadIds.length > 1) ? beadIds : beadIds[0],
                (ProductStor.product.construction_type === 4) ? 0 : hardwareId
              ],
              sizes: []
            };
            console.info(objXFormedPrice, 'objXFormedPrice')
            //-------- beads data for analysis
            ProductStor.product.beadsData = angular.copy(template.priceElements.beadsSize);
            //------- fill objXFormedPrice for sizes
            for (var size in template.priceElements) {
              /** for door elements */
              objXFormedPrice.sizes.push(angular.copy(template.priceElements[size]));
            }

            //------- set Overall Dimensions
            ProductStor.product.template_width = 0;
            ProductStor.product.template_height = 0;
            ProductStor.product.template_square = 0;
            var overallQty = ProductStor.product.template.details[0].overallDim.length;
            while (--overallQty > -1) {
              ProductStor.product.template_width += ProductStor.product.template.details[0].overallDim[overallQty].w;
              ProductStor.product.template_height += ProductStor.product.template.details[0].overallDim[overallQty].h;
              ProductStor.product.template_square +=ProductStor.product.template.details[0].overallDim[overallQty].square;
            }

            //        console.warn(ProductStor.product.template_width, ProductStor.product.template_height);
            //        console.log('objXFormedPrice+++++++', JSON.stringify(objXFormedPrice));

            //console.log('START PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());

            //--------- get product price
            calculationPrice(objXFormedPrice).then(function (result) {
              deferred.resolve(1);
              /** set Report */
              if (result) {
                //---- only for this type of user
                if (UserStor.userInfo.user_type === 5 || UserStor.userInfo.user_type === 7) {
                  ProductStor.product.report = prepareReport(result.constrElements);
                  //console.log('REPORT', ProductStor.product.report);
                  //console.timeEnd('price');
                }
              }
            });

            /** calculate coeffs */
            calculateCoeffs(objXFormedPrice);

            /** save analytics data first time */
            if (GlobalStor.global.startProgramm) {
              //AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id,
              // ProductStor.product.template_id, ProductStor.product.profile.id, 1);
              /** send analytics data to Server*/
                //------ profile
              $timeout(function () {
                AnalyticsServ.sendAnalyticsData(
                  UserStor.userInfo.id,
                  OrderStor.order.id,
                  ProductStor.product.template_id,
                  ProductStor.product.profile.id,
                  1);
              }, 5000);
            }
          } else {
            deferred.resolve(1);
          }
        });
        return deferred.promise;
      } catch(e) {
        console.info(OrderStor.order, 'order');
        console.info(ProductStor.product, 'product');
        console.log(e, 'e');
      }
    }




    function parseTemplate() {
      var deferred = $q.defer();
      //------- set current template for product
      saveTemplateInProduct(ProductStor.product.template_id).then(function() {
        setCurrentHardware(ProductStor.product);
        var hardwareIds = ProductStor.product.hardware.id || 0;
        preparePrice(
          ProductStor.product.template,
          ProductStor.product.profile.id,
          ProductStor.product.glass,
          hardwareIds,
          ProductStor.product.lamination.lamination_in_id
        ).then(function() {
          deferred.resolve(1);
        });
      });
      return deferred.promise;
    }



    function prepareTemplates(type) {
      var deferred = $q.defer();
      downloadAllTemplates(type).then(function(data) {
        if(data) {
          GlobalStor.global.templatesSourceSTORE = angular.copy(data);
          GlobalStor.global.templatesSource = angular.copy(data);

          //--------- set current profile in ProductStor
          setCurrentProfile(ProductStor.product).then(function(){
            parseTemplate().then(function() {
              deferred.resolve(1);
            });
          });
        } else {
          deferred.resolve(0);
        }
      });
      return deferred.promise;
    }









    /**-------- filtering Lamination Groupes -----------*/


    function checkLamGroupExist(lamId) {
      var lamQty = GlobalStor.global.lamGroupFiltered.length,
          noExist = 1;
      while(--lamQty > -1) {
        if(GlobalStor.global.lamGroupFiltered[lamQty].id === lamId) {
          noExist = 0;
        }
      }
      return noExist;
    }

    function laminationDoor() {
      var coupleQty = GlobalStor.global.doorsLaminations.length,
              laminatQty = GlobalStor.global.laminats.length,
              lam;
      while(--coupleQty > -1) {
        for(lam = 0; lam < laminatQty; lam+=1) {
          if(GlobalStor.global.laminats[lam].id === GlobalStor.global.doorsLaminations[coupleQty].lamination_in) {
            GlobalStor.global.doorsLaminations[coupleQty].laminat_in_name = GlobalStor.global.laminats[lam].name;
            GlobalStor.global.doorsLaminations[coupleQty].img_in_id = GlobalStor.global.laminats[lam].type_id;
            GlobalStor.global.doorsLaminations[coupleQty].lamination_in_id = GlobalStor.global.doorsLaminations[coupleQty].lamination_in;
            delete GlobalStor.global.doorsLaminations[coupleQty].lamination_in;
          }
          if(GlobalStor.global.laminats[lam].id === GlobalStor.global.doorsLaminations[coupleQty].lamination_out){
            GlobalStor.global.doorsLaminations[coupleQty].laminat_out_name = GlobalStor.global.laminats[lam].name;
            GlobalStor.global.doorsLaminations[coupleQty].img_out_id = GlobalStor.global.laminats[lam].type_id;
            GlobalStor.global.doorsLaminations[coupleQty].lamination_out_id = GlobalStor.global.doorsLaminations[coupleQty].lamination_out;
            delete GlobalStor.global.doorsLaminations[coupleQty].lamination_out;
          }
        }
      }
    }


    function laminatFiltering() {
      if(ProductStor.product.construction_type !== 4) {
        var laminatQty = GlobalStor.global.laminats.length,
          /** sort by Profile */
          lamGroupsTemp = GlobalStor.global.laminatCouples.filter(function(item) {
            if(item.profile_id) {
              return item.profile_id === ProductStor.product.profile.id;
            } else {
              return true;
            }
          }),
          lamGroupsTempQty, isAnyActive = 0;

      //console.info('filter _____ ', lamGroupsTemp);
      } else {
        var laminatQty = GlobalStor.global.laminats.length,
          /** sort by Profile */
          lamGroupsTemp = GlobalStor.global.doorsLaminations.filter(function(item) {
              return item.group_id === GlobalStor.global.type_door || GlobalStor.global.doorsGroups[0].id;
          }),
          lamGroupsTempQty, isAnyActive = 0;
          for(var a=0; a<lamGroupsTemp.length; a+=1) {
            lamGroupsTemp[a].rama_still_list_id = lamGroupsTemp[a].door_sill_list_id;
          }
      }
      GlobalStor.global.lamGroupFiltered.length = 0;

      while(--laminatQty > -1) {
        if(GlobalStor.global.laminats[laminatQty].isActive) {
          isAnyActive = 1;
          lamGroupsTempQty = lamGroupsTemp.length;
          while(--lamGroupsTempQty > -1) {
            if(lamGroupsTemp[lamGroupsTempQty].img_in_id === GlobalStor.global.laminats[laminatQty].type_id) {
              if(checkLamGroupExist(lamGroupsTemp[lamGroupsTempQty].id)) {
                GlobalStor.global.lamGroupFiltered.push(lamGroupsTemp[lamGroupsTempQty]);
              }
            } else if(lamGroupsTemp[lamGroupsTempQty].img_out_id === GlobalStor.global.laminats[laminatQty].type_id) {
              if(checkLamGroupExist(lamGroupsTemp[lamGroupsTempQty].id)) {
                GlobalStor.global.lamGroupFiltered.push(lamGroupsTemp[lamGroupsTempQty]);
              }
            }
          }
        }
      }
      //console.info('lamGroupFiltered _____ ', GlobalStor.global.lamGroupFiltered);
      if(!GlobalStor.global.lamGroupFiltered.length) {
        if(!isAnyActive) {
          GlobalStor.global.lamGroupFiltered = lamGroupsTemp;
        }
      }
    }


    /**-------- set Lamination in product -----------*/


    function cleanLamFilter() {
      var laminatQty = GlobalStor.global.laminats.length;
      //---- deselect filter
      while(--laminatQty > -1) {
        GlobalStor.global.laminats[laminatQty].isActive = 0;
      }
    }



    function setCurrLamination(product, newLamId) {
      var selectedLam = [];
      if (ProductStor.product.construction_type !== 4) {
        selectedLam = angular.copy(GlobalStor.global.laminatCouples)
      } else {
        selectedLam = angular.copy(GlobalStor.global.doorsLaminations)
      }
      var laminatGroupQty = selectedLam.length;
      //---- clean filter
      cleanLamFilter();
      while(--laminatGroupQty > -1) {
        if(newLamId) {
          //------ set lamination Couple with color
          if(selectedLam[laminatGroupQty].id === newLamId) {
            product.lamination = selectedLam[laminatGroupQty];
          }
        } else {
          //----- set white lamination Couple
          if(!selectedLam[laminatGroupQty].id) {
            product.lamination = selectedLam[laminatGroupQty];
          }
        }
      }
    }





    function setProfileByLaminat(lamId) {
      var deff = $q.defer();
      if(lamId) {
        //------ set profiles parameters
        ProductStor.product.profile.rama_list_id = ProductStor.product.lamination.rama_list_id;
        ProductStor.product.profile.rama_still_list_id = ProductStor.product.lamination.rama_still_list_id;
        ProductStor.product.profile.stvorka_list_id = ProductStor.product.lamination.stvorka_list_id;
        ProductStor.product.profile.impost_list_id = ProductStor.product.lamination.impost_list_id;
        ProductStor.product.profile.shtulp_list_id = ProductStor.product.lamination.shtulp_list_id;
      } 
      //------- set Depths
      $q.all([
        downloadProfileDepth(ProductStor.product.profile.rama_list_id),
        downloadProfileDepth(ProductStor.product.profile.rama_still_list_id),
        downloadProfileDepth(ProductStor.product.profile.stvorka_list_id),
        downloadProfileDepth(ProductStor.product.profile.impost_list_id),
        downloadProfileDepth(ProductStor.product.profile.shtulp_list_id)
      ]).then(function (result) {
        ProductStor.product.profileDepths.frameDepth = result[0];
        ProductStor.product.profileDepths.frameStillDepth = result[1];
        ProductStor.product.profileDepths.sashDepth = result[2];
        ProductStor.product.profileDepths.impostDepth = result[3];
        ProductStor.product.profileDepths.shtulpDepth = result[4];

        SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
          .then(function(result) {
            ProductStor.product.template = angular.copy(result);
            var hardwareIds = ProductStor.product.hardware.id || 0;
            preparePrice(
              ProductStor.product.template,
              ProductStor.product.profile.id,
              ProductStor.product.glass,
              hardwareIds,
              ProductStor.product.lamination.lamination_in_id
            ).then(function() {
              deff.resolve(1);
            });
            //----- create template icon
            SVGServ.createSVGTemplateIcon(ProductStor.product.template_source, ProductStor.product.profileDepths)
              .then(function(result) {
                ProductStor.product.templateIcon = angular.copy(result);
              });
          });

      });
      return deff.promise;
    }




    /**----------- Glass sizes checking -------------*/

    function checkGlassSizes(template) {
      var blocks = template.details,
          blocksQty = blocks.length,
          wranGlass, overallGlass,
          currWidth, currHeight, currSquare,
          isWidthError, isHeightError, b;

      /** clean extra Glass */
      DesignStor.design.extraGlass.length = 0;

      /** glass loop */
      ProductStor.product.glass.forEach(function(item) {
        //item.max_sq = 0.2;
        //item.max_width = 0.50;
        //item.max_height = 0.50;
        /** check available max_sq and max/min sizes */
        if(item.max_sq || (item.max_width && item.max_height && item.min_width && item.min_height)) {
          /** template loop */
          for (b = 1; b < blocksQty; b += 1) {
            isWidthError = 0;
            isHeightError = 0;
            if (blocks[b].glassId === item.id) {
              if (blocks[b].glassPoints) {
                if (blocks[b].glassPoints.length) {

                  /** estimate current glass sizes */
                  overallGlass = GeneralServ.getMaxMinCoord(blocks[b].glassPoints);
                  currWidth = Math.round(overallGlass.maxX - overallGlass.minX);
                  currHeight = Math.round(overallGlass.maxY - overallGlass.minY);
                  currSquare = GeneralServ.roundingValue((currWidth * currHeight/1000000), 3);
                  /** square incorrect */
                  if (currSquare > item.max_sq) {
                    wranGlass = $filter('translate')('design.GLASS') +
                      ' ' + item.name + ' ' +
                      $filter('translate')('design.GLASS_SQUARE') +
                      ' ' + currSquare + ' ' +
                      $filter('translate')('design.MAX_VALUE_HIGHER') +
                      ' ' + item.max_sq + ' ' +
                      $filter('translate')('common_words.LETTER_M') + '2.';

                    DesignStor.design.extraGlass.push(wranGlass);
                  }

                  if (currWidth > item.max_width || currWidth < item.min_width) {
                    isWidthError = 1;
                  }
                  if(currHeight > item.max_height || currHeight < item.min_height) {
                    isHeightError = 1;
                  }

                  if(isWidthError && isHeightError) {
                    /** width and height incorrect */
                    wranGlass = $filter('translate')('design.GLASS') +
                      ' ' + item.name + ' ' +
                      $filter('translate')('design.GLASS_SIZE') +
                      ' ' + currWidth + ' x ' + currHeight + ' ' +
                      $filter('translate')('design.NO_MATCH_RANGE') + ' ' + $filter('translate')('design.BY_WIDTH') +
                      ' ' + item.min_width + ' - ' + item.max_width + ', ' +
                      $filter('translate')('design.BY_HEIGHT') +
                      ' ' + item.min_height + ' - ' + item.max_height + '.';

                    DesignStor.design.extraGlass.push(wranGlass);
                  } else if(isWidthError && !isHeightError) {
                    /** width incorrect */
                    wranGlass = $filter('translate')('design.GLASS') +
                      ' ' + item.name + ' ' +
                      $filter('translate')('design.GLASS_SIZE') +
                      ' ' + currWidth + ' x ' + currHeight + ' ' +
                      $filter('translate')('design.NO_MATCH_RANGE') + ' ' + $filter('translate')('design.BY_WIDTH') +
                      ' ' + item.min_width + ' - ' + item.max_width + '.';

                    DesignStor.design.extraGlass.push(wranGlass);
                  } else if(!isWidthError && isHeightError) {
                    /** height incorrect */
                    wranGlass = $filter('translate')('design.GLASS') +
                      ' ' + item.name + ' ' +
                      $filter('translate')('design.GLASS_SIZE') +
                      ' ' + currWidth + ' x ' + currHeight + ' ' +
                      $filter('translate')('design.NO_MATCH_RANGE') + ' ' + $filter('translate')('design.BY_HEIGHT') +
                      ' ' + item.min_height + ' - ' + item.max_height + '.';

                    DesignStor.design.extraGlass.push(wranGlass);
                  }

                }
              }
            }
          }
        }
      });
//console.info('glass result', DesignStor.design.extraGlass);
    }



    /**----------- Hardware sizes checking -------------*/

    function checkHardwareSizes(template, harwareID) {
      if(ProductStor.product.construction_type !== 4) {
        var blocks = template.details,
            blocksQty = blocks.length,
            harwareId = harwareID || ProductStor.product.hardware.id,
            limits = GlobalStor.global.hardwareLimits.filter(function(item) {
              return  item.group_id === harwareId;
            }),
            limitsQty = limits.length,
            currLimit = 0,
            overallSize, currWidth, currHeight,
            wranSash, isSizeError, b, lim;

        //console.info('*******', harwareId, GlobalStor.global.hardwareLimits, limits);
        /** clean extra Hardware */
        DesignStor.design.extraHardware.length = 0;

        if(limitsQty) {
          /** template loop */
          for (b = 1; b < blocksQty; b += 1) {
            isSizeError = 0;
            if (blocks[b].blockType === 'sash') {
              /** finde limit for current sash */
              for (lim = 0; lim < limitsQty; lim += 1) {
                if (limits[lim].type_id === blocks[b].sashType) {
                  /** check available max/min sizes */
                  if (limits[lim].max_width && limits[lim].max_height && limits[lim].min_width && limits[lim].min_height){
                    currLimit = limits[lim];
                  }
                  break;
                }
              }
              if (currLimit) {
                if (blocks[b].hardwarePoints.length) {
                  /** estimate current sash sizes */
                  overallSize = GeneralServ.getMaxMinCoord(blocks[b].hardwarePoints);
                  currWidth = Math.round(overallSize.maxX - overallSize.minX);
                  currHeight = Math.round(overallSize.maxY - overallSize.minY);
                  if (currWidth > currLimit.max_width || currWidth < currLimit.min_width) {
                    isSizeError = 1;
                  }
                  if (currHeight > currLimit.max_height || currHeight < currLimit.min_height) {
                    isSizeError = 1;
                  }

                  if (isSizeError) {
                    wranSash = currWidth + ' x ' + currHeight + ' ' +
                      $filter('translate')('design.NO_MATCH_RANGE') +
                      ' (' + currLimit.min_width + ' - ' + currLimit.max_width + ') ' +
                      'x (' + currLimit.min_height + ' - ' + currLimit.max_height + ')';

                    DesignStor.design.extraHardware.push(wranSash);
                  }

                }
              }
            }
          }
        }
      }
        //console.info('glass result', DesignStor.design.extraHardware);
    }



    /**-------------- show Info Box of element or group ------------*/

    function showInfoBox(id, itemArr) {
      if(GlobalStor.global.isInfoBox !== id) {
                // console.info(id, itemArr);
        var itemArrQty = itemArr.length,
            tempObj = {};
        while(--itemArrQty > -1) {
          if(itemArr[itemArrQty].lamination_type_id) {
            if(itemArr[itemArrQty].lamination_type_id === id) {
              tempObj = itemArr[itemArrQty];
            }
          } else {
            if(itemArr[itemArrQty].id === id) {
              tempObj = itemArr[itemArrQty];
            }
          }
        }
        if(!$.isEmptyObject(tempObj)) {
          GlobalStor.global.infoTitle = tempObj.name;
          GlobalStor.global.infoImg = tempObj.img;
          GlobalStor.global.infoLink = tempObj.link;
          GlobalStor.global.infoDescrip = tempObj.description;
          GlobalStor.global.isInfoBox = id;
        }
      }

    }


    /**========== CREATE ORDER ==========*/

    function createNewProject() {
      //----- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
      //------- set new orderId
      createOrderData();
      //------- set current Discounts
      setCurrDiscounts();
      GlobalStor.global.isChangedTemplate = 0;
      GlobalStor.global.isShowCommentBlock = 0;
      GlobalStor.global.isCreatedNewProject = 1;
      GlobalStor.global.isCreatedNewProduct = 1;
      //------- set new templates
      setCurrTemplate();
      prepareTemplates(ProductStor.product.construction_type).then(function() {
        GlobalStor.global.isLoader = 0;
        prepareMainPage();
        /** start lamination filtering */
        cleanLamFilter();
        laminatFiltering();
        if(GlobalStor.global.currOpenPage !== 'main') {
          GlobalStor.global.showRoomSelectorDialog = 0;
          $location.path('/main');
          $timeout(function() {
            GlobalStor.global.showRoomSelectorDialog = 1;
          }, 1000);
        }
      });
    }






    /**========== CREATE PRODUCT ==========*/

    function createNewProduct() {
      //------- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
      GlobalStor.global.isCreatedNewProduct = 1;
      GlobalStor.global.isChangedTemplate = 0;
      //------- set new templates
      setCurrTemplate();
      prepareTemplates(ProductStor.product.construction_type).then(function() {
        prepareMainPage();
        /** start lamination filtering */
        cleanLamFilter();
        laminatFiltering();
        if(GlobalStor.global.currOpenPage !== 'main') {
          GlobalStor.global.showRoomSelectorDialog = 0;
          $location.path('/main');
          $timeout(function() {
            GlobalStor.global.showRoomSelectorDialog = 1;
          }, 1000);
        }
      });
    }





    /**========== SAVE PRODUCT ==========*/

    function checkEmptyChoosenAddElems() {
      var addElemQty = ProductStor.product.chosenAddElements.length,
          isExist = 0;

      while(--addElemQty > -1) {
        if(ProductStor.product.chosenAddElements[addElemQty].length) {
          isExist++;
        }
      }
      return isExist;
    }


    //-------- Save Product in Order and go to Cart
    function inputProductInOrder() {
      var permission = 1;
      //------- if AddElems only, check is there selected AddElems
      if(ProductStor.product.is_addelem_only) {
        permission = checkEmptyChoosenAddElems();
      }

      if(permission) {
        //console.info('product-----', ProductStor.product);
        GlobalStor.global.tempAddElements.length = 0;
        GlobalStor.global.configMenuTips = 0;
        GlobalStor.global.isShowCommentBlock = 0;
        setDefaultAuxParam();

        /**============ EDIT Product =======*/
        if (GlobalStor.global.productEditNumber) {
          var productsQty = OrderStor.order.products.length;
          //-------- replace product in order
          while (--productsQty > -1) {
            if (OrderStor.order.products[productsQty].product_id === GlobalStor.global.productEditNumber) {
              OrderStor.order.products[productsQty] = angular.copy(ProductStor.product);
            }
          }

          /**========== if New Product =========*/
        } else {
    ProductStor.product.product_id = (OrderStor.order.products.length > 0) ? (OrderStor.order.products.length + 1) : 1;
          delete ProductStor.product.template;
          //-------- insert product in order
          OrderStor.order.products.push(ProductStor.product);
        }
        //----- finish working with product
        GlobalStor.global.isCreatedNewProduct = 0;
        GeneralServ.stopStartProg();
      }
      return permission;
    }




    //--------- moving to Cart when click on Cart button
    function goToCart() {
      $timeout(function() {
        //------- set previos Page
        GeneralServ.setPreviosPage();

        $location.path('/cart');
      }, 100);
    }





    /** ========== SAVE ORDER ==========*/

    //-------- delete order from LocalDB
    function deleteOrderInDB(orderNum) {
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.orders.tableName, {'id': orderNum});
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_id': orderNum});
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_id': orderNum});
    }


 //-------- save Order into Local DB
    function saveOrderInDB(newOptions, orderType, orderStyle) {
    var deferred = $q.defer();
      angular.extend(OrderStor.order, newOptions);
      if(OrderStor.order.order_edit === 1) {
        localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_id': OrderStor.order.id});
        localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_id': OrderStor.order.id});
        localDB.deleteProductServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, OrderStor.order.id, localDB.tablesLocalDB.order_products.tableName).then(function(def1) {
          console.info('delete old products', def1);
          localDB.deleteProductServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, OrderStor.order.id, localDB.tablesLocalDB.order_addelements.tableName).then(function(def2) {
            console.info('delete old addElem', def2);
            save().then(function(res) {
              console.info('result edit order', res);
              deferred.resolve(1);
            });
          });
        }); 
        
      } else {
        save().then(function(res) {
          console.info('result save order', res);
          deferred.resolve(1);
        })
      }

      /** ===== SAVE PRODUCTS =====*/
      function save() {
        var defer = $q.defer();
        var prodQty = OrderStor.order.products.length, p;
        OrderStor.order.products_qty = 0;
        for(p = 0; p < prodQty; p+=1) {
          var productData = angular.copy(OrderStor.order.products[p]);    
          productData.order_id = OrderStor.order.id;
          if(!productData.is_addelem_only) {
            productData.template_source['beads'] = angular.copy(productData.beadsData);
          }
          productData.template_source = JSON.stringify(productData.template_source);
          if(productData.construction_type === 4) {
            productData.door_group_id = OrderStor.order.products[p].template_source.profile_door_id;
            productData.profile_id = 0;
          } else {
            productData.profile_id = OrderStor.order.products[p].profile.id;
            (productData.door_group_id) ? productData.door_group_id = 0: productData.door_group_id = 0; 
          }  
          productData.glass_id = OrderStor.order.products[p].glass.map(function(item) {
            return item.id;
          }).join(', ');
          if (OrderStor.order.products[p].construction_type !==4 && OrderStor.order.products[p].hardware === undefined && GlobalStor.global.currOpenPage === 'history') {
            productData.hardware_id = 0;
          } else if(OrderStor.order.products[p].construction_type ===4){
            productData.hardware_id = OrderStor.order.products[p].doorLock.id;
          } else {
            productData.hardware_id = OrderStor.order.products[p].hardware.id || 0;
          }
          productData.lamination_id = OrderStor.order.products[p].lamination.id;
          productData.lamination_in_id = OrderStor.order.products[p].lamination.img_in_id;
          productData.lamination_out_id = OrderStor.order.products[p].lamination.img_out_id;
          productData.modified = new Date();
          if(productData.template) {
            delete productData.template;
          }
          delete productData.templateIcon;
          delete productData.profile;
          delete productData.glass;
          delete productData.hardware;
          delete productData.lamination;
          delete productData.chosenAddElements;
          delete productData.profileDepths;
          delete productData.addelemPriceDis;
          delete productData.productPriceDis;
          delete productData.report;
          delete productData.beadsData;
          delete productData.doorName;
          delete productData.doorSashName;
          delete productData.doorHandle;
          delete productData.doorLock;

          /** culculate products quantity for order */
          OrderStor.order.products_qty += OrderStor.order.products[p].product_qty;


          if(orderType) {
            localDB.insertRowLocalDB(productData, localDB.tablesLocalDB.order_products.tableName);
            localDB.insertServer(
              UserStor.userInfo.phone,
              UserStor.userInfo.device_code,
              localDB.tablesLocalDB.order_products.tableName,
              productData
            );
          }

          /** ====== SAVE Report Data ===== */
          var productReportData = angular.copy(OrderStor.order.products[p].report),
              reportQty = productReportData.length;
          while(--reportQty > -1) {
            productReportData[reportQty].order_id = OrderStor.order.id;
            productReportData[reportQty].price = angular.copy(productReportData[reportQty].priceReal);
            delete productReportData[reportQty].priceReal;
            //-------- insert product Report into local DB
            //localDB.insertRowLocalDB(productReportData[reportQty], localDB.tablesLocalDB.order_elements.tableName);
            //-------- send Report to Server
            // TODO localDB.insertServer(
            // UserStor.userInfo.phone, UserStor.userInfo.device_code,
            // localDB.tablesLocalDB.order_elements.tableName, productReportData[reportQty]);
          }

          /**============= SAVE ADDELEMENTS ============ */

          var addElemQty = OrderStor.order.products[p].chosenAddElements.length, add;
          for(add = 0; add < addElemQty; add+=1) {
            var elemQty = OrderStor.order.products[p].chosenAddElements[add].length, elem;
            if(elemQty > 0) {
              for (elem = 0; elem < elemQty; elem+=1) {
                if(OrderStor.order.products[p].chosenAddElements[add][elem].list_group_id === 20 && !productData.is_addelem_only) {
                  if (typeof OrderStor.order.products[p].chosenAddElements[add][elem].block_id !== 'number' ) {
                    OrderStor.order.products[p].chosenAddElements[add][elem].block_id = OrderStor.order.products[p].chosenAddElements[add][elem].block_id.split('_')[1];
                  }
                }
                var addElementsData = {
                  order_id: OrderStor.order.id,
                  product_id: OrderStor.order.products[p].product_id,
                  element_type: OrderStor.order.products[p].chosenAddElements[add][elem].element_type,
                  element_id: OrderStor.order.products[p].chosenAddElements[add][elem].id,
                  name: OrderStor.order.products[p].chosenAddElements[add][elem].name,
                  element_width: OrderStor.order.products[p].chosenAddElements[add][elem].element_width,
                  element_height: OrderStor.order.products[p].chosenAddElements[add][elem].element_height,
                  element_price: OrderStor.order.products[p].chosenAddElements[add][elem].element_price,
                  element_qty: OrderStor.order.products[p].chosenAddElements[add][elem].element_qty,
                  block_id:  OrderStor.order.products[p].chosenAddElements[add][elem].block_id*1,
                  modified: new Date()
                };


                //console.log('SEND ADD',addElementsData);
                if(orderType) {
                  localDB.insertRowLocalDB(addElementsData, localDB.tablesLocalDB.order_addelements.tableName);
                  localDB.insertServer(
                    UserStor.userInfo.phone,
                    UserStor.userInfo.device_code,
                    localDB.tablesLocalDB.order_addelements.tableName,
                    addElementsData
                  );
                } 
              }
            }
          }
        }

        /** ============ SAVE ORDER =========== */
        var orderData = angular.copy(OrderStor.order);
        orderData.order_date = new Date(OrderStor.order.order_date);
        orderData.order_type = orderType;
        orderData.order_price_dis = OrderStor.order.order_price_dis;
        orderData.order_price = OrderStor.order.order_price;
        orderData.order_price_primary = OrderStor.order.order_price_primary;
        orderData.order_style = orderStyle;
        orderData.factory_id = UserStor.userInfo.factory_id;
        orderData.user_id = UserStor.userInfo.id;
        orderData.delivery_date = new Date(OrderStor.order.delivery_date);
        orderData.new_delivery_date = new Date(OrderStor.order.new_delivery_date);
        orderData.customer_sex = +OrderStor.order.customer_sex || 0;
        orderData.customer_age = (OrderStor.order.customer_age) ? OrderStor.order.customer_age.id : 0;
        orderData.customer_education = (OrderStor.order.customer_education) ? OrderStor.order.customer_education.id : 0;
        orderData.customer_occupation = (OrderStor.order.customer_occupation)? OrderStor.order.customer_occupation.id : 0;
        orderData.customer_infoSource = (OrderStor.order.customer_infoSource)? OrderStor.order.customer_infoSource.id : 0;
        orderData.products_qty = GeneralServ.roundingValue(OrderStor.order.products_qty);
        //----- rates %
        orderData.discount_construct_max = UserStor.userInfo.discountConstrMax;
        orderData.discount_addelem_max = UserStor.userInfo.discountAddElemMax;
        orderData.default_term_plant = GlobalStor.global.deliveryCoeff.percents[GlobalStor.global.deliveryCoeff.standart_time];
        orderData.disc_term_plant = CartStor.cart.discountDeliveyPlant;
        orderData.margin_plant = CartStor.cart.marginDeliveyPlant;

        if(orderType && orderData.order_edit === 0) {
          orderData.additional_payment = '';
          orderData.created = new Date();
          orderData.sended = new Date(0);
          orderData.state_to = new Date(0);
          orderData.state_buch = new Date(0);
          orderData.batch = '---';
          orderData.base_price = 0;
          orderData.factory_margin = 0;
          orderData.purchase_price = 0;
          orderData.sale_price = 0;
          orderData.modified = new Date();
        }

        delete orderData.products;
        delete orderData.floorName;
        delete orderData.mountingName;
        delete orderData.selectedInstalmentPeriod;
        delete orderData.selectedInstalmentPercent;
        delete orderData.productsPriceDis;
        delete orderData.orderPricePrimaryDis;
        delete orderData.paymentFirstDis;
        delete orderData.paymentMonthlyDis;
        delete orderData.paymentFirstPrimaryDis;
        delete orderData.paymentMonthlyPrimaryDis;


        //console.log('!!!!orderData!!!!', orderData);
        if(orderType && orderData.order_edit === 0) {
          delete orderData.order_edit;
          localDB.insertServer(
            UserStor.userInfo.phone,
            UserStor.userInfo.device_code,
            localDB.tablesLocalDB.orders.tableName,
            orderData
          ).then(function(respond) {
            if(respond.status) {
              orderData.order_number = respond.order_number;
            }
            localDB.insertRowLocalDB(orderData, localDB.tablesLocalDB.orders.tableName);
            defer.resolve(1);
          });
        } else if(orderType && orderData.order_edit === 1) {
          var orderId = angular.copy(orderData.id);
          delete orderData.order_edit;
          localDB.updateOrderServer(
            UserStor.userInfo.phone,
            UserStor.userInfo.device_code,
            localDB.tablesLocalDB.orders.tableName,
            orderData,
            orderId
          ).then(function(res) {
            //------- save draft
            localDB.updateLocalDB(localDB.tablesLocalDB.orders.tableName, orderData, {id:orderId});
              defer.resolve(1);
            })
          }

        //TODO
        //------ send analytics data to Server
        //      AnalyticsServ.sendAnalyticsDB();

        //----- cleaning order
        OrderStor.order = OrderStor.setDefaultOrder();
        //------ set current GeoLocation
        loginServ.setUserGeoLocation(
          UserStor.userInfo.city_id,
          UserStor.userInfo.cityName,
          UserStor.userInfo.climaticZone,
          UserStor.userInfo.heatTransfer,
          UserStor.userInfo.fullLocation
        );
      
        //----- finish working with order
        GlobalStor.global.isCreatedNewProject = 0;
        return defer.promise;
      }
      return deferred.promise;
    }



    /**========== FINISH ==========*/


    thisFactory.publicObj = {
      saveUserEntry: saveUserEntry,
      createOrderData: createOrderData,
      createOrderID: createOrderID,
      doorProfile: doorProfile,
      setCurrDiscounts: setCurrDiscounts,
      setCurrTemplate: setCurrTemplate,
      prepareTemplates: prepareTemplates,
      downloadAllTemplates: downloadAllTemplates,

      setCurrentProfile: setCurrentProfile,
      setCurrentGlass: setCurrentGlass,
      setGlassToTemplateBlocks: setGlassToTemplateBlocks,
      setCurrentHardware: setCurrentHardware,
      fineItemById: fineItemById,
      parseTemplate: parseTemplate,
      saveTemplateInProduct: saveTemplateInProduct,
      downloadProfileDepth: downloadProfileDepth,
      saveTemplateInProductForOrder: saveTemplateInProductForOrder,
      checkSashInTemplate: checkSashInTemplate,
      preparePrice: preparePrice,
      setProductPriceTOTAL: setProductPriceTOTAL,
      showInfoBox: showInfoBox,
      closeRoomSelectorDialog: closeRoomSelectorDialog,
      laminatFiltering: laminatFiltering,
      laminationDoor: laminationDoor,
      setCurrLamination: setCurrLamination,
      setProfileByLaminat: setProfileByLaminat,
      checkGlassSizes: checkGlassSizes,
      checkHardwareSizes: checkHardwareSizes,

      createNewProject: createNewProject,
      createNewProduct: createNewProduct,
      setDefaultDoorConfig: setDefaultDoorConfig,
      prepareMainPage: prepareMainPage,
      setDefaultAuxParam: setDefaultAuxParam,

      inputProductInOrder: inputProductInOrder,
      goToCart: goToCart,
      saveOrderInDB: saveOrderInDB,
      deleteOrderInDB: deleteOrderInDB
    };

    return thisFactory.publicObj;

  });
})();
