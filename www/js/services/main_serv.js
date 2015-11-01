
// services/main_serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory($rootScope, $location, $q, $filter, $timeout, globalConstants, localDB, GeneralServ, SVGServ, loginServ, optionsServ, AnalyticsServ, GlobalStor, OrderStor, ProductStor, UserStor, AuxStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      saveUserEntry: saveUserEntry,
      createOrderData: createOrderData,
      createOrderID: createOrderID,
      setCurrDiscounts: setCurrDiscounts,
      downloadAllElemAsGroup: downloadAllElemAsGroup,
      downloadAllGlasses: downloadAllGlasses,
      sortingGlasses: sortingGlasses,
      prepareTemplates: prepareTemplates,
      //downloadAllTemplates: downloadAllTemplates,
      downloadAllLamination: downloadAllLamination,

      setCurrentProfile: setCurrentProfile,
      setCurrentGlass: setCurrentGlass,
      setGlassToAllTemplateBlocks: setGlassToAllTemplateBlocks,
      setCurrentHardware: setCurrentHardware,
      fineItemById: fineItemById,
      parseTemplate: parseTemplate,
      saveTemplateInProduct: saveTemplateInProduct,
      checkSashInTemplate: checkSashInTemplate,
      preparePrice: preparePrice,
      setProductPriceTOTAL: setProductPriceTOTAL,
      downloadAllAddElem: downloadAllAddElem,
      sortingAllAddElem: sortingAllAddElem,
      downloadCartMenuData: downloadCartMenuData,
      showInfoBox: showInfoBox,

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





    //============ methods ================//


    function saveUserEntry() {
      localDB.exportUserEntrance(UserStor.userInfo.phone, UserStor.userInfo.device_code);
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
//      localDB.updateLocalDB(localDB.tablesLocalDB.user.tableName, data, {'id': UserStor.userInfo.id});
//      localDB.updateServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, dataToSend).then(function(data) {
//        if(!data) {
//          //----- if no connect with Server save in Export LocalDB
//          localDB.insertRowLocalDB(dataToSend, localDB.tablesLocalDB.export.tableName);
//        }
//      });
    }




    /**  Create Order Id and Date */
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

    function createOrderID() {
      var currTime = new Date().getTime();
      return (UserStor.userInfo.id + '' + currTime)*1;
    }


    function setCurrDiscounts() {
      OrderStor.order.discount_construct = angular.copy(UserStor.userInfo.discountConstr);
      OrderStor.order.discount_addelem = angular.copy(UserStor.userInfo.discountAddElem);
    }



    /** price Margins of Plant */
    function addMarginToPrice(price, margin) {
      return price * margin;
    }



    //----------- get all elements as to groups

    function downloadAllElemAsGroup(tableGroup, tableElem, groups, elements) {
      var defer = $q.defer();
      //------- get all Folders
      localDB.selectLocalDB(tableGroup).then(function(result) {
        /** sorting types by position */
        var types = result.sort(function(a, b) {
              return GeneralServ.sorting(a.position, b.position);
            }),
            typesQty = types.length;
        if (typesQty) {
          groups.length = 0;
          angular.extend(groups, types);
          var promises = types.map(function(type) {
            var defer2 = $q.defer();
            localDB.selectLocalDB(tableElem, {'folder_id': type.id}).then(function (result2) {
              if (result2.length) {
                var elem = result2.sort(function(a, b) {
                  return GeneralServ.sorting(a.position, b.position);
                });
                defer2.resolve(angular.copy(elem));
              } else {
                defer2.resolve(0);
              }
            });
            return defer2.promise;
          });
          $q.all(promises).then(function(result3){
            var resQty = result3.length,
                existType = [],
                r = 0;
            for(; r < resQty; r++) {
              if(result3[r] && result3[r].length) {
                elements.push(result3[r]);
                existType.push(result3[r][0].folder_id);
              }
            }
            /** delete empty group */
            var existTypeQty = existType.length,
                groupQty = groups.length;
            if(existTypeQty) {
              while(--groupQty > -1) {
                var isExist = 0, t = 0;
                for(; t < existTypeQty; t++) {
                  if(groups[groupQty].id === existType[t]) {
                    isExist = 1;
                  }
                }
                if(!isExist) {
                  groups.splice(groupQty, 1);
                }
              }
            }
            defer.resolve(1);
          });
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }


//    function downloadElemImg() {
//      if(mobile) {
//        var url = "http://cdn.wall-pix.net/albums/art-space/00030109.jpg";
//        var targetPath = cordova.file.documentsDirectory + "testImage.png";
//        var trustHosts = true;
//        var options = {};
//
//        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function(result) {
//            // Success!
//          },
//          function(err) {
//            // Error
//          },
//          function (progress) {
//            $timeout(function () {
//              $scope.downloadProgress = (progress.loaded / progress.total) * 100;
//            })
//          });
//      } else {
//        globalConstants.serverIP;
//      }
//
//    }


    function downloadAllGlasses() {
      var defer = $q.defer(),
          profilesQty = GlobalStor.global.profiles.length,
          profileIds = [];
      //----- collect profiles in one array
      while(--profilesQty > -1) {
        var profileQty = GlobalStor.global.profiles[profilesQty].length;
        while(--profileQty > -1) {
          profileIds.push(GlobalStor.global.profiles[profilesQty][profileQty].id);
        }
      }

      //------ create structure of GlobalStor.global.glassesAll
      //------ insert profile Id and glass Types
      var promises2 = profileIds.map(function(item) {
        var defer2 = $q.defer(),
            glassObj = {profileId: item, glassTypes: [], glasses: []};
        localDB.selectLocalDB(localDB.tablesLocalDB.glass_folders.tableName).then(function (types) {
          if(types.length) {
            glassObj.glassTypes = angular.copy(types);
            GlobalStor.global.glassesAll.push(glassObj);
            defer2.resolve(1);
          } else {
            defer2.resolve(0);
          }
        });
        return defer2.promise;
      });

      $q.all(promises2).then(function(data){
//        console.log('data!!!!', data);
        if(data) {
          //-------- select all glass Ids as to profile Id
          var promises3 = GlobalStor.global.glassesAll.map(function(item) {
            var defer3 = $q.defer();
            localDB.selectLocalDB(localDB.tablesLocalDB.elements_profile_systems.tableName, {'profile_system_id': item.profileId}).then(function (glassId) {
              var glassIdQty = glassId.length;
              if(glassIdQty){
                defer3.resolve(glassId);
              } else {
                defer3.resolve(0);
              }
            });
            return defer3.promise;
          });

          $q.all(promises3).then(function(glassIds) {
            //-------- get glass as to its Id
            var glassIdsQty = glassIds.length,
                promises4 = [], promises6 = [];
//            console.log('glassIds!!!!', glassIds);
            for(var i = 0; i < glassIdsQty; i++) {
              var defer4 = $q.defer();

              var promises5 = glassIds[i].map(function(item) {
                var defer5 = $q.defer();
                localDB.selectLocalDB(localDB.tablesLocalDB.elements.tableName, {'id': item.element_id}).then(function (result) {
//                  console.log('glass!!!!', glass);
                  var glass = angular.copy(result),
                      glassQty = glass.length;
                  if(glassQty){
                    defer5.resolve(glass[0]);
                  } else {
                    defer5.resolve(0);
                  }
                });
                return defer5.promise;
              });

              defer4.resolve($q.all(promises5));
              promises4.push(defer4.promise);
            }

            for(var j = 0; j < glassIdsQty; j++) {
              var defer6 = $q.defer();

              var promises7 = glassIds[j].map(function(item) {
                var defer7 = $q.defer();
                localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'parent_element_id': item.element_id}).then(function (result2) {
                  var list = angular.copy(result2),
                      listQty = list.length;
                  if(listQty){
                    defer7.resolve(list[0]);
                  } else {
                    defer7.resolve(0);
                  }
                });
                return defer7.promise;
              });

              defer6.resolve($q.all(promises7));
              promises6.push(defer6.promise);
            }

            $q.all(promises4).then(function(glasses) {
//              console.log('glasses after 1111!!!!', glasses);
              var glassesQty = glasses.length;
              if(glassesQty) {
                for(var i = 0; i < glassesQty; i++) {
                  GlobalStor.global.glassesAll[i].glasses = glasses[i];
                }
              }
            });
            $q.all(promises6).then(function(lists) {
//              console.log('glasses after 2222!!!!', lists);
              var listsQty = lists.length;
              if(listsQty) {
                for(var i = 0; i < listsQty; i++) {
                  GlobalStor.global.glassesAll[i].glassLists = lists[i];
                  defer.resolve(1);
                }
              }
            });

          });

        }
      });
      return defer.promise;
    }


    function sortingGlasses() {
      var glassAllQty = GlobalStor.global.glassesAll.length, g = 0;

      for(; g < glassAllQty; g++) {
        //------- merge glassList to glasses
        var listQty = GlobalStor.global.glassesAll[g].glassLists.length,
            glassTypeQty = GlobalStor.global.glassesAll[g].glassTypes.length,
            newGlassesType = [],
            newGlasses = [];
        /** merge glassList to glasses */
        for(var l = 0; l < listQty; l++) {
          if(GlobalStor.global.glassesAll[g].glassLists[l].parent_element_id === GlobalStor.global.glassesAll[g].glasses[l].id) {
            GlobalStor.global.glassesAll[g].glasses[l].elem_id = angular.copy(GlobalStor.global.glassesAll[g].glasses[l].id);
            GlobalStor.global.glassesAll[g].glasses[l].id = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].id);
            GlobalStor.global.glassesAll[g].glasses[l].name = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].name);
            GlobalStor.global.glassesAll[g].glasses[l].cameras = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].cameras);
            GlobalStor.global.glassesAll[g].glasses[l].position = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].position);
            GlobalStor.global.glassesAll[g].glasses[l].img = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].img);
            GlobalStor.global.glassesAll[g].glasses[l].link = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].link);
            GlobalStor.global.glassesAll[g].glasses[l].description = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].description);
          }
        }

        /** sorting glassTypes by position */
        GlobalStor.global.glassesAll[g].glassTypes.sort(function(a, b) {
          return GeneralServ.sorting(a.position, b.position);
        });

        /** sorting glasses by type */
        while(--glassTypeQty > -1) {
          var glassByType = GlobalStor.global.glassesAll[g].glasses.filter(function(elem) {
            return elem.glass_folder_id === GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].id;
          });
