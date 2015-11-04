(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory($location, $q, $filter, $timeout, globalConstants, localDB, GeneralServ, SVGServ, loginServ, optionsServ, AnalyticsServ, GlobalStor, OrderStor, ProductStor, UserStor, AuxStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      saveUserEntry: saveUserEntry,
      createOrderData: createOrderData,
      createOrderID: createOrderID,
      setCurrDiscounts: setCurrDiscounts,
      prepareTemplates: prepareTemplates,
      //downloadAllTemplates: downloadAllTemplates,

      setCurrentProfile: setCurrentProfile,
      setCurrentGlass: setCurrentGlass,
      setGlassToTemplateBlocks: setGlassToTemplateBlocks,
      setCurrentHardware: setCurrentHardware,
      fineItemById: fineItemById,
      parseTemplate: parseTemplate,
      saveTemplateInProduct: saveTemplateInProduct,
      checkSashInTemplate: checkSashInTemplate,
      preparePrice: preparePrice,
      setProductPriceTOTAL: setProductPriceTOTAL,
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
        setCurrentHardware(ProductStor.product);
        var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
        preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, hardwareIds).then(function() {
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
      setCurrentGlass(ProductStor.product);
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
      //------- cleaning glass in product
      product.glass.length = 0;
      if(id) {
        //----- get Glass Ids from template and check dublicates
        var glassIds = GeneralServ.removeDuplicates(getGlassFromTemplateBlocks()),
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
          GlobalStor.global.selectLastGlassId = product.glass[0].id;
          /** set Glass to all template blocks without children */
          setGlassToTemplateBlocks(0, product.glass[0].id, product.glass[0].sku);
        }
      }
    }


    function getGlassFromTemplateBlocks() {
      var blocksQty = ProductStor.product.template_source.details.length,
          glassIds = [];
      while(--blocksQty > 0) {
        if(!ProductStor.product.template_source.details[blocksQty].children.length) {
          if(ProductStor.product.template_source.details[blocksQty].glassId) {
            glassIds.push(angular.copy(ProductStor.product.template_source.details[blocksQty].glassId));
          }
        }
      }
      return glassIds;
    }



    function setGlassToTemplateBlocks(blockId, glassId, glassName) {
      var blocksQty = ProductStor.product.template_source.details.length;
      while(--blocksQty > 0) {
        if(blockId) {
          /** set glass to template block by its Id */
          if(ProductStor.product.template_source.details[blocksQty].id === blockId) {
            ProductStor.product.template_source.details[blocksQty].glassId = glassId;
            ProductStor.product.template_source.details[blocksQty].glassTxt = glassName;
            break;
          }
        } else {
          /** set glass to all template blocks */
          if(!ProductStor.product.template_source.details[blocksQty].children.length) {
            ProductStor.product.template_source.details[blocksQty].glassId = glassId;
            ProductStor.product.template_source.details[blocksQty].glassTxt = glassName;
          }
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
    function preparePrice(template, profileId, glassIds, hardwareId) {
      var deferred = $q.defer();
      GlobalStor.global.isLoader = 1;
      setBeadId(profileId).then(function(beadResult) {
        var beadIds = GeneralServ.removeDuplicates(angular.copy(beadResult).map(function(item) {
              var beadQty = template.priceElements.beadsSize.length;
              while(--beadQty > -1) {
                if(template.priceElements.beadsSize[beadQty].glassId === item.glassId) {
                  template.priceElements.beadsSize[beadQty].elemId = item.beadId;
                }
              }
              return item.beadId;
            })),
            objXFormedPrice = {
              laminationId: ProductStor.product.lamination_in_id,
              ids: [
                ProductStor.product.profile.rama_list_id,
                ProductStor.product.profile.rama_still_list_id,
                ProductStor.product.profile.stvorka_list_id,
                ProductStor.product.profile.impost_list_id,
                ProductStor.product.profile.shtulp_list_id,
                (glassIds.length > 1) ? glassIds.map(function(item){ return item.id; }) : glassIds[0].id,
                (beadIds.length > 1) ? beadIds : beadIds[0],
                hardwareId
              ],
              sizes: []
            };

        //------- fill objXFormedPrice for sizes
        for(var size in template.priceElements) {
          objXFormedPrice.sizes.push(angular.copy(template.priceElements[size]));
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
              localDB.selectLocalDB(localDB.tablesLocalDB.beed_profile_systems.tableName, {'profile_system_id': profileId, "glass_width": item.glass_width}, 'list_id').then(function (result) {
                if(result.length) {
                  var beadObj = {
                    glassId: item.id,
                    beadId: result[0].list_id
                  };
                  defer2.resolve(beadObj);
                } else {
                  console.log('Error!!', result);
                  defer2.resolve(0);
                }
              });
              return defer2.promise;
            }
          });
      defer.resolve($q.all(promises));
      return defer.promise;
    }


    //---------- Price define
    function calculationPrice(obj) {
      var deferred = $q.defer();
      localDB.calculationPrice(obj).then(function (result) {
        console.log('price-------', result);
        if(result.priceTotal){
          ProductStor.product.template_price = GeneralServ.addMarginToPrice(result.priceTotal, GlobalStor.global.margins.coeff);
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
                  report[reportQty].priceReal = GeneralServ.roundingNumbers(GeneralServ.addMarginToPrice(report[reportQty].priceReal, GlobalStor.global.margins.coeff), 3);
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

      /** ===== SAVE PRODUCTS =====*/

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


        /** ====== SAVE Report Data ===== */

        var productReportData = angular.copy(OrderStor.order.products[p].report),
            reportQty = productReportData.length;
        console.log('productReportData', productReportData);
        while(--reportQty > -1) {
          productReportData[reportQty].order_id = OrderStor.order.id;
          productReportData[reportQty].price = angular.copy(productReportData[reportQty].priceReal);
          delete productReportData[reportQty].priceReal;
          //-------- insert product Report into local DB
//          localDB.insertRowLocalDB(productReportData[reportQty], localDB.tablesLocalDB.order_elements.tableName);
          //-------- send Report to Server
//TODO          localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.order_elements.tableName, productReportData[reportQty]);
        }

        /**============= SAVE ADDELEMENTS ============ */

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

      /** ============ SAVE ORDER =========== */

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
