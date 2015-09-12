(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory($rootScope, $location, $q, $filter, $timeout, globalConstants, localDB, GeneralServ, SVGServ, loginServ, optionsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      saveUserEntry: saveUserEntry,
      createOrderData: createOrderData,
      setCurrDiscounts: setCurrDiscounts,
      downloadAllElemAsGroup: downloadAllElemAsGroup,
      downloadAllGlasses: downloadAllGlasses,
      sortingGlasses: sortingGlasses,
      prepareTemplates: prepareTemplates,
      //downloadAllTemplates: downloadAllTemplates,
      downloadAllLamination: downloadAllLamination,

      setCurrentProfile: setCurrentProfile,
      setCurrentGlass: setCurrentGlass,
      setCurrentHardware: setCurrentHardware,
      parseTemplate: parseTemplate,
      saveTemplateInProduct: saveTemplateInProduct,
      checkSashInTemplate: checkSashInTemplate,
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
      deleteOrderInLocalDB: deleteOrderInLocalDB
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


    //------------- Create Order Id and Date
    function createOrderData() {
      var productDay;
      //----------- create order number for new project
      OrderStor.order.order_number = ''+Math.floor((Math.random() * 100000));
      //------ set delivery day
      productDay = new Date(OrderStor.order.order_date).getDate() + globalConstants.productionDays;
      OrderStor.order.delivery_date = new Date().setDate(productDay);
      OrderStor.order.new_delivery_date = angular.copy(OrderStor.order.delivery_date);
    }



    function setCurrDiscounts() {
      OrderStor.order.discount_construct = angular.copy(UserStor.userInfo.discountConstr);
      OrderStor.order.discount_addelem = angular.copy(UserStor.userInfo.discountAddElem);
//      console.log('CHECKING======', JSON.stringify(UserStor.userInfo.discountConstr));
    }





    //----------- get all elements as to groups

    function downloadAllElemAsGroup(tableGroup, tableElem, groups, elements) {
      var defer = $q.defer();
      //------- get all Prifile Folders
      localDB.selectLocalDB(tableGroup).then(function(result) {
        var types = result.reverse(),
            typesQty = types.length;
        if (typesQty) {
          angular.extend(groups, types);
          var promises = types.map(function(type) {
            var defer2 = $q.defer();
            localDB.selectLocalDB(tableElem, {'folder_id': type.id}).then(function (elem) {
              if (elem.length) {
                elements.push(angular.copy(elem));
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


//    function downloadElemImg() {
//      console.log('USER:', window.navigator);
//      console.log('USER:', window.navigator.userAgent); // regExp = Mobile
//      console.log('USER:', window.navigator.platform);
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
                localDB.selectLocalDB(localDB.tablesLocalDB.elements.tableName, {'id': item.element_id}).then(function (glass) {
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
                localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'parent_element_id': item.element_id}).then(function (list) {
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
        GlobalStor.global.glassesAll[g].glassTypes = angular.copy(newGlassesType.reverse());
        GlobalStor.global.glassesAll[g].glasses = angular.copy(newGlasses.reverse());
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
      ProductStor.product.template_source = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
      //----- create template
      SVGServ.createSVGTemplate(ProductStor.product.template_source, GlobalStor.global.profileDepths).then(function(result) {
        ProductStor.product.template = angular.copy(result);
        GlobalStor.global.isSashesInTemplate = checkSashInTemplate();
//        console.log('TEMPLATE +++', ProductStor.product.template);
        //----- create template icon
        SVGServ.createSVGTemplateIcon(ProductStor.product.template_source, GlobalStor.global.profileDepths).then(function(result) {
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

//        console.log('objXFormedPrice+++++++', JSON.stringify(objXFormedPrice));

//        console.log('START PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());

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
        localDB.selectLocalDB(localDB.tablesLocalDB.beed_profile_systems.tableName, {'profile_system_id': profileId, "glass_width": ProductStor.product.glass.glass_width}).then(function (result) {
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
      localDB.calculationPrice(obj, function (result) {
        if(result.status){
//          console.log('price-------', result.data.price);

          ProductStor.product.template_price = GeneralServ.roundingNumbers(result.data.price);
          setProductPriceTOTAL();
          GlobalStor.global.isLoader = 0;
//          console.log('FINISH PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());
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
      ProductStor.product.heat_coef_total = GeneralServ.roundingNumbers( constructionSquareTotal/(prifileHeatCoeffTotal + glassHeatCoeffTotal) );

      //-------- calculate Air Coeff Total
      //ProductStor.product.airCirculationTOTAL = + ProductStor.product.profileAirCoeff + ProductStor.product.glassAirCoeff + ProductStor.product.hardwareAirCoeff;

    }



    function setProductPriceTOTAL() {
      //playSound('price');
//      ProductStor.product.product_price = GeneralServ.roundingNumbers( ProductStor.product.template_price + ProductStor.product.laminationPriceSELECT + ProductStor.product.addelem_price );
      ProductStor.product.product_price = GeneralServ.roundingNumbers( ProductStor.product.template_price + ProductStor.product.addelem_price );
//      ProductStor.product.productPriceTOTALDis = GeneralServ.roundingNumbers( ((ProductStor.product.template_price + ProductStor.product.laminationPriceSELECT) * (1 - OrderStor.order.currDiscount/100)) + ProductStor.product.addElementsPriceSELECTDis );
      ProductStor.product.productPriceTOTALDis = GeneralServ.roundingNumbers( (ProductStor.product.template_price * (1 - OrderStor.order.discount_construct/100)) + ProductStor.product.addElementsPriceSELECTDis );
      $rootScope.$apply();
    }


    function isAddElemExist() {
      var defer = $q.defer(),
          promises = localDB.addElementDBId.map(function(item) {
            return localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'list_group_id': item});
          });

      $q.all(promises).then(function (results) {
//        console.log('iis Addelem ++++', results);
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






    //========== CREATE ORDER ==========//

    function createNewProject() {
      console.log('new project!!!!!!!!!!!!!!');
      //------- set new orderId
      createOrderData();
      //------- set current Discounts
      setCurrDiscounts();
      //------- set new templates
      prepareTemplates(ProductStor.product.construction_type).then(function() {
        prepareMainPage();
        GlobalStor.global.isLoader = 0;
        GlobalStor.global.isChangedTemplate = 0;
        GlobalStor.global.isShowCommentBlock = 0;
        GlobalStor.global.isCreatedNewProject = 1;
        GlobalStor.global.isCreatedNewProduct = 1;
        if(GlobalStor.global.currOpenPage !== 'main') {
          $location.path('/main');
        }
      });
    }






    //========== CREATE PRODUCT ==========//

    function createNewProduct() {
      console.log('new product!!!!!!!!!!!!!!!');
      //------- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
      GlobalStor.global.isCreatedNewProduct = true;
      //------- set new templates
      prepareTemplates(ProductStor.product.construction_type).then(function() {
        prepareMainPage();
        if(GlobalStor.global.currOpenPage !== 'main') {
          $location.path('/main');
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
      GlobalStor.global.showRoomSelectorDialog = 1;
    }








    //========== SAVE PRODUCT ==========//

    //-------- Save Product in Order and go to Cart
    function inputProductInOrder() {
      var deferred = $q.defer();
      GlobalStor.global.configMenuTips = 0;

      //---------- if EDIT Product
      if(GlobalStor.global.productEditNumber) {
        var productsQty = OrderStor.order.products.length;
        //-------- replace product in order LocalStorage
        for(var prod = 0; prod < productsQty; prod++) {
          if(prod === GlobalStor.global.productEditNumber) {
            OrderStor.order.products[prod] = angular.copy(ProductStor.product);
          }
        }
        //TODO editProductInLocalDB(ProductStor.product);
        GlobalStor.global.productEditNumber = 0;

      //---------- if New Product
      } else {
        //-------- add product in order LocalStor
//        ProductStor.product.orderId = OrderStor.order.orderId;
        ProductStor.product.product_id = (OrderStor.order.products_qty > 0) ? (OrderStor.order.products_qty + 1) : 1;
        delete ProductStor.product.template;
        //-------- insert product in order
        OrderStor.order.products.push(ProductStor.product);
        OrderStor.order.products_qty = ProductStor.product.product_id;
        //TODO insertProductInLocalDB(ProductStor.product).then(function() {
          deferred.resolve(1);
//        });
      }
      //----- finish working with product
      GlobalStor.global.isCreatedNewProduct = false;
      return deferred.promise;
    }


//TODO
    //-------- save Order into Local DB
//    function insertProductInLocalDB(product) {
//      var deferred = $q.defer(),
//          productData = angular.copy(product),
//          addElementsQty = product.chosenAddElements.length;
//
//      productData.order_number = OrderStor.order.order_number;
//      productData.template_source = JSON.stringify(product.template_source);
//      productData.profile_id = product.profile.id;
//      productData.glass_id = product.glass.id;
//      productData.hardware_id = product.hardware.id;
//      productData.modified = new Date();
//      delete productData.templateIndex; //TODO delete
//      delete productData.templateIcon;
//      delete productData.templateWidth;
//      delete productData.templateHeight;
//      delete productData.profile;
//      delete productData.glass;
//      delete productData.hardware;
//      delete productData.laminationOutName;
//      delete productData.laminationInName;
//      delete productData.chosenAddElements;
//      delete productData.addElementsPriceSELECTDis;
//      delete productData.productPriceTOTALDis;
//
//      console.log('!!!!!!!!!! product save !!!!!!!!!!!');
//      console.log('!!!!!!!!!! product ', product);
//
//
//
//      //-------- insert product into local DB
//      localDB.insertRowLocalDB(productData, localDB.tablesLocalDB.order_products.tableName);
//      deferred.resolve(1);
//      //--------- insert additional elements into local DB
//      for(var prop = 0; prop < addElementsQty; prop++) {
//        var elementsQty = product.chosenAddElements[prop].length;
//        if(elementsQty > 0) {
//          for (var elem = 0; elem < elementsQty; elem++) {
//            var addElementsData = angular.copy(product.chosenAddElements[prop][elem]);
//
//            addElementsData.order_number = OrderStor.order.order_number;
//            addElementsData.product_id = product.product_id;
//            addElementsData.modified = new Date();
//            delete addElementsData.elementPriceDis;
//            delete addElementsData.element_name;
//
//            localDB.insertRowLocalDB(addElementsData, localDB.tablesLocalDB.order_addelements.tableName);
//          }
//        }
//      }
//      return deferred.promise;
//    }

    //--------- moving to Cart when click on Cart button
    function goToCart() {
      $timeout(function() {
        //------- set previos Page
        GeneralServ.setPreviosPage();
        $location.path('/cart');
      }, 100);
    }

//TODO
//    function editProductInLocalDB(product) {
//      console.log('!!!!Edit!!!!',product);
//      localDB.deleteDB(localDB.productsTableBD, {'orderId': {"value": product.orderId, "union": 'AND'}, "productId": product.productId});
//      localDB.deleteDB(localDB.addElementsTableBD, {'orderId': {"value": product.orderId, "union": 'AND'}, "productId": product.productId});
//      insertProductInLocalDB(product);
//    }




    //========== SAVE ORDER ==========//

    //-------- save Order into Local DB
    function insertOrderInLocalDB(newOptions, orderType, orderStyle) {
      //---------- if EDIT Order, before inserting delete old order
      if(GlobalStor.global.orderEditNumber) {
        deleteOrderInLocalDB(GlobalStor.global.orderEditNumber);
        GlobalStor.global.orderEditNumber = 0;
      }
      angular.extend(OrderStor.order, newOptions);

      var prodQty = OrderStor.order.products.length;
        for(var p = 0; p < prodQty; p++) {

          var productData = angular.copy(OrderStor.order.products[p]);
          productData.order_number = OrderStor.order.order_number;
          productData.template_source = JSON.stringify(OrderStor.order.products[p].template_source);
          productData.profile_id = OrderStor.order.products[p].profile.id;
          productData.glass_id = OrderStor.order.products[p].glass.id;
          productData.hardware_id = OrderStor.order.products[p].hardware.id;
          productData.modified = new Date();
          delete productData.templateIndex; //TODO delete
          delete productData.templateIcon;
          delete productData.templateWidth;
          delete productData.templateHeight;
          delete productData.profile;
          delete productData.glass;
          delete productData.hardware;
          delete productData.laminationOutName;
          delete productData.laminationInName;
          delete productData.chosenAddElements;
          delete productData.addElementsPriceSELECTDis;
          delete productData.productPriceTOTALDis;

          console.log('SEND PRODUCT------', productData);
          //-------- insert product into local DB
          localDB.insertRowLocalDB(productData, localDB.tablesLocalDB.order_products.tableName);
          //-------- send to Server
          localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.order_products.tableName, productData);



          var addElemQty = OrderStor.order.products[p].chosenAddElements.length;
          for(var add = 0; add < addElemQty; add++) {
            var elemQty = OrderStor.order.products[p].chosenAddElements[add].length;
            if(elemQty > 0) {
              for (var elem = 0; elem < elemQty; elem++) {
                var addElementsData = angular.copy(OrderStor.order.products[p].chosenAddElements[add][elem]);
                addElementsData.order_number = OrderStor.order.order_number;
                addElementsData.product_id = OrderStor.order.products[p].product_id;
                addElementsData.modified = new Date();
                delete addElementsData.elementPriceDis;
                delete addElementsData.element_name;

                console.log('SEND ADD',addElementsData);
                localDB.insertRowLocalDB(addElementsData, localDB.tablesLocalDB.order_addelements.tableName);
                localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.order_addelements.tableName, addElementsData);
              }
            }
          }


        }

      //------- save order in LocalDB
//      delete OrderStor.order.products;
      console.log('!!!!ORDER!!!!', OrderStor.order);
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

      orderData.additional_payment = '';
      orderData.created = new Date();
      orderData.sended = new Date(0);
      orderData.state_to = new Date(0);
      orderData.state_buch = new Date(0);
      orderData.batch = '';
      orderData.square = 0;
      orderData.base_price = 0;
      orderData.perimeter = 0;
      orderData.factory_margin = 0;
      orderData.purchase_price = 0;
      orderData.sale_price = 0;
      orderData.modified = new Date();

      delete orderData.products;
      delete orderData.currCityId;
      delete orderData.currRegionName;
      delete orderData.currCountryName;
      delete orderData.currFullLocation;
      delete orderData.orderPriceTOTALDis;
      delete orderData.selectedInstalmentPeriod;
      delete orderData.selectedInstalmentPercent;

      console.log('!!!!orderData!!!!', orderData);
      localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.orders.tableName, orderData);
      localDB.insertRowLocalDB(orderData, localDB.tablesLocalDB.orders.tableName);

      //----- cleaning order
      OrderStor.order = OrderStor.setDefaultOrder();
      //------ set current GeoLocation
      loginServ.setUserGeoLocation(UserStor.userInfo.city_id, UserStor.userInfo.cityName, UserStor.userInfo.regionName, UserStor.userInfo.countryName, UserStor.userInfo.climaticZone, UserStor.userInfo.heatTransfer, UserStor.userInfo.fullLocation);
      //----- finish working with order
      GlobalStor.global.isCreatedNewProject = false;
    }



    //-------- delete order from LocalDB
    function deleteOrderInLocalDB(orderNum) {
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.orders.tableName, {'order_number': orderNum});
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_number': orderNum});
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_number': orderNum});
    }



  }
})();