//          console.log('glassByType!!!!!', glassByType);
          if(glassByType.length) {
            newGlassesType.unshift(GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty]);
            /** sorting glasses by position */
            glassByType.sort(function(a, b) {
              return GeneralServ.sorting(a.position, b.position);
            });
            newGlasses.unshift(glassByType);
          }
        }

        GlobalStor.global.glassesAll[g].glassTypes = angular.copy(newGlassesType);
        GlobalStor.global.glassesAll[g].glasses = angular.copy(newGlasses);
        delete GlobalStor.global.glassesAll[g].glassLists;
      }

    }



    function downloadAllLamination() {
      var defer = $q.defer();
      //----------- get all lamination
      localDB.selectLocalDB(localDB.tablesLocalDB.lamination_factory_colors.tableName).then(function(lamin) {
        if(lamin.length) {
          defer.resolve(lamin);
        } else {
          defer.reject(0);
        }
      });
      return defer.promise;
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




    //-------- set default profile
    function setCurrentProfile(product, id) {
      var deferred = $q.defer();
      if(id) {
        product.profile = fineItemById(id, GlobalStor.global.profiles);
      } else {
        product.profile = GlobalStor.global.profiles[0][0];
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


    function fineItemById(id, list) {
      var typeQty = list.length;
      while(--typeQty > -1) {
        var itemQty = list[typeQty].length;
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




    function parseTemplate() {
      var deferred = $q.defer();
      //------- set current template for product
      saveTemplateInProduct(ProductStor.product.template_id).then(function() {
        setCurrentGlass(ProductStor.product);
        setCurrentHardware(ProductStor.product);
        var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
        preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass[0].id, hardwareIds).then(function() {
          deferred.resolve(1);
        });
      });
      return deferred.promise;
    }



    function saveTemplateInProduct(templateIndex) {
      var defer = $q.defer();
      if(!GlobalStor.global.isChangedTemplate) {
        ProductStor.product.template_source = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
      }
      //----- create template
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
        ProductStor.product.template = angular.copy(result);
        GlobalStor.global.isSashesInTemplate = checkSashInTemplate(ProductStor.product);
//        console.log('TEMPLATE +++', ProductStor.product.template);
        //----- create template icon
        SVGServ.createSVGTemplateIcon(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
          ProductStor.product.templateIcon = angular.copy(result);
          defer.resolve(1);
        });
      });
      return defer.promise;
    }



    function checkSashInTemplate(product) {
      var templQty = product.template_source.details.length,
          counter = 0;
      while(--templQty > 0) {
        if(product.template_source.details[templQty].blockType === 'sash') {
          ++counter;
        }
      }
      return counter;
    }



    function setCurrentGlass(product, id) {
      if(id) {
        product.glass.unshift(fineItemById(id, GlobalStor.global.glasses));
      } else {
        //----- set default glass in ProductStor
        var tempGlassArr = GlobalStor.global.glassesAll.filter(function(item) {
          return item.profileId === product.profile.id;
        });
        if(tempGlassArr.length) {
          GlobalStor.global.glassTypes = angular.copy(tempGlassArr[0].glassTypes);
          GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
          product.glass.unshift(GlobalStor.global.glasses[0][0]);

          /** set Glass to all template blocks without children */
          setGlassToAllTemplateBlocks(0, product.glass[0].id, product.glass[0].sku);
        }
      }
    }


    function setGlassToAllTemplateBlocks(blockId, glassId, glassName) {
      var blocksQty = ProductStor.product.template_source.details.length;
      while(--blocksQty > 0) {
        var finded = 0;
        if(blockId) {
          /** set glass to template block by its Id */
          if(ProductStor.product.template_source.details[blocksQty].id === blockId) {
            finded++;
          }
        } else {
          /** set glass to all template blocks */
          if(!ProductStor.product.template_source.details[blocksQty].children.length) {
            finded++;
          }
        }
        if(finded) {
          ProductStor.product.template_source.details[blocksQty].glassId = glassId;
          ProductStor.product.template_source.details[blocksQty].glassTxt = glassName;
          ProductStor.product.template.details[blocksQty].glassId = glassId;
          ProductStor.product.template.details[blocksQty].glassTxt = glassName;
        }
      }
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


    //--------- create object to send in server for price calculation
    function preparePrice(template, profileId, glassId, hardwareId) {
      var deferred = $q.defer();
      GlobalStor.global.isLoader = 1;
      setBeadId(profileId).then(function(beadIds) {

        var objXFormedPrice = {
              currencyId: UserStor.userInfo.currencyId,
              laminationId: ProductStor.product.lamination_in_id,
              ids: [
                ProductStor.product.profile.rama_list_id,
                ProductStor.product.profile.rama_still_list_id,
                ProductStor.product.profile.stvorka_list_id,
                ProductStor.product.profile.impost_list_id,
                ProductStor.product.profile.shtulp_list_id,
                glassId, //[glassId, glassId], //array
                beadIds[0], //array
                hardwareId
              ],
              sizes: []
            };


        //------- fill objXFormedPrice for sizes
        for(var size in template.priceElements) {
          //----- converting size from mm to m
          var newSizes = [];
          //----- besides of glass squares
          if(size === 'sashesBlock') {
            newSizes = angular.copy(template.priceElements[size]);
          } else if(size === 'glassSquares') { //TODO change!!!!!!
            var sizeElemQty = template.priceElements[size].length,
                sq = 0;
            for(; sq < sizeElemQty; sq++) {
              var glassSizeObj = {
                glassId: glassId,
                square: template.priceElements[size][sq].square,
                sizes: angular.copy(template.priceElements[size][sq].sizes).map(function(item) {
                  return GeneralServ.roundingNumbers(item/1000, 3);
                })
              };
              newSizes.push(glassSizeObj);
            }
          } else {
            newSizes = angular.copy(template.priceElements[size]).map(function(item) {
              return GeneralServ.roundingNumbers(item/1000, 3);
            });
          }
          objXFormedPrice.sizes.push(newSizes);
        }

        //------- set Overall Dimensions
        ProductStor.product.template_width = 0;
        ProductStor.product.template_height = 0;
        ProductStor.product.template_square = 0;
        var overallQty = ProductStor.product.template.details[0].overallDim.length;
        while(--overallQty > -1) {
          ProductStor.product.template_width += ProductStor.product.template.details[0].overallDim[overallQty].w;
          ProductStor.product.template_height += ProductStor.product.template.details[0].overallDim[overallQty].h;
          ProductStor.product.template_square += ProductStor.product.template.details[0].overallDim[overallQty].square;
        }

//        console.log('objXFormedPrice+++++++', JSON.stringify(objXFormedPrice));
//        console.log('objXFormedPrice+++++++', objXFormedPrice);

        console.log('START PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());

        //--------- get product price
        calculationPrice(objXFormedPrice).then(function(result) {
          deferred.resolve(1);
          /** set Report */
          if(result) {
            //---- only for this type of user
            if(UserStor.userInfo.user_type === 5 || UserStor.userInfo.user_type === 7) {
              ProductStor.product.report = prepareReport(result.constrElements);
            }
          }
        });

        /** calculate coeffs */
        calculateCoeffs(objXFormedPrice);

        /** save analytics data first time */
        if(GlobalStor.global.startProgramm) {
          AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, ProductStor.product.profile.id, 1);
        }
      });
      return deferred.promise;
    }


    /** set Bead Id */
    function setBeadId(profileId) {
      var defer = $q.defer(),
          promises = ProductStor.product.glass.map(function(item) {
            var defer2 = $q.defer();
            if(item.glass_width) {
              localDB.selectLocalDB(localDB.tablesLocalDB.beed_profile_systems.tableName, {'profile_system_id': profileId, "glass_width": item.glass_width}).then(function (result) {
                if(result.length) {
                  defer2.resolve(result[0].list_id);
                } else {
                  console.log('Error!!', result);
                  defer2.resolve(0);
                }
              });
              return defer2.promise;
            }
          });

      $q.all(promises).then(function(data) {
        if(data) {
          defer.resolve(data);
        }
      });
      return defer.promise;
    }


    //---------- Price define
    function calculationPrice(obj) {
      var deferred = $q.defer();
      localDB.calculationPrice(obj).then(function (result) {
        console.log('price-------', result);
        if(result.priceTotal){
          ProductStor.product.template_price = addMarginToPrice(result.priceTotal, GlobalStor.global.margins.coeff);
          setProductPriceTOTAL();
          console.log('FINISH PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());
          deferred.resolve(result);
        } else {
          ProductStor.product.template_price = 0;
          deferred.resolve(0);
        }
      });
      return deferred.promise;
    }



    function prepareReport(elementList) {
      var report = [];
//      console.log('report start', new Date(), new Date().getMilliseconds());
      var elementListQty = elementList.length,
          ind = 0;
      if(elementListQty) {
        for (; ind < elementListQty; ind++) {
          var tempObj = angular.copy(elementList[ind]);
          tempObj.element_id = angular.copy(tempObj.id);
          tempObj.amount = angular.copy(tempObj.qty);
          delete tempObj.id;
          delete tempObj.amendment_pruninng;
          delete tempObj.currency_id;
          delete tempObj.qty;
          delete tempObj.waste;
          if (ind) {
            var reportQty = report.length, exist = 0;
            if (reportQty) {
              while (--reportQty > -1) {
                if (report[reportQty].element_id === tempObj.element_id && report[reportQty].size === tempObj.size) {
                  exist++;
                  report[reportQty].amount += tempObj.amount;
                  report[reportQty].amount = GeneralServ.roundingNumbers(report[reportQty].amount, 3);
                  report[reportQty].priceReal += tempObj.priceReal;
                  report[reportQty].priceReal = GeneralServ.roundingNumbers(addMarginToPrice(report[reportQty].priceReal, GlobalStor.global.margins.coeff), 3);
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
      }
//      console.log('report finish', new Date(), new Date().getMilliseconds());
      return report;
    }






    //---------- Coeffs define
    function calculateCoeffs(objXFormedPrice) {
      var glassSquareTotal,
          profileHeatCoeffTotal,
          glassHeatCoeffTotal;

//      for (var item = 0; item < templateQty; item++) {
//        if(ProductStor.product.template.objects[item].type === "square") {
//          constructionSquareTotal = ProductStor.product.template.objects[item].squares.reduce(function(sum, elem) {
//            return sum + elem;
//          });
//        }
//      }
      //-------- total glasses square define
      glassSquareTotal = GeneralServ.roundingNumbers(objXFormedPrice.sizes[5].reduce(function(sum, elem) {
        return {square: (sum.square + elem.square)};
      }).square, 3);
//      console.log('heat_coef_total++++', ProductStor.product.profile.heat_coeff_value, ProductStor.product.template_square, glassSquareTotal);

      //-------- coeffs define
      if(!$.isNumeric(ProductStor.product.profile.heat_coeff_value)) {
        ProductStor.product.profile.heat_coeff_value = 1;
      }
      profileHeatCoeffTotal = ProductStor.product.profile.heat_coeff_value * (ProductStor.product.template_square - glassSquareTotal);

//      console.log('heat_coef_total++++', ProductStor.product.glass[0].heat_coeff, glassSquareTotal);
      //TODO glass array!
      if(!$.isNumeric(ProductStor.product.glass[0].transcalency)){
        ProductStor.product.glass[0].transcalency = 1;
      }
      glassHeatCoeffTotal = ProductStor.product.glass[0].transcalency * glassSquareTotal;
      /** calculate Heat Coeff Total */
      ProductStor.product.heat_coef_total = GeneralServ.roundingNumbers( ProductStor.product.template_square/(profileHeatCoeffTotal + glassHeatCoeffTotal) );

      //-------- calculate Air Coeff Total
      //ProductStor.product.airCirculationTOTAL = + ProductStor.product.profileAirCoeff + ProductStor.product.glassAirCoeff + ProductStor.product.hardwareAirCoeff;

    }



    function setProductPriceTOTAL() {
      //playSound('price');
      ProductStor.product.product_price = GeneralServ.roundingNumbers( ProductStor.product.template_price + ProductStor.product.addelem_price );
      ProductStor.product.productPriceDis = ( GeneralServ.setPriceDis(ProductStor.product.template_price, OrderStor.order.discount_construct) + ProductStor.product.addelemPriceDis );
      //------ add Discount of standart delivery day of Plant
      if(GlobalStor.global.deliveryCoeff.base_time) {
        ProductStor.product.productPriceDis = GeneralServ.setPriceDis(ProductStor.product.productPriceDis, GlobalStor.global.deliveryCoeff.base_time);
      }
      GlobalStor.global.isLoader = 0;
    }




    function downloadAllAddElem() {
      var defer = $q.defer(),
          promises = localDB.addElementDBId.map(function(item) {
            return localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'list_group_id': item});
          });
      /** get All kits of addElements*/
      $q.all(promises).then(function (result) {
        var resultQty = result.length;
        for(var i = 0; i < resultQty; i++) {
          var elemGroupObj = {elementType: [], elementsList: result[i]};
          GlobalStor.global.addElementsAll.push(elemGroupObj);
          /** get element of addElements*/
          if(result[i]) {
            var promisElem = result[i].map(function(item) {
              return localDB.selectLocalDB(localDB.tablesLocalDB.elements.tableName, {'id': item.parent_element_id});
            });
            $q.all(promisElem).then(function (result) {
              var resQty = result.length;
              if(resQty) {
                for(var j = 0; j < resQty; j++) {
                  GlobalStor.global.tempAddElements.push(angular.copy(result[j][0]));
                }
              }
              if(i === resultQty) {
                defer.resolve(1);
              }
            });
          }
        }
      });
      return defer.promise;
    }


    function sortingAllAddElem() {
      localDB.selectLocalDB(localDB.tablesLocalDB.addition_folders.tableName).then(function(groups) {
        var groupQty = groups.length;
        if (groupQty) {
          var elemAllQty = GlobalStor.global.addElementsAll.length,
              defaultGroup = {
                id: 0,
                name: $filter('translate')('add_elements.OTHERS')
              };

          while(--elemAllQty > -1) {
            if(GlobalStor.global.addElementsAll[elemAllQty].elementsList) {
              GlobalStor.global.addElementsAll[elemAllQty].elementType = angular.copy(groups);
              GlobalStor.global.addElementsAll[elemAllQty].elementType.push(defaultGroup);
              //------- sorting
              var newElemList = [],
                  typeDelete = [],
                  typeQty = GlobalStor.global.addElementsAll[elemAllQty].elementType.length,
                  elemQty = GlobalStor.global.addElementsAll[elemAllQty].elementsList.length,
                  tempElemQty = GlobalStor.global.tempAddElements.length;
              for(var t = 0; t < typeQty; t++) {
                var elements = [];
                for(var el = 0; el < elemQty; el++) {
                  if(GlobalStor.global.addElementsAll[elemAllQty].elementType[t].id === GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].addition_folder_id) {
                    var widthTemp = 0,
                        heightTemp = 0;
                    switch(GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].list_group_id){
                      case 21: // 1 - visors
                      case 9: // 2 - spillways
                      case 8: // 8 - windowSill
                      case 19: // 3 - outSlope & inSlope
                      case 12: // 6 - connectors
                        widthTemp = 1000;
                        break;
                      case 20: // 0 - grids
                      case 26: // 4 - louvers
                        widthTemp = 1000;
                        heightTemp = 1000;
                        break;
                    }
                    GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_width = widthTemp;
                    GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_height = heightTemp;
                    GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_qty = 1;
                    /** get price of element */
                    for(var k = 0; k < tempElemQty; k++) {
                      if(GlobalStor.global.tempAddElements[k].id === GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].parent_element_id) {
                        /** add price margin */
                        GlobalStor.global.tempAddElements[k].price = addMarginToPrice(angular.copy(GlobalStor.global.tempAddElements[k].price), GlobalStor.global.margins.margin);
                        /** currency conversion */
                        GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_price = localDB.currencyExgange(GlobalStor.global.tempAddElements[k].price, UserStor.userInfo.currencyId, GlobalStor.global.tempAddElements[k].currency_id, GlobalStor.global.currencies);
                      }
                    }
                    elements.push(angular.copy(GlobalStor.global.addElementsAll[elemAllQty].elementsList[el]));
                  }
                }
                if(elements.length) {
                  newElemList.push(elements);
                } else {
                  typeDelete.push(t);
                }
              }

              if(newElemList.length) {
                GlobalStor.global.addElementsAll[elemAllQty].elementsList = angular.copy(newElemList);
              } else {
                GlobalStor.global.addElementsAll[elemAllQty].elementsList = 0;
              }

              /** delete empty groups */
              var delQty = typeDelete.length;
              if(delQty) {
                while(--delQty > -1) {
                  GlobalStor.global.addElementsAll[elemAllQty].elementType.splice(typeDelete[delQty], 1);
                }
              }
            }
//            console.log('addElementsAll ++++', GlobalStor.global.addElementsAll);
          }

        }
      });
    }




    function downloadCartMenuData() {
      /** download Supply Data */
      localDB.selectLocalDB(localDB.tablesLocalDB.users_deliveries.tableName).then(function(supply) {
        if (supply.length) {
          GlobalStor.global.supplyData = angular.copy(supply);
//          console.warn('supplyData=', GlobalStor.global.supplyData);
        }
      });
      /** download Mounting Data */
      localDB.selectLocalDB(localDB.tablesLocalDB.users_mountings.tableName).then(function(mounting) {
        if (mounting.length) {
          GlobalStor.global.assemblingData = angular.copy(mounting);
//          console.warn('assemblingData=', GlobalStor.global.assemblingData);
        }
      });
      /** download Instalment Data */
      optionsServ.getInstalment(function (results) {
        if (results.status) {
          GlobalStor.global.instalmentsData = results.data.instalment;
        } else {
          console.log(results);
        }
      });
    }



    /** show Info Box of element or group */
    function showInfoBox(id, itemArr) {
      if(GlobalStor.global.isInfoBox !== id) {
//        console.info(id, itemArr);
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
          GlobalStor.global.infoImg =  globalConstants.serverIP + tempObj.img;
          GlobalStor.global.infoLink = tempObj.link;
          GlobalStor.global.infoDescrip = tempObj.description;
          GlobalStor.global.isInfoBox = id;
        }
//        console.info(GlobalStor.global.infoTitle, GlobalStor.global.infoImg, GlobalStor.global.infoLink, GlobalStor.global.infoDescrip);
      }
    }




    //========== CREATE ORDER ==========//

    function createNewProject() {
      console.log('new project!!!!!!!!!!!!!!');
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
      prepareTemplates(ProductStor.product.construction_type).then(function() {
        GlobalStor.global.isLoader = 0;
        prepareMainPage();
        if(GlobalStor.global.currOpenPage !== 'main') {
          GlobalStor.global.showRoomSelectorDialog = 0;
          $location.path('/main');
          $timeout(function() {
            GlobalStor.global.showRoomSelectorDialog = 1;
          }, 1000);
        }
      });
    }






    //========== CREATE PRODUCT ==========//

    function createNewProduct() {
      console.log('new product!!!!!!!!!!!!!!!');
      //------- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
      GlobalStor.global.isCreatedNewProduct = 1;
      GlobalStor.global.isChangedTemplate = 0;
      //------- set new templates
      prepareTemplates(ProductStor.product.construction_type).then(function() {
        prepareMainPage();
        if(GlobalStor.global.currOpenPage !== 'main') {
          GlobalStor.global.showRoomSelectorDialog = 0;
          $location.path('/main');
          $timeout(function() {
            GlobalStor.global.showRoomSelectorDialog = 1;
          }, 1000);
        }
      });
    }


    function setDefaultDoorConfig() {
      ProductStor.product.door_shape_id = 0;
      ProductStor.product.door_sash_shape_id = 0;
      ProductStor.product.door_handle_shape_id = 0;
      ProductStor.product.door_lock_shape_id = 0;
    }


    function prepareMainPage() {
      GlobalStor.global.isNavMenu = 0;
      GlobalStor.global.isConfigMenu = 1;
      GlobalStor.global.activePanel = 0;
      setDefaultAuxParam();
      GlobalStor.global.showRoomSelectorDialog = 1;
    }


    function setDefaultAuxParam() {
      AuxStor.aux.isWindowSchemeDialog = 0;
      AuxStor.aux.isAddElementListView = 0;
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.showAddElementsMenu = 0;
    }





    //========== SAVE PRODUCT ==========//

    //-------- Save Product in Order and go to Cart
    function inputProductInOrder() {
      var deferred = $q.defer();
      GlobalStor.global.tempAddElements.length = 0;
      GlobalStor.global.configMenuTips = 0;

      //============ if EDIT Product
      if(GlobalStor.global.productEditNumber) {
        var productsQty = OrderStor.order.products.length;
        //-------- replace product in order
        while(--productsQty > -1) {
          if(OrderStor.order.products[productsQty].product_id === GlobalStor.global.productEditNumber) {
            OrderStor.order.products[productsQty] = angular.copy(ProductStor.product);
          }
        }

      //========== if New Product
      } else {
        ProductStor.product.product_id = (OrderStor.order.products_qty > 0) ? (OrderStor.order.products_qty + 1) : 1;
        delete ProductStor.product.template;
        //-------- insert product in order
        OrderStor.order.products.push(ProductStor.product);
        OrderStor.order.products_qty = ProductStor.product.product_id;
      }
      deferred.resolve(1);
      //----- finish working with product
      GlobalStor.global.isCreatedNewProduct = 0;
      return deferred.promise;
    }


    //--------- moving to Cart when click on Cart button
    function goToCart() {
      $timeout(function() {
        //------- set previos Page
        GeneralServ.setPreviosPage();
        $location.path('/cart');
      }, 100);
    }





    //========== SAVE ORDER ==========//

    //-------- save Order into Local DB
    function saveOrderInDB(newOptions, orderType, orderStyle) {
      var deferred = $q.defer();

      //---------- if EDIT Order, before inserting delete old order
      if(GlobalStor.global.orderEditNumber) {
        deleteOrderInDB(GlobalStor.global.orderEditNumber);
        localDB.deleteOrderServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, GlobalStor.global.orderEditNumber);
        GlobalStor.global.orderEditNumber = 0;
      }
      angular.extend(OrderStor.order, newOptions);

      var prodQty = OrderStor.order.products.length;
        for(var p = 0; p < prodQty; p++) {

          var productData = angular.copy(OrderStor.order.products[p]);
          productData.order_id = OrderStor.order.id;
          productData.template_source = JSON.stringify(OrderStor.order.products[p].template_source);
          productData.profile_id = OrderStor.order.products[p].profile.id;
          productData.glass_id = OrderStor.order.products[p].glass.map(function(item) {
            return item.id;
          }).join(', ');
          productData.hardware_id = (OrderStor.order.products[p].hardware.id) ? OrderStor.order.products[p].hardware.id : 0;
          productData.modified = new Date();
          if(productData.template) {
            delete productData.template;
          }
          delete productData.templateIcon;
          delete productData.profile;
          delete productData.glass;
          delete productData.hardware;
          delete productData.laminationOutName;
          delete productData.laminationInName;
          delete productData.chosenAddElements;
          delete productData.profileDepths;
          delete productData.addelemPriceDis;
          delete productData.productPriceDis;
          delete productData.report;

          console.log('SEND PRODUCT------', productData);
          //-------- insert product into local DB
          localDB.insertRowLocalDB(productData, localDB.tablesLocalDB.order_products.tableName);
          //-------- send to Server
          if(orderType) {
            localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.order_products.tableName, productData);
          }


          //============= SAVE ADDELEMENTS
          var addElemQty = OrderStor.order.products[p].chosenAddElements.length;
          for(var add = 0; add < addElemQty; add++) {
            var elemQty = OrderStor.order.products[p].chosenAddElements[add].length;
            if(elemQty > 0) {
              for (var elem = 0; elem < elemQty; elem++) {

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
                  modified: new Date()
                };


                console.log('SEND ADD',addElementsData);
                localDB.insertRowLocalDB(addElementsData, localDB.tablesLocalDB.order_addelements.tableName);
                if(orderType) {
                  localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.order_addelements.tableName, addElementsData);
                }
              }
            }
          }
        }

      //============ SAVE ORDER
