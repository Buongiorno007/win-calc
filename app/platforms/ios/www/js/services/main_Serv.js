(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory($rootScope, $location, $q,$http, $filter, $timeout, globalConstants, globalDB, localDB, GeneralServ, SVGServ, loginServ, optionsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisFactory = this;

    //TODO move to GlobalDB
    var profilesSource = [
      {
        profileDescrip: '4 камеры', //cameras
        profileNoise: 4, // noise_coeff
        heatCoeff: 0.8, // heat_coeff
        airCoeff: 10 // air_coeff
      },
      {
        profileDescrip: '4 камеры',
        profileNoise: 4,
        heatCoeff: 0.82,
        airCoeff: 11
      },
      {
        profileDescrip: '5 камер',
        profileNoise: 5,
        heatCoeff: 0.84,
        airCoeff: 9
      },
      {
        profileDescrip: '4 камеры',
        profileNoise: 4,
        heatCoeff: 0.71,
        airCoeff: 8
      },
      {
        profileDescrip: '3 камеры',
        profileNoise: 3,
        heatCoeff: 0.8,
        airCoeff: 8
      }
    ];

    thisFactory.publicObj = {
      createOrderData: createOrderData,
      setCurrDiscounts: setCurrDiscounts,
      downloadAllProfiles: downloadAllProfiles,
      prepareTemplates: prepareTemplates,
      //downloadAllHardwares: downloadAllHardwares,

      setCurrentProfile: setCurrentProfile,
      //downloadAllTemplates: downloadAllTemplates,
      parseTemplate: parseTemplate,
      saveTemplateInProduct: saveTemplateInProduct,
      setCurrentGlass: setCurrentGlass,
      setCurrentHardware: setCurrentHardware,
      preparePrice: preparePrice,
      setProductPriceTOTAL: setProductPriceTOTAL,
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
      var deferred = $q.defer();
      globalDB.selectLocalDB(globalDB.tablesLocalDB.profile_system_folders.tableName).then(function(result) {
//      globalDB.selectAllDBGlobal(globalDB.profileTypeTableDBGlobal).then(function (result) {
        if (result) {
          var resultQty = result.rows.length,
              countries;
          if(resultQty) {
            GlobalStor.global.profilesType = angular.copy(result.rows);
            //-------- get all Countries
            globalDB.selectLocalDB(globalDB.tablesLocalDB.countries.tableName).then(function(result) {
//            globalDB.selectAllDBGlobal(globalDB.countriesTableDBGlobal).then(function (result) {
              if (result) {
                if (result.rows.length){
                  countries = result.rows;
                }
              }
            }).then(function () {

              for (var i = 0; i < resultQty; i++) {
                //              globalDB.selectDBGlobal(globalDB.profileTableDBGlobal, {'profile_system_folder_id': result[i].id}).then(function (result) {
                globalDB.selectLocalDB(globalDB.tablesLocalDB.profile_systems.tableName, {'profile_system_folder_id': result.rows.item(i).id}).then(function (result) {
                  if (result) {
                    var tempProf = angular.copy(result.rows), profileQty = tempProf.length;
                    if (profileQty) {
                      //---- set countryName for each profile & adding absented elements
                      for (var j = 0; j < profileQty; j++) {
//                        angular.extend(tempProf[j], profilesSource[j]);
                        for (var st = 0; st < countries.length; st++) {
                          if (tempProf[j].country == countries[st].id) {
                            tempProf[j].countryName = countries[st].name;
                          }
                        }
                      }
                      GlobalStor.global.profiles.push(tempProf);
                      deferred.resolve('done!');
                    }
                  }
                });
              }

            });
          }
        }
      });
      return deferred.promise;
    }

    //    function downloadAllHardwares() {
    //      globalDB.selectDBGlobal(globalDB.hardwareTypeTableDBGlobal, {'is_in_calculation': 1}).then(function (result) {
    //        if(result) {
    //          GlobalStor.global.hardwareTypes = angular.copy(results.data.hardwaresTypes);
    //          GlobalStor.global.hardwares = angular.copy(results.data.hardwares);
    //
    //          //----- set default hardware in ProductStor
    //          ProductStor.product.hardwareId = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].id;
    //          ProductStor.product.hardwareName = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].name;
    //          ProductStor.product.hardwareHeatCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].heat_сoeff;
    //          ProductStor.product.hardwareAirCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].air_сoeff;
    //        }
    //      });
    //    }

    function prepareTemplates(type) {
      var deferred = $q.defer();
      GlobalStor.global.isLoader = 1;
      downloadAllTemplates(type).then(function(data) {
        if(data) {
          GlobalStor.global.templatesSourceSTORE = angular.copy(data);
          GlobalStor.global.templatesSource = angular.copy(data);

          //--------- set current profile in ProductStor
          setCurrentProfile().then(function(){
            parseTemplate().then(function() {
              deferred.resolve('done');
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
    function setCurrentProfile() {
      var deferred = $q.defer();
      ProductStor.product.profileId = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].id;
      ProductStor.product.profileName = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].name;
      ProductStor.product.profileHeatCoeff = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].heat_сoeff;
      ProductStor.product.profileAirCoeff = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].air_сoeff;
      ProductStor.product.profileFrameId = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].rama_list_id;
      ProductStor.product.profileFrameStillId = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].rama_still_list_id;
      ProductStor.product.profileSashId = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].stvorka_list_id;
      ProductStor.product.profileImpostId = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].impost_list_id;
      ProductStor.product.profileShtulpId = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].shtulp_list_id;
      //------- set Depths
      $q.all([
        downloadProfileDepth(ProductStor.product.profileFrameId),
        downloadProfileDepth(ProductStor.product.profileFrameStillId),
        downloadProfileDepth(ProductStor.product.profileSashId),
        downloadProfileDepth(ProductStor.product.profileImpostId),
        downloadProfileDepth(ProductStor.product.profileShtulpId)
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


    function downloadProfileDepth(elementId) {
      return globalDB.selectLocalDB(globalDB.tablesLocalDB.lists.tableName, {'id': elementId}).then(function(result) {
        var resultObj = {};
        if (result && result.rows.length) {
          resultObj.a = result.rows.item(0).a;
          resultObj.b = result.rows.item(0).b;
          resultObj.c = result.rows.item(0).c;
          resultObj.d = result.rows.item(0).d;
        }
        return resultObj;
      });
    }




    function parseTemplate() {
      var deferred = $q.defer();
      //------- set current template for product
      saveTemplateInProduct(ProductStor.product.templateIndex).then(function() {
        setCurrentGlass();
        setCurrentHardware();
        preparePrice(ProductStor.product.template, ProductStor.product.profileId, ProductStor.product.glassId, ProductStor.product.hardwareId).then(function() {
          deferred.resolve('done');
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
        //----- create template icon
        SVGServ.createSVGTemplateIcon(ProductStor.product.templateSource, GlobalStor.global.profileDepths).then(function(result) {
          ProductStor.product.templateIcon = angular.copy(result);
          defer.resolve('done');
        });
      });
      return defer.promise;
    }



    function setCurrentGlass() {
      //----- set default glass in ProductStor
      ProductStor.product.glassId = GlobalStor.global.glasses[ProductStor.product.glassTypeIndex][ProductStor.product.glassIndex].glassId;
      ProductStor.product.glassName = GlobalStor.global.glasses[ProductStor.product.glassTypeIndex][ProductStor.product.glassIndex].glassName;
      ProductStor.product.glassHeatCoeff = GlobalStor.global.glasses[ProductStor.product.glassTypeIndex][ProductStor.product.glassIndex].heatCoeff;
      ProductStor.product.glassAirCoeff = GlobalStor.global.glasses[ProductStor.product.glassTypeIndex][ProductStor.product.glassIndex].airCoeff;
    }

    function setCurrentHardware() {
      //----- set default hardware in ProductStor
      ProductStor.product.hardwareId = GlobalStor.global.hardwares[ProductStor.product.hardwareTypeIndex][ProductStor.product.hardwareIndex].hardwareId;
      ProductStor.product.hardwareName = GlobalStor.global.hardwares[ProductStor.product.hardwareTypeIndex][ProductStor.product.hardwareIndex].hardwareName;
      ProductStor.product.hardwareHeatCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareTypeIndex][ProductStor.product.hardwareIndex].heatCoeff;
      ProductStor.product.hardwareAirCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareTypeIndex][ProductStor.product.hardwareIndex].airCoeff;
    }


    //--------- create object to send in server for price calculation
    function preparePrice(template, profileId, glassId, hardwareId) {
      var deferred = $q.defer();
      setBeadId(profileId, glassId).then(function(beadId) {
        var objXFormedPrice = {
              //cityId: UserStor.userInfo.city_id,
              currencyId: UserStor.userInfo.currencyId,
              profileId: profileId,
              glassId: glassId,
              hardwareId: hardwareId,
              hardwareColor: ProductStor.product.laminationInName,
              frameId: ProductStor.product.profileFrameId,
              frameSillId: ProductStor.product.profileFrameStillId,
              sashId: ProductStor.product.profileSashId,
              impostId: ProductStor.product.profileImpostId,
              shtulpId:  ProductStor.product.profileShtulpId,
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

        console.log('START PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());

        //--------- get product price
        calculationPrice(objXFormedPrice).then(function() {
          deferred.resolve('done');
        });

        //------ calculate coeffs
        calculateCoeffs(objXFormedPrice);

      });
      return deferred.promise;
    }


    //------------ set Bead Id
    function setBeadId(profileId, glassId) {
      var deferred = $q.defer(),
          parentId, glassDepth;
      //------ define Bead Id for define template price
      globalDB.selectLocalDB(globalDB.tablesLocalDB.lists.tableName, {'id': glassId}).then(function(result) {
        if(result) {
          if(result.rows.length) {
            parentId = result.rows.item(0).parent_element_id;
            //------ find glass depth
            globalDB.selectLocalDB(globalDB.tablesLocalDB.elements.tableName, {'id': parentId}).then(function (result) {
              if (result) {
                if(result.rows.length) {
                  glassDepth = result.rows.item(0).glass_width;
                  //------ find bead Id as to glass Depth and profile Id
                  globalDB.selectLocalDB(globalDB.tablesLocalDB.beed_profile_systems.tableName, {'profile_system_id': profileId, "glass_width": glassDepth}).then(function (result) {
                    if (result) {
                      if(result.rows.length) {
                        //ProductStor.product.beadId = result.rows.item(0).list_id;
                        deferred.resolve(result.rows.item(0).list_id);
                      }
                    } else {
                      console.log('Error!!', result);
                    }
                  });
                }
              } else {
                console.log(result);
              }
            });
          }
        } else {
          console.log(result);
        }
      });
      return deferred.promise;
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
      prifileHeatCoeffTotal = ProductStor.product.profileHeatCoeff * (constructionSquareTotal - glassSquareTotal);
      glassHeatCoeffTotal = ProductStor.product.glassHeatCoeff * glassSquareTotal;
      //-------- calculate Heat Coeff Total
      ProductStor.product.heatTransferTOTAL = GeneralServ.roundingNumbers( constructionSquareTotal/(prifileHeatCoeffTotal + glassHeatCoeffTotal) );

      //-------- calculate Air Coeff Total
      //ProductStor.product.airCirculationTOTAL = + ProductStor.product.profileAirCoeff + ProductStor.product.glassAirCoeff + ProductStor.product.hardwareAirCoeff;

    }



    function setProductPriceTOTAL() {
      //playSound('price');
      ProductStor.product.productPriceTOTAL = GeneralServ.roundingNumbers( ProductStor.product.templatePriceSELECT + ProductStor.product.laminationPriceSELECT + ProductStor.product.addElementsPriceSELECT );
      ProductStor.product.productPriceTOTALDis = GeneralServ.roundingNumbers( ((ProductStor.product.templatePriceSELECT + ProductStor.product.laminationPriceSELECT) * (1 - OrderStor.order.currDiscount/100)) + ProductStor.product.addElementsPriceSELECTDis );
      $rootScope.$apply();
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
        //-------- add product in order LocalStorage
        ProductStor.product.orderId = OrderStor.order.orderId;
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
          productData = angular.copy(product),
          addElementsQty = product.chosenAddElements.length,
          prop = 0, addElementsData;

      console.log('!!!!!!!!!! product save !!!!!!!!!!!');
      //-------- insert product into local DB
      productData.heatTransferMin = OrderStor.order.currHeatTransfer;
      productData.templateSource = JSON.stringify(product.templateSource);
      productData.laminationPriceSELECT =  GeneralServ.roundingNumbers(product.laminationPriceSELECT);
      productData.addElementsPriceSELECT =  GeneralServ.roundingNumbers(product.addElementsPriceSELECT);
      productData.productPriceTOTAL =  GeneralServ.roundingNumbers(product.productPriceTOTAL);
      delete productData.template;
      delete productData.templateIcon;
      delete productData.chosenAddElements;
      delete productData.profileFrameId;
      delete productData.profileFrameStillId;
      delete productData.profileSashId;
      delete productData.profileImpostId;
      delete productData.profileShtulpId;
      delete productData.productPriceTOTALDis;
      delete productData.addElementsPriceSELECTDis;

      localDB.insertDB(localDB.productsTableBD, productData);
      deferred.resolve('done');
      //--------- insert additional elements into local DB
      for(; prop < addElementsQty; prop++) {
        var elementsQty = product.chosenAddElements[prop].length,
            elem = 0;
        if(elementsQty > 0) {
          for (; elem < elementsQty; elem++) {
            addElementsData = {
              "orderId": product.orderId,
              "productId": product.productId,
              "elementId": product.chosenAddElements[prop][elem].elementId,
              "elementType": product.chosenAddElements[prop][elem].elementType,
              "elementName": product.chosenAddElements[prop][elem].elementName,
              "elementWidth": product.chosenAddElements[prop][elem].elementWidth,
              "elementHeight": product.chosenAddElements[prop][elem].elementHeight,
              "elementColor": product.chosenAddElements[prop][elem].elementColor,
              "elementPrice": product.chosenAddElements[prop][elem].elementPrice,
              "elementQty": product.chosenAddElements[prop][elem].elementQty
            };
            localDB.insertDB(localDB.addElementsTableBD, addElementsData);
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
      //------- save order in LocalDB
      delete OrderStor.order.products;
      localDB.insertDB(localDB.ordersTableBD, OrderStor.order);
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