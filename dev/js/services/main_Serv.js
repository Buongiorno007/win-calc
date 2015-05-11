(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory($rootScope, $location, $q, $timeout, $filter, $cordovaProgress, globalConstants, globalDB, localDB, GeneralServ, optionsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisFactory = this;

    //TODO move to GlobalDB
    var profilesSource = [
      {
        profileDescrip: '4 камеры',
        profileNoise: 4,
        heatCoeff: 3,
        airCoeff: 10
      },
      {
        profileDescrip: '4 камеры',
        profileNoise: 4,
        heatCoeff: 4,
        airCoeff: 11
      },
      {
        profileDescrip: '5 камер',
        profileNoise: 5,
        heatCoeff: 5,
        airCoeff: 9
      },
      {
        profileDescrip: '4 камеры',
        profileNoise: 4,
        heatCoeff: 2,
        airCoeff: 8
      },
      {
        profileDescrip: '3 камеры',
        profileNoise: 3,
        heatCoeff: 2,
        airCoeff: 8
      }
    ];

    thisFactory.publicObj = {
      createOrderData: createOrderData,
      downloadAllProfiles: downloadAllProfiles,
      prepareTemplates: prepareTemplates,
      //downloadAllHardwares: downloadAllHardwares,

      setCurrentProfile: setCurrentProfile,
      //downloadAllTemplates: downloadAllTemplates,
      parseTemplate: parseTemplate,
      saveTemplateInProduct: saveTemplateInProduct,
      preparePrice: preparePrice,
      setProductPriceTOTAL: setProductPriceTOTAL,
      createNewProject: createNewProject,
      createNewProduct: createNewProduct,
      setDefaultDoorConfig: setDefaultDoorConfig,
      prepareMainPage: prepareMainPage,

      inputProductInOrder: inputProductInOrder,
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



    //----------- get all profiles
    function downloadAllProfiles() {
      var deferred = $q.defer();
      globalDB.selectAllDBGlobal(globalDB.profileTypeTableDBGlobal).then(function (result) {
        if (result) {
          var resultQty = result.length,
              countries;
          GlobalStor.global.profilesType = angular.copy(result);
          //-------- get all Countries
          globalDB.selectAllDBGlobal(globalDB.countriesTableDBGlobal).then(function (result) {
            if (result) {
              countries = result;
            }
          }).then(function () {

            for (var i = 0; i < resultQty; i++) {
              globalDB.selectDBGlobal(globalDB.profileTableDBGlobal, {'profile_system_folder_id': result[i].id}).then(function (result) {
                if (result) {
                  var tempProf = angular.copy(result),
                      profileQty = tempProf.length,
                      j = 0;

                  //---- set countryName for each profile & adding absented elements
                  for (; j < profileQty; j++) {
                    angular.extend(tempProf[j], profilesSource[j]);
                    for (var st = 0; st < countries.length; st++) {
                      if (tempProf[j].country == countries[st].id) {
                        tempProf[j].country = countries[st].name;
                      }
                    }
                  }
                  GlobalStor.global.profiles.push(tempProf);
                  deferred.resolve('done!');
                }
              });
            }

          });
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
    //          ProductStor.product.hardwareId = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].hardwareId;
    //          ProductStor.product.hardwareName = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].hardwareName;
    //          ProductStor.product.hardwareHeatCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].heatCoeff;
    //          ProductStor.product.hardwareAirCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].airCoeff;
    //        }
    //      });
    //    }

    function prepareTemplates(type) {
      //$cordovaProgress.showSimple(true);
      downloadAllTemplates(type).then(function(data) {
        if(data) {
          GlobalStor.global.templatesSourceSTORE = angular.copy(data);
          GlobalStor.global.templatesSource = angular.copy(data);

          //--------- set current profile in ProductStor
          setCurrentProfile().then(function(){
            //console.log('++++profileDepths+++++', JSON.stringify(GlobalStor.global.profileDepths));
            parseTemplate();

          });

        } else {
          console.log('error!');
        }
      });

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
      ProductStor.product.profileHeatCoeff = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].heatCoeff;
      ProductStor.product.profileAirCoeff = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].airCoeff;
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
      return globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'id': elementId}).then(function(result) {
        var resultObj = {};
        if (result) {
          resultObj.a = result[0].a;
          resultObj.b = result[0].b;
          resultObj.c = result[0].c;
          resultObj.d = result[0].d;
        }
        return resultObj;
      });
    }




    function parseTemplate() {

      //--------- cleaning old templates
      GlobalStor.global.templates.length = 0;
      GlobalStor.global.templatesIcon.length = 0;

      var templatesQty = GlobalStor.global.templatesSource.length;
      for(var tem = 0; tem < templatesQty; tem++) {
        GlobalStor.global.templates.push( new Template(GlobalStor.global.templatesSource[tem], GlobalStor.global.profileDepths) );
        GlobalStor.global.templatesIcon.push( new TemplateIcon(GlobalStor.global.templatesSource[tem], GlobalStor.global.profileDepths) );
      }

      //-------- Save Template Arrays in Store
      //if(GlobalStor.global.startProgramm) {
        GlobalStor.global.templatesSTORE = angular.copy(GlobalStor.global.templates);
        GlobalStor.global.templatesIconSTORE = angular.copy(GlobalStor.global.templatesIcon);
      //}

      //------- set current template for product
      saveTemplateInProduct(ProductStor.product.templateIndex);

      preparePrice(ProductStor.product.template, ProductStor.product.profileId, ProductStor.product.glassId, ProductStor.product.hardwareId);

    }



    function saveTemplateInProduct(templateIndex) {
      ProductStor.product.templateSource = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
      ProductStor.product.template = angular.copy(GlobalStor.global.templates[templateIndex]);
      ProductStor.product.templateIcon = angular.copy(GlobalStor.global.templatesIcon[templateIndex]);
    }



    //--------- create object to send in server for price calculation
    function preparePrice(template, profileId, glassId, hardwareId) {
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

              framesSize: [],
              sashsSize: [],
              beadsSize: [],
              impostsSize: [],
              shtulpsSize: [],
              sashesBlock: [],
              glassSizes: [],
              glassSquares: [],
              frameSillSize: 0
            },
            templateElemQty = template.objects.length,
            item = 0;
        for(; item < templateElemQty; item++) {
          if (template.objects[item].type) {
            switch (template.objects[item].type) {
              case 'frame_line':
                objXFormedPrice.framesSize.push(template.objects[item].lengthVal);
                if (template.objects[item].sill) {
                  objXFormedPrice.frameSillSize = template.objects[item].lengthVal;
                }
                break;
              case 'impost':
                objXFormedPrice.impostsSize.push(template.objects[item].parts[0].lengthVal);
                break;
              case 'sash':
                objXFormedPrice.sashsSize.push(template.objects[item].parts[0].lengthVal);
                break;
              case 'bead_line':
                objXFormedPrice.beadsSize.push(template.objects[item].lengthVal);
                break;
              case 'sash_block':
                var tempSashBlock = {},
                    tempSashBlockSize = [];
                for (var sash = 0; sash < template.objects[item].parts.length; sash++) {
                  tempSashBlockSize.push(template.objects[item].parts[sash].lengthVal);
                }
                tempSashBlock.sizes = tempSashBlockSize;
                tempSashBlock.openDir = template.objects[item].openDir;
                objXFormedPrice.sashesBlock.push(tempSashBlock);
                break;
              case 'glass_paсkage':
                var tempGlassSizes = [];
                for (var glass = 0; glass < template.objects[item].parts.length; glass++) {
                  tempGlassSizes.push(template.objects[item].parts[glass].lengthVal);
                }
                objXFormedPrice.glassSizes.push(tempGlassSizes);
                objXFormedPrice.glassSquares.push(template.objects[item].square);
                break;
              case 'dimensionsH':
                ProductStor.product.templateWidth = template.objects[item].lengthVal;
                break;
              case 'dimensionsV':
                ProductStor.product.templateHeight = template.objects[item].lengthVal;
                break;
            }
          }
        }
        //console.log('objXFormedPrice+++++++', JSON.stringify(objXFormedPrice));

        console.log('START PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());
        //--------- get product price
        calculationPrice(objXFormedPrice);

        //------ calculate coeffs
        calculateCoeffs(objXFormedPrice);

      });

    }


    //------------ set Bead Id
    function setBeadId(profileId, glassId) {
      var deferred = $q.defer(),
          parentId, glassDepth;
      //------ define Bead Id for define template price
      globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'id': glassId }).then(function(result) {
        if(result) {
          parentId = result[0].parent_element_id;
          //------ find glass depth
          globalDB.selectDBGlobal(globalDB.elementsTableDBGlobal, {'id': parentId }).then(function(result) {
            if(result) {
              glassDepth = result[0].glass_width;
              //------ find bead Id as to glass Depth and profile Id
              globalDB.selectDBGlobal(globalDB.beadsTableDBGlobal, {'profile_system_id': {"value": profileId, "union": 'AND'}, "glass_width": glassDepth}).then(function(result) {
                if(result) {
                  //ProductStor.product.beadId = result[0].list_id;
                  deferred.resolve(result[0].list_id);
                } else {
                  console.log(result);
                }
              });
            } else {
              console.log(result);
            }
          });
        } else {
          console.log(result);
        }
      });
      return deferred.promise;
    }


    //---------- Price define
    function calculationPrice(obj) {
      globalDB.calculationPrice(obj, function (result) {
        if(result.status){
//          console.log('price');
//          console.log(result.data);

          ProductStor.product.templatePriceSELECT = GeneralServ.roundingNumbers(result.data.price);
          setProductPriceTOTAL();
          //$cordovaProgress.hide();
          console.log('FINISH PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());
        } else {
          console.log(result);
        }
      });
    }


    //---------- Coeffs define
    function calculateCoeffs(objXFormedPrice) {
      var templateQty = ProductStor.product.template.objects.length,
          constructionSquareTotal,
          glassSquareTotal,
          prifileHeatCoeffTotal,
          glassHeatCoeffTotal,
          item;
      //------- total construction square define
      for (item = 0; item < templateQty; item++) {
        if(ProductStor.product.template.objects[item].type === "square") {
          constructionSquareTotal = ProductStor.product.template.objects[item].squares.reduce(function(a, b) {
            return a + b;
          });
        }
      }
      //-------- total glasses square define
      glassSquareTotal = objXFormedPrice.glassSquares.reduce(function(a, b) {
        return a + b;
      });
      //-------- coeffs define
      prifileHeatCoeffTotal = ProductStor.product.profileHeatCoeff * (constructionSquareTotal - glassSquareTotal);
      glassHeatCoeffTotal = ProductStor.product.glassHeatCoeff * glassSquareTotal;
      //-------- calculate Heat Coeff Total
      ProductStor.product.heatTransferTOTAL = GeneralServ.roundingNumbers( ((prifileHeatCoeffTotal + glassHeatCoeffTotal)/constructionSquareTotal) );

      //-------- calculate Air Coeff Total
      //ProductStor.product.airCirculationTOTAL = + ProductStor.product.profileAirCoeff + ProductStor.product.glassAirCoeff + ProductStor.product.hardwareAirCoeff;

    }



    function setProductPriceTOTAL() {
      //playSound('price');
      ProductStor.product.productPriceTOTAL = GeneralServ.roundingNumbers(ProductStor.product.templatePriceSELECT + ProductStor.product.laminationPriceSELECT + ProductStor.product.addElementsPriceSELECT);
      $rootScope.$apply();
    }




    function createNewProject() {
      console.log('new project!!!!!!!!!!!!!!');
      //------- create new empty product and order
      ProductStor.product = ProductStor.setDefaultProduct();
      OrderStor.order = OrderStor.setDefaultOrder();
      //------- set new orderId
      createOrderData();
      //------- set new templates
      prepareTemplates(ProductStor.product.constructionType);
    }



    function createNewProduct() {
      console.log('new product!!!!!!!!!!!!!!!');
      //------- create new empty product
      ProductStor.product = ProductStor.setDefaultProduct();
      //------- set new templates
      prepareTemplates(ProductStor.product.constructionType);
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

      //---------- if EDIT Product
      if(GlobalStor.global.productEditNumber) {
        //-------- replace product in order LocalStorage
        for(var prod = 0; prod < OrderStor.order.products.length; prod++) {
          if(prod === GlobalStor.global.productEditNumber) {
            OrderStor.order.products[prod] = angular.copy(ProductStor.product);
          }
        }
        editProductInLocalDB(ProductStor.product);
      //---------- if New Product
      } else {
        //-------- add product in order LocalStorage
        ProductStor.product.orderId = OrderStor.order.orderId;
        ProductStor.product.productId = (OrderStor.order.productsQty > 0) ? (OrderStor.order.productsQty + 1) : 1;
        //-------- insert product in order
        OrderStor.order.products.push(ProductStor.product);
        OrderStor.order.productsQty = ProductStor.product.productId;
        insertProductInLocalDB(ProductStor.product);
      }
      GlobalStor.global.isCreatedNewProject = false;
      GlobalStor.global.isCreatedNewProduct = false;

    }



    //-------- save Order into Local DB
    function insertProductInLocalDB(product) {

      var productData = angular.copy(product),
          addElementsQty = product.chosenAddElements.length,
          prop = 0, addElementsData;

      console.log('!!!!!!!!!! product !!!!!!!!!!!', product);
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


      localDB.insertDB(localDB.productsTableBD, productData);

      //--------- insert additional elements into local DB
      for(; prop < addElementsQty; prop++) {
        var elementsQty = product.chosenAddElements[prop].length,
            elem = 0;
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

      //--------- moving to Cart when click on Cart button
      $timeout(function() {
        //------- set previos Page
        GlobalStor.global.prevOpenPage = GlobalStor.global.currOpenPage;
        ProductStor.product = ProductStor.setDefaultProduct();
        $location.path('/cart');
      }, 500);
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
      }

      OrderStor.order.orderType = orderType;
      OrderStor.order.orderStyle = orderStyle;
      angular.extend(OrderStor.order, newOptions);
      //------- save order in LocalDB
      delete OrderStor.order.products;
console.log('+++++',OrderStor.order);
      localDB.insertDB(localDB.ordersTableBD, OrderStor.order);
      //----- cleaning order
      OrderStor.order = OrderStor.setDefaultOrder();
    }

    //-------- delete order from LocalDB
    function deleteOrderFromLocalDB(orderNum) {
      localDB.deleteDB(localDB.ordersTableBD, {'orderId': orderNum});
      localDB.deleteDB(localDB.productsTableBD, {'orderId': orderNum});
      localDB.deleteDB(localDB.addElementsTableBD, {'orderId': orderNum});
    }



  }
})();