//      console.log('!!!!ORDER!!!!', JSON.stringify(OrderStor.order));
      var orderData = angular.copy(OrderStor.order);
      orderData.order_date = new Date(OrderStor.order.order_date);
      orderData.order_type = orderType;
      orderData.order_style = orderStyle;
      orderData.factory_id = UserStor.userInfo.factory_id;
      orderData.user_id = UserStor.userInfo.id;
      orderData.delivery_date = new Date(OrderStor.order.delivery_date);
      orderData.new_delivery_date = new Date(OrderStor.order.new_delivery_date);
      orderData.customer_sex = (OrderStor.order.customer_sex) ? +OrderStor.order.customer_sex : 0;
      orderData.customer_age = (OrderStor.order.customer_age) ? OrderStor.order.customer_age.id : 0;
      orderData.customer_education = (OrderStor.order.customer_education) ? OrderStor.order.customer_education.id : 0;
      orderData.customer_occupation = (OrderStor.order.customer_occupation) ? OrderStor.order.customer_occupation.id : 0;
      orderData.customer_infoSource = (OrderStor.order.customer_infoSource) ? OrderStor.order.customer_infoSource.id : 0;

      if(orderType) {
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
      delete orderData.currCityId;
      delete orderData.currRegionName;
      delete orderData.currCountryName;
      delete orderData.currFullLocation;
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

      console.log('!!!!orderData!!!!', orderData);
      if(orderType) {
        localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.orders.tableName, orderData).then(function(respond) {
          if(respond.status) {
            orderData.order_number = respond.order_number;
          }
          localDB.insertRowLocalDB(orderData, localDB.tablesLocalDB.orders.tableName);
          deferred.resolve(1);
        });
      } else {
        //------- save draft
        localDB.insertRowLocalDB(orderData, localDB.tablesLocalDB.orders.tableName);
        deferred.resolve(1);
      }

      //------ send analytics data to Server
      AnalyticsServ.sendAnalyticsDB();

      //----- cleaning order
      OrderStor.order = OrderStor.setDefaultOrder();
      //------ set current GeoLocation
      loginServ.setUserGeoLocation(UserStor.userInfo.city_id, UserStor.userInfo.cityName, UserStor.userInfo.regionName, UserStor.userInfo.countryName, UserStor.userInfo.climaticZone, UserStor.userInfo.heatTransfer, UserStor.userInfo.fullLocation);
      //----- finish working with order
      GlobalStor.global.isCreatedNewProject = 0;
      return deferred.promise;
    }



    //-------- delete order from LocalDB
    function deleteOrderInDB(orderNum) {
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.orders.tableName, {'id': orderNum});
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_id': orderNum});
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_id': orderNum});
    }



  }
})();

