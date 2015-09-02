
// services/main_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory($rootScope, $location, $q, $filter, $timeout, globalConstants, globalDB, localDB, GeneralServ, SVGServ, loginServ, optionsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      createOrderData: createOrderData,
      setCurrDiscounts: setCurrDiscounts,
      downloadAllProfiles: downloadAllProfiles,
      downloadAllGlasses: downloadAllGlasses,
      sortingGlasses: sortingGlasses,
      downloadAllHardwares: downloadAllHardwares,
      sortingHardware: sortingHardware,
      prepareTemplates: prepareTemplates,
      //downloadAllTemplates: downloadAllTemplates,
      downloadAllLamination: downloadAllLamination,

      setCurrentProfile: setCurrentProfile,
      setCurrentGlass: setCurrentGlass,
      setCurrentHardware: setCurrentHardware,
      parseTemplate: parseTemplate,
      saveTemplateInProduct: saveTemplateInProduct,

      preparePrice: preparePrice,
      setProductPriceTOTAL: setProductPriceTOTAL,
      isAddElemExist: isAddElemExist,

      createNewProject: createNewProject,
      createNewProduct: createNewProduct,
      setDefaultDoorConfig: setDefaultDoorConfig,
      prepareMainPage: prepareMainPage,

      inputProductInOrder: inputProductInOrder,
      goToCart: goToCart,
      insertOrderInLocalDB: insertOrderInLocalDB,
      deleteOrderFromLocalDB: deleteOrderFromLocalDB
    };

    return thisFactory.publicObj;





    //============ methods ================//

    //------------- Create Order Id and Date
    function createOrderData() {
      var productDay;
      //----------- create order number for new project
      OrderStor.order.orderId = Math.floor((Math.random() * 100000));
      //------ set delivery day
      productDay = new Date(OrderStor.order.orderDate).getDate() + globalConstants.productionDays;
      OrderStor.order.deliveryDate = new Date().setDate(productDay);
      OrderStor.order.newDeliveryDate = angular.copy(OrderStor.order.deliveryDate);
    }



    function setCurrDiscounts() {
      OrderStor.order.currDiscount = angular.copy(UserStor.userInfo.discount);
      OrderStor.order.currDiscountAddElem = angular.copy(UserStor.userInfo.discountAddElem);
    }


    //----------- get all profiles
    function downloadAllProfiles() {
      var defer = $q.defer();
      //------- get all Prifile Folders
      globalDB.selectLocalDB(globalDB.tablesLocalDB.profile_system_folders.tableName).then(function(types) {
        var typesQty = types.length;
        if (typesQty) {
          GlobalStor.global.profilesType = angular.copy(types);
          var promises = types.map(function(type) {
            var defer2 = $q.defer();
            globalDB.selectLocalDB(globalDB.tablesLocalDB.profile_systems.tableName, {'profile_system_folder_id': type.id}).then(function (profile) {
              if (profile.length) {
                GlobalStor.global.profiles.push(angular.copy(profile));
                defer2.resolve(1);
              } else {
                defer2.resolve(0);
              }
            });
            return defer2.promise;
          });
          $q.all(promises).then(function(){
            defer.resolve(1);
          });
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }



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
        globalDB.selectLocalDB(globalDB.tablesLocalDB.glass_folders.tableName).then(function (types) {
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
            globalDB.selectLocalDB(globalDB.tablesLocalDB.elements_profile_systems.tableName, {'profile_system_id': item.profileId}).then(function (glassId) {
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
                globalDB.selectLocalDB(globalDB.tablesLocalDB.elements.tableName, {'id': item.element_id}).then(function (glass) {
//                  console.log('glass!!!!', glass);
                  var glassQty = glass.length;
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

            for(var i = 0; i < glassIdsQty; i++) {
              var defer6 = $q.defer();

              var promises7 = glassIds[i].map(function(item) {
                var defer7 = $q.defer();
                globalDB.selectLocalDB(globalDB.tablesLocalDB.lists.tableName, {'parent_element_id': item.element_id}).then(function (list) {
                  var listQty = list.length;
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
      var glassAllQty = GlobalStor.global.glassesAll.length;


      for(var g = 0; g < glassAllQty; g++) {
        //------- merge glassList to glasses
        var listQty = GlobalStor.global.glassesAll[g].glassLists.length;
        for(var l = 0; l < listQty; l++) {
          if(GlobalStor.global.glassesAll[g].glassLists[l].parent_element_id === GlobalStor.global.glassesAll[g].glasses[l].id) {
            GlobalStor.global.glassesAll[g].glasses[l].list_id = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].id);
            GlobalStor.global.glassesAll[g].glasses[l].list_name = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].name);
            GlobalStor.global.glassesAll[g].glasses[l].cameras = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].cameras);
          }
        }

        //------- sorting glasses by type
        var glassTypeQty = GlobalStor.global.glassesAll[g].glassTypes.length,
            newGlassesType = [],
            newGlasses = [];
        while(--glassTypeQty > -1) {
          var glassByType = GlobalStor.global.glassesAll[g].glasses.filter(function(elem) {
            return elem.glass_folder_id === GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].id;
          });
//          console.log('glassByType!!!!!', glassByType);
          if(glassByType.length) {
            newGlassesType.push(GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty]);
            newGlasses.push(glassByType);
          }
        }
        GlobalStor.global.glassesAll[g].glassTypes = angular.copy(newGlassesType);
        GlobalStor.global.glassesAll[g].glasses = angular.copy(newGlasses);
        delete GlobalStor.global.glassesAll[g].glassLists;
      }

    }



    function downloadAllHardwares() {
      var defer = $q.defer();
      //------- get all Hardware Groups
      globalDB.selectLocalDB(globalDB.tablesLocalDB.window_hardware_groups.tableName).then(function(types) {
        var typesQty = types.length;
        if (typesQty) {
          GlobalStor.global.hardwareTypes = angular.copy(types);

          globalDB.selectLocalDB(globalDB.tablesLocalDB.window_hardware_features.tableName).then(function (ware) {
            if (ware.length) {
              GlobalStor.global.hardwares = angular.copy(ware);
              defer.resolve(1);
            } else {
              defer.resolve(0);
            }
          });
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }


    function sortingHardware() {
      var wareTypeQty = GlobalStor.global.hardwareTypes.length,
          waresQty = GlobalStor.global.hardwares.length,
          wares = [], wareOther = [], typeDelete = [];
      for(var t = 0; t < wareTypeQty; t++) {
        var ware = [];
        for(var w = 0; w < waresQty; w++) {
          if(GlobalStor.global.hardwareTypes[t].id === GlobalStor.global.hardwares[w].hardware_group_id) {
            ware.push(angular.copy(GlobalStor.global.hardwares[w]));
          }
        }
        if(ware.length) {
          wares.push(ware);
        } else {
          typeDelete.push(t);
        }
      }
      //------- delete empty groups
      var delQty = typeDelete.length;
      if(delQty) {
        while(--delQty > -1) {
          GlobalStor.global.hardwareTypes.splice(typeDelete[delQty], 1);
        }
      }
      //------ collect other hardware no include in group
      for(var w = 0; w < waresQty; w++) {
        if(GlobalStor.global.hardwares[w].hardware_group_id === 0) {
          wareOther.push(angular.copy(GlobalStor.global.hardwares[w]));
        }
      }
      if(wareOther.length) {
        wares.push(wareOther);
        GlobalStor.global.hardwareTypes.push({
          name: $filter('translate')('panels.OTHER_TYPE')
        });
      }
      GlobalStor.global.hardwares = wares;
    }


    function downloadAllLamination() {
      var defer = $q.defer();
      //----------- get all lamination
      globalDB.selectLocalDB(globalDB.tablesLocalDB.lamination_factory_colors.tableName).then(function(laminIds) {
        if(laminIds.length) {
          var promises = laminIds.map(function(item) {
            var defer2 = $q.defer();
            globalDB.selectLocalDB(globalDB.tablesLocalDB.lamination_default_colors.tableName, {'id': item.lamination_type_id}).then(function(lamin) {
              if(lamin.length) {
                defer2.resolve(lamin[0]);
              }
            });
            return defer2.promise;
          });
          defer.resolve($q.all(promises));
        } else {
          console.log('No laminations in database');
          defer.reject(0);
        }
      });
      return defer.promise;
    }




    function prepareTemplates(type) {
      var deferred = $q.defer();
//      GlobalStor.global.isLoader = 1;
      downloadAllTemplates(type).then(function(data) {
        if(data) {
          GlobalStor.global.templatesSourceSTORE = angular.copy(data);
          GlobalStor.global.templatesSource = angular.copy(data);

          //--------- set current profile in ProductStor
          setCurrentProfile().then(function(){
            parseTemplate().then(function() {
              deferred.resolve(1);
            });

          });

        } else {
          deferred.reject('error!');
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
    function setCurrentProfile(id) {
      var deferred = $q.defer();
      if(id) {
        ProductStor.product.profile = fineItemById(id, GlobalStor.global.profiles);
      } else {
        ProductStor.product.profile = GlobalStor.global.profiles[0][0];
      }

      //------- set Depths
      $q.all([
        downloadProfileDepth(ProductStor.product.profile.rama_list_id),
        downloadProfileDepth(ProductStor.product.profile.rama_still_list_id),
        downloadProfileDepth(ProductStor.product.profile.stvorka_list_id),
        downloadProfileDepth(ProductStor.product.profile.impost_list_id),
        downloadProfileDepth(ProductStor.product.profile.shtulp_list_id)
      ]).then(function (result) {
        GlobalStor.global.profileDepths.frameDepth = result[0];
        GlobalStor.global.profileDepths.frameStillDepth = result[1];
        GlobalStor.global.profileDepths.sashDepth = result[2];
        GlobalStor.global.profileDepths.impostDepth = result[3];
        GlobalStor.global.profileDepths.shtulpDepth = result[4];
        deferred.resolve('done');
      });
      return deferred.promise;
      //console.log('product', ProductStor.product);
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
      globalDB.selectLocalDB(globalDB.tablesLocalDB.lists.tableName, {'id': elementId}).then(function(result) {
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
      saveTemplateInProduct(ProductStor.product.templateIndex).then(function() {
        setCurrentGlass();
        setCurrentHardware();
        preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass.list_id, ProductStor.product.hardware.id).then(function() {
          deferred.resolve(1);
        });
      });
      return deferred.promise;
    }



    function saveTemplateInProduct(templateIndex) {
      var defer = $q.defer();
      ProductStor.product.templateSource = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
      //----- create template
      SVGServ.createSVGTemplate(ProductStor.product.templateSource, GlobalStor.global.profileDepths).then(function(result) {
        ProductStor.product.template = angular.copy(result);
        GlobalStor.global.isSashesInTemplate = checkSashInTemplate();
        console.log('TEMPLATE +++', ProductStor.product.template);
        //----- create template icon
        SVGServ.createSVGTemplateIcon(ProductStor.product.templateSource, GlobalStor.global.profileDepths).then(function(result) {
          ProductStor.product.templateIcon = angular.copy(result);
          defer.resolve(1);
        });
      });
      return defer.promise;
    }



    function checkSashInTemplate() {
      var templQty = ProductStor.product.template.details.length,
          counter = 0;
      while(--templQty > 0) {
        if(ProductStor.product.template.details[templQty].blockType === 'sash') {
          ++counter;
        }
      }
      return counter;
    }



    function setCurrentGlass(id) {
      if(id) {
        ProductStor.product.glass = fineItemById(id, GlobalStor.global.glasses);
      } else {
        //----- set default glass in ProductStor
        var tempGlassArr = GlobalStor.global.glassesAll.filter(function(item) {
          return item.profileId === ProductStor.product.profile.id;
        });
        //      console.log('tempGlassArr = ', tempGlassArr);
        if(tempGlassArr.length) {
          GlobalStor.global.glassTypes = angular.copy(tempGlassArr[0].glassTypes);
          GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
          ProductStor.product.glass = GlobalStor.global.glasses[0][0];
        }
      }

    }

    function setCurrentHardware(id) {
      if(id) {
        ProductStor.product.hardware = fineItemById(id, GlobalStor.global.hardwares);
      } else {
        //----- set default hardware in ProductStor
        if(GlobalStor.global.isSashesInTemplate) {
          ProductStor.product.hardware = GlobalStor.global.hardwares[0][0];
        }
      }
    }


    //--------- create object to send in server for price calculation
    function preparePrice(template, profileId, glassId, hardwareId) {
      var deferred = $q.defer();
      setBeadId(profileId).then(function(beadId) {
        var objXFormedPrice = {
              //cityId: UserStor.userInfo.city_id,
              currencyId: UserStor.userInfo.currencyId,
              profileId: profileId,
              glassId: glassId,
              hardwareId: hardwareId,
              hardwareColor: ProductStor.product.laminationInName,
              frameId: ProductStor.product.profile.rama_list_id,
              frameSillId: ProductStor.product.profile.rama_still_list_id,
              sashId: ProductStor.product.profile.stvorka_list_id,
              impostId: ProductStor.product.profile.impost_list_id,
              shtulpId:  ProductStor.product.profile.shtulp_list_id,
              beadId: beadId,

              framesSize: angular.copy(template.priceElements.framesSize),
              sashsSize: angular.copy(template.priceElements.sashsSize),
              beadsSize: angular.copy(template.priceElements.beadsSize),
              impostsSize: angular.copy(template.priceElements.impostsSize),
              shtulpsSize: angular.copy(template.priceElements.shtulpsSize),
              sashesBlock: angular.copy(template.priceElements.sashesBlock),
              glassSizes: angular.copy(template.priceElements.glassSizes),
              glassSquares: angular.copy(template.priceElements.glassSquares),
              frameSillSize: angular.copy(template.priceElements.frameSillSize)
            };

        //------- set Overall Dimensions
        ProductStor.product.templateWidth = 0;
        ProductStor.product.templateHeight = 0;
        var overallQty = ProductStor.product.template.details[0].overallDim.length;
        while(--overallQty > -1) {
          ProductStor.product.templateWidth += ProductStor.product.template.details[0].overallDim[overallQty].w;
          ProductStor.product.templateHeight += ProductStor.product.template.details[0].overallDim[overallQty].h;
        }

        console.log('objXFormedPrice+++++++', JSON.stringify(objXFormedPrice));

        console.log('START PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());

        //--------- get product price
        calculationPrice(objXFormedPrice).then(function() {
          deferred.resolve(1);
        });

        //------ calculate coeffs
        calculateCoeffs(objXFormedPrice);

      });
      return deferred.promise;
    }


    //------------ set Bead Id
    function setBeadId(profileId) {
      var defer = $q.defer();
        //------ find bead Id as to glass Depth and profile Id
        globalDB.selectLocalDB(globalDB.tablesLocalDB.beed_profile_systems.tableName, {'profile_system_id': profileId, "glass_width": ProductStor.product.glass.glass_width}).then(function (result) {
          if(result.length) {
            defer.resolve(result[0].list_id);
          } else {
            console.log('Error!!', result);
            defer.resolve(0);
          }
        });
      return defer.promise;
    }


    //---------- Price define
    function calculationPrice(obj) {
      var deferred = $q.defer();
      globalDB.calculationPrice(obj, function (result) {
        if(result.status){
//          console.log('price-------', result.data.price);

          ProductStor.product.templatePriceSELECT = GeneralServ.roundingNumbers(result.data.price);
          setProductPriceTOTAL();
          GlobalStor.global.isLoader = 0;
          console.log('FINISH PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());
        } else {
          console.log(result);
        }
        deferred.resolve('done');
      });
      return deferred.promise;
    }


    //---------- Coeffs define
    function calculateCoeffs(objXFormedPrice) {
      var overallQty = ProductStor.product.template.details[0].overallDim.length,
          constructionSquareTotal = 0,
          glassSquareTotal,
          prifileHeatCoeffTotal,
          glassHeatCoeffTotal;
      //------- total construction square define

      while(--overallQty > -1) {
        constructionSquareTotal += ProductStor.product.template.details[0].overallDim[overallQty].square;
      }
//      for (var item = 0; item < templateQty; item++) {
//        if(ProductStor.product.template.objects[item].type === "square") {
//          constructionSquareTotal = ProductStor.product.template.objects[item].squares.reduce(function(sum, elem) {
//            return sum + elem;
//          });
//        }
//      }
      //-------- total glasses square define
      glassSquareTotal = objXFormedPrice.glassSquares.reduce(function(sum, elem) {
        return sum + elem;
      });
      //-------- coeffs define
      prifileHeatCoeffTotal = ProductStor.product.profile.heat_coeff * (constructionSquareTotal - glassSquareTotal);
      if(ProductStor.product.glass.heat_coeff == 'null'){
        ProductStor.product.glass.heat_coeff = 1;
      }
      glassHeatCoeffTotal = ProductStor.product.glass.heat_coeff * glassSquareTotal;
      //-------- calculate Heat Coeff Total
      ProductStor.product.heatTransferTOTAL = GeneralServ.roundingNumbers( constructionSquareTotal/(prifileHeatCoeffTotal + glassHeatCoeffTotal) );

      //-------- calculate Air Coeff Total
      //ProductStor.product.airCirculationTOTAL = + ProductStor.product.profileAirCoeff + ProductStor.product.glassAirCoeff + ProductStor.product.hardwareAirCoeff;

    }



    function setProductPriceTOTAL() {
      //playSound('price');
//      ProductStor.product.productPriceTOTAL = GeneralServ.roundingNumbers( ProductStor.product.templatePriceSELECT + ProductStor.product.laminationPriceSELECT + ProductStor.product.addElementsPriceSELECT );
      ProductStor.product.productPriceTOTAL = GeneralServ.roundingNumbers( ProductStor.product.templatePriceSELECT + ProductStor.product.addElementsPriceSELECT );
//      ProductStor.product.productPriceTOTALDis = GeneralServ.roundingNumbers( ((ProductStor.product.templatePriceSELECT + ProductStor.product.laminationPriceSELECT) * (1 - OrderStor.order.currDiscount/100)) + ProductStor.product.addElementsPriceSELECTDis );
      ProductStor.product.productPriceTOTALDis = GeneralServ.roundingNumbers( (ProductStor.product.templatePriceSELECT * (1 - OrderStor.order.currDiscount/100)) + ProductStor.product.addElementsPriceSELECTDis );
      $rootScope.$apply();
    }


    function isAddElemExist() {
      var defer = $q.defer(),
          promises = globalDB.addElementDBId.map(function(item) {
            return globalDB.selectLocalDB(globalDB.tablesLocalDB.lists.tableName, {'list_group_id': item});
          });

      $q.all(promises).then(function (results) {
        console.log('iis Addelem ++++', results);
        var resultsQty = results.length;
        if (resultsQty) {
          GlobalStor.global.isAddElemExist = results.map(function(itme) {
            return (itme && itme.length) ? 1 : 0;
          });
        }
        defer.resolve(1);
      });
      return defer.promise;
    }


    function createNewProject() {
      console.log('new project!!!!!!!!!!!!!!');
      //------- set new orderId
      createOrderData();
      //------- set current Discounts
      setCurrDiscounts();
      //------- set new templates
      prepareTemplates(ProductStor.product.constructionType).then(function() {
        prepareMainPage();
        GlobalStor.global.isLoader = 0;
        GlobalStor.global.isChangedTemplate = false;
        GlobalStor.global.showRoomSelectorDialog = false;
        GlobalStor.global.isShowCommentBlock = false;
        GlobalStor.global.isCreatedNewProject = true;
        GlobalStor.global.isCreatedNewProduct = true;
        GlobalStor.global.activePanel =0;
        if(GlobalStor.global.currOpenPage !== 'main') {
          $location.path('/main');
        }
      });
    }



    function createNewProduct() {
      console.log('new product!!!!!!!!!!!!!!!');
      //------- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
      GlobalStor.global.isCreatedNewProduct = true;
      //------- set new templates
      prepareTemplates(ProductStor.product.constructionType).then(function() {
        prepareMainPage();
        if(GlobalStor.global.currOpenPage !== 'main') {
          $location.path('/main');
        }
      });
    }


    function setDefaultDoorConfig() {
      ProductStor.product.doorShapeId = 0;
      ProductStor.product.doorSashShapeId = 0;
      ProductStor.product.doorHandleShapeId = 0;
      ProductStor.product.doorLockShapeId = 0;
    }


    function prepareMainPage() {
      GlobalStor.global.isNavMenu = false;
      GlobalStor.global.isConfigMenu = true;
      //------ open Template Panel
      GlobalStor.global.activePanel = 1;
    }








    //========== SAVE PRODUCT ==========//

    //-------- Save Product in Order and go to Cart
    function inputProductInOrder() {
      var deferred = $q.defer();
      //---------- if EDIT Product
      if(GlobalStor.global.productEditNumber) {
        var productsQty = OrderStor.order.products.length,
            prod = 0;
        //-------- replace product in order LocalStorage
        for(; prod < productsQty; prod++) {
          if(prod === GlobalStor.global.productEditNumber) {
            OrderStor.order.products[prod] = angular.copy(ProductStor.product);
          }
        }
        editProductInLocalDB(ProductStor.product);
        GlobalStor.global.productEditNumber = 0;
      //---------- if New Product
      } else {
        //-------- add product in order LocalStor
//        ProductStor.product.orderId = OrderStor.order.orderId;
        ProductStor.product.productId = (OrderStor.order.productsQty > 0) ? (OrderStor.order.productsQty + 1) : 1;
        delete ProductStor.product.template;
        //-------- insert product in order
        OrderStor.order.products.push(ProductStor.product);
        OrderStor.order.productsQty = ProductStor.product.productId;
        insertProductInLocalDB(ProductStor.product).then(function() {
          //----- cleaning product
          ProductStor.product = ProductStor.setDefaultProduct();
          deferred.resolve('done');
        });
      }
      //----- finish working with product
      GlobalStor.global.isCreatedNewProduct = false;
      return deferred.promise;
    }



    //-------- save Order into Local DB
    function insertProductInLocalDB(product) {
      var deferred = $q.defer(),
          productData = {
            order_number: OrderStor.order.orderId,
            product_id: product.productId,
            is_addelem_only: product.isAddElementsONLY,
            room_id: product.roomId,
            construction_type: product.constructionType,
            template_id: product.templateId,
            template_source: JSON.stringify(product.templateSource),
            profile_id: product.profile.id,
            glass_id: product.glass.id,
            hardware_id: product.hardware.id,
            lamination_out_id: product.laminationOutId,
            lamination_in_id: product.laminationInId,
            door_shape_id: product.doorShapeId,
            door_sash_shape_id: product.doorSashShapeId,
            door_handle_shape_id: product.doorHandleShapeId,
            door_lock_shape_id: product.doorLockShapeId,
            heat_coef_min: product.heatTransferMin,
            heat_coef_total: product.heatTransferTOTAL,
            template_price: GeneralServ.roundingNumbers(product.templatePriceSELECT),
            addelem_price: GeneralServ.roundingNumbers(product.addElementsPriceSELECT),
            product_price: GeneralServ.roundingNumbers(product.productPriceTOTAL),
            comment: product.comment,
            product_qty: product.productQty
          },
          addElementsQty = product.chosenAddElements.length,
          addElementsData;

      console.log('!!!!!!!!!! product save !!!!!!!!!!!');
      console.log('!!!!!!!!!! product ', product);



      //-------- insert product into local DB
      globalDB.insertRowLocalDB(productData, globalDB.tablesLocalDB.order_products.tableName);
      deferred.resolve(1);
      //--------- insert additional elements into local DB
      for(var prop = 0; prop < addElementsQty; prop++) {
        var elementsQty = product.chosenAddElements[prop].length;
        if(elementsQty > 0) {
          for (var elem = 0; elem < elementsQty; elem++) {
            addElementsData = {
              order_number: OrderStor.order.orderId,
              product_id: product.productId,
              element_id: product.chosenAddElements[prop][elem].elementId,
              element_type: product.chosenAddElements[prop][elem].elementType,
              element_name: product.chosenAddElements[prop][elem].elementName,
              element_width: product.chosenAddElements[prop][elem].elementWidth,
              element_height: product.chosenAddElements[prop][elem].elementHeight,
              element_color: product.chosenAddElements[prop][elem].elementColor,
              element_price: product.chosenAddElements[prop][elem].elementPrice,
              element_qty: product.chosenAddElements[prop][elem].elementQty
            };
            globalDB.insertRowLocalDB(addElementsData, globalDB.tablesLocalDB.order_addelements.tableName);
          }
        }
      }
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


    function editProductInLocalDB(product) {
      console.log('!!!!Edit!!!!',product);
      localDB.deleteDB(localDB.productsTableBD, {'orderId': {"value": product.orderId, "union": 'AND'}, "productId": product.productId});
      localDB.deleteDB(localDB.addElementsTableBD, {'orderId': {"value": product.orderId, "union": 'AND'}, "productId": product.productId});
      insertProductInLocalDB(product);
    }




    //========== SAVE ORDER ==========//

    //-------- save Order into Local DB
    function insertOrderInLocalDB(newOptions, orderType, orderStyle) {
      //---------- if EDIT Order, before inserting delete old order
      if(GlobalStor.global.orderEditNumber) {
        deleteOrderFromLocalDB(GlobalStor.global.orderEditNumber);
        GlobalStor.global.orderEditNumber = 0;
      }
      OrderStor.order.orderType = orderType;
      OrderStor.order.orderStyle = orderStyle;
      angular.extend(OrderStor.order, newOptions);

      var prodQty = OrderStor.order.products.length;
        for(var p = 0; p < prodQty; p++) {
          var productData = {
            order_number: OrderStor.order.orderId,
            product_id: OrderStor.order.products[p].productId,
            is_addelem_only: OrderStor.order.products[p].isAddElementsONLY,
            room_id: OrderStor.order.products[p].roomId,
            construction_type: OrderStor.order.products[p].constructionType,
            template_id: OrderStor.order.products[p].templateId,
            template_source: JSON.stringify(OrderStor.order.products[p].templateSource),
            profile_id: OrderStor.order.products[p].profile.id,
            glass_id: OrderStor.order.products[p].glass.id,
            hardware_id: OrderStor.order.products[p].hardware.id,
            lamination_out_id: OrderStor.order.products[p].laminationOutId,
            lamination_in_id: OrderStor.order.products[p].laminationInId,
            door_shape_id: OrderStor.order.products[p].doorShapeId,
            door_sash_shape_id: OrderStor.order.products[p].doorSashShapeId,
            door_handle_shape_id: OrderStor.order.products[p].doorHandleShapeId,
            door_lock_shape_id: OrderStor.order.products[p].doorLockShapeId,
            heat_coef_min: OrderStor.order.products[p].heatTransferMin,
            heat_coef_total: OrderStor.order.products[p].heatTransferTOTAL,
            template_price: GeneralServ.roundingNumbers(OrderStor.order.products[p].templatePriceSELECT),
            addelem_price: GeneralServ.roundingNumbers(OrderStor.order.products[p].addElementsPriceSELECT),
            product_price: GeneralServ.roundingNumbers(OrderStor.order.products[p].productPriceTOTAL),
            comment: OrderStor.order.products[p].comment,
            product_qty: OrderStor.order.products[p].productQty
          };
          console.log('SEND PRODUCT------', productData);
          globalDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, globalDB.tablesLocalDB.order_products.tableName, productData);

          var addElemQty = OrderStor.order.products[p].chosenAddElements.length;
          for(var add = 0; add < addElemQty; add++) {
            var elemQty = OrderStor.order.products[p].chosenAddElements[add].length;
            if(elemQty > 0) {
              for (var elem = 0; elem < elemQty; elem++) {
                var addElementsData = {
                  order_number: OrderStor.order.orderId,
                  product_id: OrderStor.order.products[p].productId,
                  element_id: OrderStor.order.products[p].chosenAddElements[add][elem].elementId,
                  element_type: OrderStor.order.products[p].chosenAddElements[add][elem].elementType,
                  element_name: OrderStor.order.products[p].chosenAddElements[add][elem].elementName,
                  element_width: OrderStor.order.products[p].chosenAddElements[add][elem].elementWidth,
                  element_height: OrderStor.order.products[p].chosenAddElements[add][elem].elementHeight,
                  element_color: OrderStor.order.products[p].chosenAddElements[add][elem].elementColorId,
                  element_price: OrderStor.order.products[p].chosenAddElements[add][elem].elementPrice,
                  element_qty: OrderStor.order.products[p].chosenAddElements[add][elem].elementQty
                };
                console.log('SEND DOPP',addElementsData);
                globalDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, globalDB.tablesLocalDB.order_addelements.tableName, addElementsData);
              }
            }
          }
        }

      //------- save order in LocalDB
//      delete OrderStor.order.products;
      console.log('!!!!ORDER!!!!', OrderStor.order);
      var orderData = {
        order_number: OrderStor.order.orderId,
        order_date: new Date(OrderStor.order.orderDate),
        order_style: OrderStor.order.orderStyle,
        factory_id: UserStor.userInfo.factory_id,
        user_id: UserStor.userInfo.id,

        climatic_zone: OrderStor.order.currClimaticZone,
        full_location: OrderStor.order.currFullLocation,
        is_date_price_less: OrderStor.order.isDatePriceLess,
        is_date_price_more: OrderStor.order.isDatePriceMore,
        floor_id: 0,
        mounting_id: 0,
        is_instalment: OrderStor.order.isInstalment,
        instalment_id: 0,
        is_old_price: OrderStor.order.isOldPrice,

        delivery_date: new Date(OrderStor.order.deliveryDate),
        new_delivery_date: new Date(OrderStor.order.newDeliveryDate),
        delivery_price: OrderStor.order.deliveryPrice,
        mounting_price: OrderStor.order.selectedAssemblingPrice,
        products_price_total: OrderStor.order.productsPriceTOTAL,
        products_qty: OrderStor.order.productsQty,
        payment_first: OrderStor.order.paymentFirst,
        payment_monthly: OrderStor.order.paymentMonthly,
        payment_first_primary: OrderStor.order.paymentFirstPrimary,
        payment_monthly_primary: OrderStor.order.paymentMonthlyPrimary,
        order_price_total: OrderStor.order.orderPriceTOTAL,
        order_price_total_primary: OrderStor.order.orderPriceTOTALPrimary,
        discount_construct: OrderStor.order.currDiscount,
        discount_addelem: OrderStor.order.currDiscountAddElem,

        customer_name: OrderStor.order.name,
        customer_email: OrderStor.order.mail,
        customer_phone: OrderStor.order.phone,
        customer_phone_city: OrderStor.order.phone2,
        customer_address: OrderStor.order.address,
        customer_city: OrderStor.order.currCityName,
        customer_region: OrderStor.order.currRegionName,
        customer_country: OrderStor.order.currCountryName,
        customer_itn: OrderStor.order.itn,
        customer_starttime: OrderStor.order.starttime,
        customer_endtime: OrderStor.order.endtime,
        customer_target: OrderStor.order.target,
//        customer_sex: OrderStor.order.sex,
//        customer_age: OrderStor.order.age,
//        customer_education: OrderStor.order.education,
//        customer_occupation: OrderStor.order.occupation,
//        customer_infoSource: OrderStor.order.infoSource,
        customer_sex: 1,
        customer_age: 1,
        customer_education: 1,
        customer_occupation: 1,
        customer_infoSource: 1,

        additional_payment: '',
        created: new Date(),
        sended: new Date(0),
        state_to: new Date(0),
        state_buch: new Date(0),
        batch: '',
        square: 0,
        base_price: 0,
        perimeter: 0,
        factory_margin: 0,
        purchase_price: 0,
        sale_price: 0,
        modified: new Date()
      };

//      currCityId: 156
//      currHeatTransfer: 1.33
//      location: "Dnepropetrovsk, Днепропетровская"
//      selectedAssembling: "free"
//      selectedFloor: "free"
//      selectedFloorPrice: 0
//      selectedInstalmentPercent: 0
//      selectedInstalmentPeriod: 0


      globalDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, globalDB.tablesLocalDB.orders.tableName, orderData);
      globalDB.insertRowLocalDB(orderData, globalDB.tablesLocalDB.orders.tableName);

      //----- cleaning order
      OrderStor.order = OrderStor.setDefaultOrder();
      //------ set current GeoLocation
      loginServ.setUserGeoLocation(UserStor.userInfo.city_id, UserStor.userInfo.cityName, UserStor.userInfo.regionName, UserStor.userInfo.countryName, UserStor.userInfo.climaticZone, UserStor.userInfo.heatTransfer, UserStor.userInfo.fullLocation);
      //----- finish working with order
      GlobalStor.global.isCreatedNewProject = false;
    }



    //-------- delete order from LocalDB
    function deleteOrderFromLocalDB(orderNum) {
      localDB.deleteDB(localDB.ordersTableBD, {'orderId': orderNum});
      localDB.deleteDB(localDB.productsTableBD, {'orderId': orderNum});
      localDB.deleteDB(localDB.addElementsTableBD, {'orderId': orderNum});
    }



  }
})();

